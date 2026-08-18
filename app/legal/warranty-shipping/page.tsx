import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Warranty & Shipping Policy | Auriga Racing",
  description: "Warranty and Shipping information for Auriga Racing",
}

export default function WarrantyShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Warranty & Shipping Policy</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Warranty</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            All Auriga Racing products come with a manufacturer's warranty against defects in materials and workmanship.
            Warranty periods vary by product:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Speed Skating Boots: 1 year from purchase date</li>
            <li>Frames and Blades: 2 years from purchase date</li>
            <li>Wheels and Bearings: 90 days from purchase date</li>
            <li>Apparel and Accessories: 6 months from purchase date</li>
          </ul>
          <p className="leading-relaxed">
            The warranty does not cover normal wear and tear, misuse, abuse, or damage caused by accidents or
            unauthorized modifications.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Warranty Claims</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">To make a warranty claim:</p>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>Contact our customer service team with your order number and photos of the defect</li>
            <li>Our team will review your claim within 2-3 business days</li>
            <li>If approved, we will provide instructions for return or replacement</li>
            <li>Shipping costs for warranty returns are covered by Auriga Racing</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping Options</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">We offer multiple shipping options to meet your needs:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Standard Shipping</strong> (5-7 business days): Free on orders over $100
            </li>
            <li>
              <strong>Express Shipping</strong> (2-3 business days): $15.99
            </li>
            <li>
              <strong>Overnight Shipping</strong> (1 business day): $29.99
            </li>
            <li>
              <strong>International Shipping</strong>: Rates calculated at checkout
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Processing</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            Orders are typically processed within 1-2 business days. You will receive a tracking number via email once
            your order ships. Please allow additional time during peak seasons and holidays.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>International Shipping</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            We ship to most countries worldwide. International customers are responsible for any customs duties, taxes,
            or fees imposed by their country. Delivery times vary by destination and customs processing.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            For questions about warranty or shipping, please contact us at support@aurigaracing.com or call
            1-800-RACING-1
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
