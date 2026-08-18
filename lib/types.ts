export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: "customer" | "manager" | "admin"
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price_in_cents: number
  category_id: string | null
  image_url: string | null
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  user?: User
}

export interface Order {
  id: string
  user_id: string | null
  total_amount_in_cents: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  stripe_payment_intent_id: string | null
  shipping_address: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  created_at: string
  updated_at: string
  user?: User
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price_in_cents: number
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}
