import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Disclaimer | Auriga Racing",
  description: "Legal disclaimer for Auriga Racing",
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Website Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            The information provided on the Auriga Racing website is for general informational purposes only. While we
            strive to keep the information up to date and correct, we make no representations or warranties of any kind,
            express or implied, about the completeness, accuracy, reliability, suitability, or availability of the
            website or the information, products, services, or related graphics contained on the website.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Usage</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            Speed skating and cycling are physically demanding sports that carry inherent risks. Users of our equipment
            assume all risks associated with these activities. Auriga Racing is not responsible for injuries or damages
            resulting from the use of our products.
          </p>
          <p className="leading-relaxed">
            We strongly recommend that all users wear appropriate safety equipment, including helmets and protective
            gear, and follow all safety guidelines and local regulations when participating in these sports.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Professional Advice</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            The information on this website is not intended to replace professional advice. Before beginning any new
            sport or physical activity, consult with a qualified healthcare provider or sports professional to ensure it
            is appropriate for your fitness level and health status.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>External Links</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            Our website may contain links to external websites that are not operated by us. We have no control over the
            content and practices of these sites and cannot accept responsibility or liability for their respective
            privacy policies or content.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            In no event shall Auriga Racing be liable for any direct, indirect, incidental, consequential, special, or
            exemplary damages arising from your use of the website or products, even if we have been advised of the
            possibility of such damages.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes to Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon
            posting to the website. Your continued use of the website after any changes indicates your acceptance of the
            updated disclaimer.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
