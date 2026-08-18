import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy | Auriga Racing",
  description: "Privacy Policy for Auriga Racing e-commerce platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            At Auriga Racing, we collect information that you provide directly to us when you create an account, make a
            purchase, or contact us. This includes your name, email address, phone number, shipping address, billing
            address, and payment information.
          </p>
          <p className="leading-relaxed">
            We also automatically collect certain information about your device when you use our website, including your
            IP address, browser type, operating system, and browsing behavior.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Information Sharing</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Service providers who help us operate our business (payment processors, shipping companies)</li>
            <li>Law enforcement when required by law</li>
            <li>Business partners with your consent</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Object to certain processing of your information</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at privacy@aurigaracing.com
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
