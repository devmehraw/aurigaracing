import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Distributors | Auriga Racing",
  description: "Authorized distributors of Auriga Racing products",
}

export default function DistributorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Authorized Distributors</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Distribution Network</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            Auriga Racing works with a carefully selected network of authorized distributors worldwide to ensure that
            our premium products reach athletes everywhere. Our distributors are trained professionals who understand
            the technical requirements of speed skating and cycling equipment.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>North America</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">United States</h3>
              <p className="text-sm leading-relaxed">
                <strong>Speed Central USA</strong>
                <br />
                123 Racing Boulevard, Los Angeles, CA 90001
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Email: info@speedcentralusa.com
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Canada</h3>
              <p className="text-sm leading-relaxed">
                <strong>Northern Speed Sports</strong>
                <br />
                456 Maple Avenue, Toronto, ON M5H 2N2
                <br />
                Phone: +1 (416) 555-7890
                <br />
                Email: contact@northernspeed.ca
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Europe</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Netherlands</h3>
              <p className="text-sm leading-relaxed">
                <strong>Dutch Speed Equipment BV</strong>
                <br />
                789 Kanaalstraat, 1012 AB Amsterdam
                <br />
                Phone: +31 20 555 1234
                <br />
                Email: info@dutchspeed.nl
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Germany</h3>
              <p className="text-sm leading-relaxed">
                <strong>Geschwindigkeit Sport GmbH</strong>
                <br />
                321 Sportstraße, 10115 Berlin
                <br />
                Phone: +49 30 555 6789
                <br />
                Email: kontakt@geschwindigkeit-sport.de
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Asia</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Japan</h3>
              <p className="text-sm leading-relaxed">
                <strong>Tokyo Speed Trading Co.</strong>
                <br />
                7-8-9 Shibuya, Tokyo 150-0002
                <br />
                Phone: +81 3 5555 1234
                <br />
                Email: info@tokyospeed.jp
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">South Korea</h3>
              <p className="text-sm leading-relaxed">
                <strong>Seoul Racing Equipment Ltd.</strong>
                <br />
                123 Gangnam-daero, Seoul 06000
                <br />
                Phone: +82 2 555 6789
                <br />
                Email: contact@seoulracing.kr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Become a Distributor</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="leading-relaxed mb-4">
            Interested in becoming an authorized Auriga Racing distributor? We are always looking for passionate
            partners who share our commitment to quality and customer service.
          </p>
          <p className="leading-relaxed">
            Please visit our{" "}
            <a href="/legal/dealer-application" className="text-primary hover:underline">
              Dealer Application
            </a>{" "}
            page to learn more about partnership opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
