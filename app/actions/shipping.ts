"use server"

import { createServerClient } from "@/lib/supabase/server"
import {
  assignAwb,
  checkServiceability,
  createShiprocketOrder as createShiprocketOrderApi,
  isShiprocketConfigured,
  trackShipmentByShipmentId,
} from "@/lib/shiprocket"

// Weight isn't tracked per-product yet, so we estimate using a per-item
// heuristic. Adjust here if products gain a real weight field later.
function estimateWeightKg(itemCount: number): number {
  return Math.max(0.5, itemCount * 0.3)
}

export async function checkShippingServiceability(postalCode: string, itemCount: number) {
  if (!isShiprocketConfigured()) {
    return { error: "Shipping is not configured yet. Please contact support." }
  }

  const pickupPostcode = process.env.SHIPROCKET_PICKUP_PINCODE
  if (!pickupPostcode) {
    return { error: "Shipping origin is not configured yet. Please contact support." }
  }

  const cleanPincode = postalCode.trim()
  if (!/^\d{4,10}$/.test(cleanPincode)) {
    return { error: "Enter a valid PIN / postal code" }
  }

  const weightKg = estimateWeightKg(itemCount)
  const result = await checkServiceability({
    pickupPostcode,
    deliveryPostcode: cleanPincode,
    weightKg,
  })

  if (!result.serviceable || !result.cheapest) {
    return { serviceable: false }
  }

  return {
    serviceable: true,
    shippingFeeInCents: Math.round(result.cheapest.rate * 100),
    etaDays: result.cheapest.etd,
    courierName: result.cheapest.courier_name,
    courierId: result.cheapest.courier_company_id,
  }
}

export async function createShiprocketOrderForOrder(orderId: string) {
  if (!isShiprocketConfigured()) {
    console.error("[v0] Skipping Shiprocket order creation: SHIPROCKET_EMAIL/PASSWORD not set")
    return { error: "Shiprocket is not configured" }
  }

  const supabase = await createServerClient()

  const { data: order } = await supabase
    .from("orders")
    .select(`*, order_items(*, product:products(*))`)
    .eq("id", orderId)
    .single()

  if (!order) {
    return { error: "Order not found" }
  }

  if (order.shiprocket_shipment_id) {
    return { success: true, alreadyCreated: true }
  }

  try {
    const shipping = order.shipping_address as {
      name: string
      street: string
      city: string
      state: string
      zip: string
      country: string
      phone?: string
      email?: string
    }

    const [firstName, ...restName] = (shipping.name || "Customer").split(" ")
    const items = (order.order_items || []).map((item: any) => ({
      name: item.product?.name || "Product",
      sku: item.product_id || item.id,
      units: item.quantity,
      selling_price: item.price_in_cents / 100,
    }))

    const created = await createShiprocketOrderApi({
      orderId: order.id,
      orderDate: new Date(order.created_at).toISOString().slice(0, 19).replace("T", " "),
      billingCustomerName: firstName,
      billingLastName: restName.join(" "),
      billingAddress: shipping.street,
      billingCity: shipping.city,
      billingPincode: shipping.zip,
      billingState: shipping.state,
      billingCountry: shipping.country,
      billingEmail: shipping.email || "",
      billingPhone: shipping.phone || "",
      items,
      subTotal: order.total_amount_in_cents / 100,
      weightKg: estimateWeightKg(items.length),
    })

    let awbCode: string | undefined
    let courierName: string | undefined
    try {
      const assigned = await assignAwb(created.shipment_id, order.shiprocket_courier_id || undefined)
      awbCode = assigned.awb_code
      courierName = assigned.courier_name
    } catch (awbError) {
      console.error("[v0] AWB assignment failed:", awbError)
    }

    await supabase
      .from("orders")
      .update({
        shiprocket_order_id: created.order_id,
        shiprocket_shipment_id: created.shipment_id,
        awb_code: awbCode || null,
        courier_name: courierName || order.courier_name || null,
        status: "processing",
      })
      .eq("id", orderId)

    await supabase.from("order_tracking").upsert(
      {
        order_id: orderId,
        tracking_number: awbCode || null,
        carrier: courierName || order.courier_name || null,
        status: "processing",
      },
      { onConflict: "order_id" },
    )

    return { success: true, shipmentId: created.shipment_id, awbCode }
  } catch (error) {
    console.error("[v0] Failed to create Shiprocket order:", error)
    return { error: error instanceof Error ? error.message : "Failed to create shipment" }
  }
}

export async function refreshOrderTracking(orderId: string) {
  const supabase = await createServerClient()

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single()
  if (!order) {
    return { error: "Order not found" }
  }

  if (!order.shiprocket_shipment_id) {
    return { error: "No shipment created for this order yet" }
  }

  try {
    const tracking = await trackShipmentByShipmentId(order.shiprocket_shipment_id)
    const latestCheckpoint = tracking.checkpoints?.[0]

    await supabase.from("order_tracking").upsert(
      {
        order_id: orderId,
        tracking_number: order.awb_code || null,
        carrier: order.courier_name || null,
        status: tracking.status || "processing",
        location: latestCheckpoint?.location || null,
        estimated_delivery: tracking.estimatedDelivery || null,
      },
      { onConflict: "order_id" },
    )

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to refresh tracking:", error)
    return { error: error instanceof Error ? error.message : "Failed to refresh tracking" }
  }
}
