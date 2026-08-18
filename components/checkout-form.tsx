"use client"

import type React from "react"
import { createCheckoutSession } from "@/app/actions/stripe"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CartItem, User } from "@/lib/types"
import { MapPin } from "lucide-react"
import { countries } from "@/lib/countries"

interface Address {
  id: string
  first_name: string
  last_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export function CheckoutForm({
  cartItems,
  user,
  subtotal,
  addresses,
  onSubmit,
}: {
  cartItems: CartItem[]
  user: User | null
  subtotal: number
  addresses: Address[]
  onSubmit?: (isLoading: boolean, error: string | null) => void
}) {
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0)
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((addr) => addr.is_default)?.id || addresses[0]?.id || "",
  )
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    company: "",
    country: "United States",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    orderNotes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateParentState = (loading: boolean, errorMsg: string | null) => {
    setIsLoading(loading)
    setError(errorMsg)
    onSubmit?.(loading, errorMsg)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateParentState(true, null)

    try {
      let shippingData

      if (!useNewAddress && selectedAddressId) {
        const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)
        if (selectedAddress) {
          shippingData = {
            name: `${selectedAddress.first_name} ${selectedAddress.last_name}`,
            street: selectedAddress.address_line1,
            apartment: selectedAddress.address_line2 || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip: selectedAddress.postal_code,
            country: selectedAddress.country,
            phone: selectedAddress.phone,
          }
        }
      } else {
        shippingData = {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zip: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        }
      }

      const result = await createCheckoutSession(shippingData)

      if (result.error) {
        updateParentState(false, result.error)
        return
      }

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      updateParentState(false, error instanceof Error ? error.message : "Failed to process checkout")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="checkout-form">
      <Card>
        <CardHeader>
          <CardTitle>Billing Details</CardTitle>
          <CardDescription>Enter your billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">
                First name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">
                Last name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company">Company name (optional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>Select a saved address or enter a new one</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 && (
            <RadioGroup
              value={useNewAddress ? "new" : "saved"}
              onValueChange={(value) => setUseNewAddress(value === "new")}
            >
              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="saved" id="saved" />
                <Label htmlFor="saved" className="font-medium cursor-pointer">
                  Use a saved address
                </Label>
              </div>

              {!useNewAddress && (
                <div className="space-y-3 ml-6 mb-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {address.first_name} {address.last_name}
                          </span>
                          {address.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        {address.phone && <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="font-medium cursor-pointer">
                  Enter a new address
                </Label>
              </div>
            </RadioGroup>
          )}

          {useNewAddress && (
            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="country">
                  Country / Region <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                  required
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="street">
                  Street address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  type="text"
                  required={useNewAddress}
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apartment">Apartment, suite, unit, etc. (optional)</Label>
                <Input
                  id="apartment"
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">
                  Town / City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  required={useNewAddress}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    required={useNewAddress}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    type="text"
                    required={useNewAddress}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Optional notes about your order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="orderNotes">Order notes (optional)</Label>
            <Textarea
              id="orderNotes"
              placeholder="Notes about your order, e.g. special notes for delivery."
              rows={4}
              value={formData.orderNotes}
              onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        By placing your order, you agree to our terms and conditions.
      </p>
    </form>
  )
}
