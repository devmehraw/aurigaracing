import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Terms & Conditions | Auriga Racing",
  description: "Terms and Conditions for Auriga Racing e-commerce platform",
}

export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            By accessing and using Auriga Racing website, you accept and agree to be bound by these Terms and
            Conditions. If you do not agree to these terms, please do not use our website or services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Use of Website</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            You agree to use this website only for lawful purposes and in a way that does not infringe the rights of,
            restrict, or inhibit anyone else's use and enjoyment of the website.
          </p>
          <p className="leading-relaxed">
            Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting
            obscene or offensive content, or disrupting the normal flow of dialogue within our website.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
            descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. We reserve
            the right to correct any errors, inaccuracies, or omissions at any time without prior notice.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Orders and Payment</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            By placing an order, you are making an offer to purchase products. All orders are subject to acceptance and
            product availability. We reserve the right to refuse or cancel any order for any reason.
          </p>
          <p className="leading-relaxed">
            Payment must be received before orders are dispatched. We accept major credit cards, debit cards, and PayPal
            through our secure payment gateway.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            All content on this website, including text, graphics, logos, images, and software, is the property of
            Auriga Racing or its content suppliers and is protected by international copyright laws. You may not
            reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            Auriga Racing shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            resulting from your use of or inability to use the website or products purchased through the website.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            For questions about these Terms & Conditions, please contact us at legal@aurigaracing.com
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
