"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Search, Eye, User, MapPin, CalendarIcon, Filter, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  created_at: string
  status: string
  payment_status: string
  total_amount_in_cents: number
  delivery_date: string | null
  user: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  shipping_address: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
  }
  order_items: Array<{
    id: string
    quantity: number
    price_in_cents: number
    product: {
      name: string
    }
  }>
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"]

export function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<Date>()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogType, setDialogType] = useState<"customer" | "billing" | null>(null)
  const router = useRouter()

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.user.first_name} ${order.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate = dateFilter
        ? format(new Date(order.created_at), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")
        : true

      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter

      return matchesSearch && matchesDate && matchesStatus && matchesPayment
    })
  }, [orders, searchTerm, dateFilter, statusFilter, paymentFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (!error) {
      router.refresh()
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (!error) {
      router.refresh()
    }
  }

  const updateDeliveryDate = async (orderId: string, date: Date) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ delivery_date: date.toISOString(), updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (!error) {
      router.refresh()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "paid":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
            </PopoverContent>
          </Popover>

          {dateFilter && (
            <Button variant="ghost" size="icon" onClick={() => setDateFilter(undefined)}>
              <X className="h-4 w-4" />
            </Button>
          )}

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {order.user.first_name} {order.user.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">{order.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(order.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{order.order_items.length}</TableCell>
                  <TableCell className="font-semibold">${(order.total_amount_in_cents / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge className={cn("text-white", getStatusColor(order.status))}>{order.status}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.payment_status}
                      onValueChange={(value) => updatePaymentStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                          <Badge className={cn("text-white", getPaymentStatusColor(order.payment_status))}>
                            {order.payment_status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-[140px] justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {order.delivery_date ? format(new Date(order.delivery_date), "MMM dd") : "Set date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={order.delivery_date ? new Date(order.delivery_date) : undefined}
                          onSelect={(date) => date && updateDeliveryDate(order.id, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order)
                              setDialogType("customer")
                            }}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Customer Information</DialogTitle>
                            <DialogDescription>Order #{order.id.slice(0, 8)}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Name</p>
                              <p className="text-sm text-muted-foreground">
                                {order.user.first_name} {order.user.last_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">{order.user.email}</p>
                            </div>
                            {order.user.phone && (
                              <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">Order Items</p>
                              <div className="mt-2 space-y-2">
                                {order.order_items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span>
                                      {item.product.name} x{item.quantity}
                                    </span>
                                    <span>${(item.price_in_cents / 100).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order)
                              setDialogType("billing")
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Billing & Shipping Details</DialogTitle>
                            <DialogDescription>Order #{order.id.slice(0, 8)}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-2">Shipping Address</p>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{order.shipping_address.name}</p>
                                <p>{order.shipping_address.street}</p>
                                <p>
                                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                                  {order.shipping_address.zip}
                                </p>
                                <p>{order.shipping_address.country}</p>
                                {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                              </div>
                            </div>
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium mb-2">Order Summary</p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>${(order.total_amount_in_cents / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t">
                                  <span>Total</span>
                                  <span>${(order.total_amount_in_cents / 100).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  )
}
