import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "FAQs | Auriga Racing",
  description: "Frequently Asked Questions about Auriga Racing products and services",
}

export default function FAQsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ordering & Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I place an order?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account
                or log in, then provide shipping information and payment details to complete your order.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal through our
                secure payment gateway powered by Stripe.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I cancel or modify my order?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                You can cancel your order within 24 hours of placement if it hasn't shipped yet. Log in to your account,
                go to "My Orders," and use the cancel button. For modifications, please contact customer service
                immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Yes, we use industry-standard SSL encryption and process all payments through Stripe, a PCI-compliant
                payment processor. We never store your complete credit card information on our servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping & Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-5">
              <AccordionTrigger>How long does shipping take?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight
                shipping delivers in 1 business day. International shipping times vary by destination.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Yes, we ship to most countries worldwide. Shipping costs and delivery times are calculated at checkout
                based on your location. Note that international customers are responsible for customs duties and taxes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Once your order ships, you'll receive an email with a tracking number. You can also view tracking
                information by logging into your account and checking your order history.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>What if my package is lost or damaged?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                If your package is lost in transit or arrives damaged, please contact our customer service team
                immediately. We'll work with the carrier to resolve the issue and ensure you receive your products.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Products & Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-9">
              <AccordionTrigger>How do I choose the right size for boots?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Each product page includes a detailed sizing chart. We recommend measuring your feet and referring to
                the manufacturer's specific sizing guide. If you're between sizes, we generally recommend sizing up for
                a more comfortable fit with thick socks.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>What's the difference between inline and ice speed skating equipment?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Inline speed skating uses boots with frames and wheels for skating on pavement, while ice speed skating
                uses boots with blades for ice rinks. The techniques are similar, but the equipment is specifically
                designed for each surface.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger>Do you offer equipment packages for beginners?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Yes, we offer complete skate packages that include boots, frames/blades, wheels/bearings, and sometimes
                protective gear. These packages are great value for beginners and ensure all components are compatible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
              <AccordionTrigger>How often should I replace wheels or blades?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                It depends on usage frequency and skating style. Wheels typically last 500-1000 km, while blades can
                last several seasons with proper sharpening. Watch for excessive wear, flat spots, or performance
                decline.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Returns & Warranty</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-13">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                We accept returns within 30 days of delivery for unused products in original packaging. Custom or
                personalized items cannot be returned unless defective. Return shipping costs are the customer's
                responsibility unless the item is defective.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14">
              <AccordionTrigger>How long is the warranty period?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Warranty periods vary by product type: boots (1 year), frames/blades (2 years), wheels/bearings (90
                days), and apparel (6 months). See our Warranty & Shipping Policy page for complete details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15">
              <AccordionTrigger>How do I make a warranty claim?</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                Contact our customer service with your order number and photos of the issue. We'll review your claim
                within 2-3 business days and provide return instructions if approved. Shipping for warranty returns is
                covered by us.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
