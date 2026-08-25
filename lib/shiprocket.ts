import "server-only"

// Minimal Shiprocket REST API client.
// Docs: https://apidocs.shiprocket.in/
//
// Shiprocket uses email/password login to obtain a bearer token (valid ~10 days).
// We cache the token in memory for the life of the server process and only
// re-authenticate when it's missing or a request comes back 401.

const BASE_URL = "https://apiv2.shiprocket.in/v1/external"

let cachedToken: string | null = null
let cachedTokenExpiresAt = 0

export function isShiprocketConfigured(): boolean {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD)
}

async function login(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD

  if (!email || !password) {
    throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD are not set.")
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Shiprocket login failed (${res.status}): ${text}`)
  }

  const json = (await res.json()) as { token?: string }
  if (!json.token) {
    throw new Error("Shiprocket login did not return a token.")
  }

  cachedToken = json.token
  // Tokens are valid ~10 days; refresh a little early to be safe.
  cachedTokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000
  return cachedToken
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) {
    return cachedToken
  }
  return login()
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const token = await getToken()

  let url = `${BASE_URL}${path}`
  if (options.query) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) params.set(key, String(value))
    }
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }

  const doFetch = async (bearer: string) =>
    fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    })

  let res = await doFetch(token)

  // Token may have expired server-side before our cached TTL; retry once with a fresh login.
  if (res.status === 401) {
    cachedToken = null
    const freshToken = await getToken()
    res = await doFetch(freshToken)
  }

  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }

  if (!res.ok) {
    const message =
      (json as { message?: string })?.message || `Shiprocket request failed (${res.status}): ${path}`
    throw new Error(message)
  }

  return json as T
}

export type ShiprocketCourier = {
  courier_company_id: number
  courier_name: string
  rate: number
  etd: string
  estimated_delivery_days?: string
  rating?: number
  is_surface?: number
}

export type ServiceabilityResult = {
  serviceable: boolean
  cheapest?: ShiprocketCourier
  couriers: ShiprocketCourier[]
}

export async function checkServiceability(params: {
  pickupPostcode: string
  deliveryPostcode: string
  weightKg: number
  codAmount?: number
}): Promise<ServiceabilityResult> {
  try {
    const data = await request<{
      data?: { available_courier_companies?: ShiprocketCourier[] }
    }>("/courier/serviceability/", {
      query: {
        pickup_postcode: params.pickupPostcode,
        delivery_postcode: params.deliveryPostcode,
        weight: params.weightKg,
        cod: params.codAmount ? 1 : 0,
      },
    })

    const couriers = data.data?.available_courier_companies || []
    if (couriers.length === 0) {
      return { serviceable: false, couriers: [] }
    }

    const cheapest = couriers.reduce((min, c) => (c.rate < min.rate ? c : min), couriers[0])
    return { serviceable: true, cheapest, couriers }
  } catch (error) {
    console.error("[v0] Shiprocket serviceability check failed:", error)
    return { serviceable: false, couriers: [] }
  }
}

export type ShiprocketOrderItem = {
  name: string
  sku: string
  units: number
  selling_price: number
}

export type CreateShiprocketOrderInput = {
  orderId: string
  orderDate: string
  billingCustomerName: string
  billingLastName?: string
  billingAddress: string
  billingCity: string
  billingPincode: string
  billingState: string
  billingCountry: string
  billingEmail: string
  billingPhone: string
  items: ShiprocketOrderItem[]
  subTotal: number
  weightKg: number
}

export type CreateShiprocketOrderResult = {
  order_id: number
  shipment_id: number
  status: string
  status_code: number
}

export async function createShiprocketOrder(
  input: CreateShiprocketOrderInput,
): Promise<CreateShiprocketOrderResult> {
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary"

  return request<CreateShiprocketOrderResult>("/orders/create/adhoc", {
    method: "POST",
    body: {
      order_id: input.orderId,
      order_date: input.orderDate,
      pickup_location: pickupLocation,
      billing_customer_name: input.billingCustomerName,
      billing_last_name: input.billingLastName || "",
      billing_address: input.billingAddress,
      billing_city: input.billingCity,
      billing_pincode: input.billingPincode,
      billing_state: input.billingState,
      billing_country: input.billingCountry,
      billing_email: input.billingEmail,
      billing_phone: input.billingPhone,
      shipping_is_billing: true,
      order_items: input.items,
      payment_method: "Prepaid",
      sub_total: input.subTotal,
      length: 15,
      breadth: 15,
      height: 10,
      weight: input.weightKg,
    },
  })
}

export async function assignAwb(shipmentId: number, courierId?: number): Promise<{
  awb_code?: string
  courier_name?: string
}> {
  const data = await request<{
    response?: { data?: { awb_code?: string; courier_name?: string } }
  }>("/courier/assign/awb", {
    method: "POST",
    body: courierId ? { shipment_id: shipmentId, courier_id: courierId } : { shipment_id: shipmentId },
  })

  return {
    awb_code: data.response?.data?.awb_code,
    courier_name: data.response?.data?.courier_name,
  }
}

export type ShiprocketTrackingResult = {
  status?: string
  currentLocation?: string
  estimatedDelivery?: string
  checkpoints?: { status: string; location?: string; date?: string }[]
}

export async function trackShipmentByShipmentId(shipmentId: number): Promise<ShiprocketTrackingResult> {
  const data = await request<{
    tracking_data?: {
      shipment_status?: number
      shipment_track?: { current_status?: string; edd?: string }[]
      shipment_track_activities?: { status?: string; location?: string; date?: string }[]
    }
  }>(`/courier/track/shipment/${shipmentId}`)

  const track = data.tracking_data
  const activities = track?.shipment_track_activities || []
  const latest = activities[0]

  return {
    status: track?.shipment_track?.[0]?.current_status,
    currentLocation: latest?.location,
    estimatedDelivery: track?.shipment_track?.[0]?.edd,
    checkpoints: activities.map((a) => ({ status: a.status || "", location: a.location, date: a.date })),
  }
}
