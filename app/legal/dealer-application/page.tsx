import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Dealer Application | Auriga Racing",
  description: "Apply to become an authorized Auriga Racing dealer",
}

export default function DealerApplicationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Dealer Application</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Partner with Auriga Racing</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            Thank you for your interest in becoming an authorized Auriga Racing dealer. We are looking for professional
            retailers and distributors who share our passion for speed skating and cycling excellence.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="list-disc pl-6 space-y-2">
            <li>Established retail or online business in the sporting goods industry</li>
            <li>Demonstrated experience with speed skating or cycling equipment</li>
            <li>Commitment to maintaining adequate inventory levels</li>
            <li>Professional staff trained in product knowledge and customer service</li>
            <li>Valid business license and tax identification</li>
            <li>Physical retail location or established e-commerce presence</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="list-disc pl-6 space-y-2">
            <li>Competitive wholesale pricing</li>
            <li>Exclusive territorial rights (where applicable)</li>
            <li>Marketing support and promotional materials</li>
            <li>Product training and technical support</li>
            <li>Early access to new products</li>
            <li>Co-op advertising opportunities</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" placeholder="Your Business Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person *</Label>
                <Input id="contact" placeholder="Full Name" required />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="business@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address *</Label>
              <Input id="address" placeholder="Street Address" required />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="City" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input id="state" placeholder="State" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP/Postal Code *</Label>
                <Input id="zip" placeholder="12345" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" placeholder="https://yourbusiness.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Years in Business *</Label>
              <Input id="years" type="number" placeholder="5" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience with Speed Skating/Cycling Products *</Label>
              <Textarea
                id="experience"
                placeholder="Please describe your experience selling speed skating or cycling equipment..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to partner with Auriga Racing? *</Label>
              <Textarea id="reason" placeholder="Tell us why you would be a great partner..." rows={4} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional">Additional Information</Label>
              <Textarea id="additional" placeholder="Any other information you'd like to share..." rows={3} />
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto">
              Submit Application
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            * Required fields. We will review your application and respond within 5-7 business days.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
