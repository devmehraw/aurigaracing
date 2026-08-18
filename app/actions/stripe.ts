"use server"

import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase/server"

export async function createCheckoutSession(formData: {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to checkout" }
  }

  try {
    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("user_id", user.id)

    if (cartError || !cartItems || cartItems.length === 0) {
      return { error: "Cart is empty" }
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description || "",
          images: item.product.image_url ? [item.product.image_url] : [],
        },
        unit_amount: item.product.price_in_cents,
      },
      quantity: item.quantity,
    }))

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price_in_cents * item.quantity, 0)

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount_in_cents: totalAmount,
        status: "pending",
        shipping_address: formData,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Order creation error:", orderError)
      return { error: "Failed to create order" }
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_in_cents: item.product.price_in_cents,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Order items error:", itemsError)
      return { error: "Failed to create order items" }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/cart`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error("[v0] Stripe error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function handleSuccessfulPayment(sessionId: string, orderId: string) {
  const supabase = await createServerClient()

  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Update order status and add payment intent ID
      const { error } = await supabase
        .from("orders")
        .update({
          status: "processing",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("id", orderId)

      if (error) {
        console.error("[v0] Order update error:", error)
        return { error: "Failed to update order" }
      }

      // Clear cart
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("cart_items").delete().eq("user_id", user.id)
      }

      return { success: true }
    }

    return { error: "Payment not completed" }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return { error: "Failed to verify payment" }
  }
}
