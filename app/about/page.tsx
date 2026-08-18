import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Target, TrendingUp } from "lucide-react"

export const metadata = {
  title: "About Us | Auriga Racing - Premium Speed Skating & Cycling Equipment",
  description:
    "Learn about Auriga Racing's mission to provide world-class speed skating and cycling equipment to athletes worldwide",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/demo/img/image10.jpeg?tr=w-1920,h-600,c-at_max,q-85')] opacity-30 bg-cover bg-center" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Empowering Athletes Since Day One</h1>
            <p className="text-lg md:text-xl text-gray-300 text-balance leading-relaxed">
              Auriga Racing is your premier destination for high-performance speed skating, cycling, and sports
              equipment trusted by champions worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              At Auriga Racing, we believe that every athlete deserves access to professional-grade equipment that can
              help them perform at their best. Our mission is to empower athletes with cutting-edge gear and
              unparalleled service.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We work closely with manufacturers and athletes to source the highest quality products and provide expert
              guidance to help you make informed decisions about your equipment.
            </p>
          </div>
          <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
            <img
              src="https://ik.imagekit.io/demo/img/image5.jpeg?tr=w-800,h-600,c-at_max,q-85"
              alt="Speed skating athlete in action"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Auriga Racing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We stock only the best brands and highest quality equipment for serious athletes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We support athletes at all levels and foster a passionate sports community
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expertise</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our team has years of competitive experience and technical knowledge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We stay ahead of the curve with the latest technology and equipment advances
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Founded by passionate speed skating and cycling enthusiasts, Auriga Racing began with a simple vision: to
              make professional-grade sporting equipment accessible to athletes at every level. What started as a small
              operation has grown into a trusted name in the speed sports community.
            </p>

            <p className="leading-relaxed">
              Our founders recognized a gap in the market - athletes needed more than just equipment; they needed
              expertise, guidance, and a partner who understood the technical demands of their sport. This insight
              became the foundation of our business philosophy.
            </p>

            <p className="leading-relaxed">
              Today, we work with elite manufacturers from around the world to bring you the finest speed skating and
              cycling equipment available. Our team includes former competitive athletes and technical specialists who
              bring real-world experience to every customer interaction.
            </p>

            <p className="leading-relaxed">
              Whether you're training for the Olympics or just starting your speed sports journey, Auriga Racing is
              committed to supporting your goals with premium equipment, expert advice, and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive equipment solutions for speed sports athletes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Inline Speed Skating</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Competition boots and frames</li>
                  <li>• Premium wheels and bearings</li>
                  <li>• Complete skate packages</li>
                  <li>• Safety equipment and accessories</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Ice Speed Skating</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Professional ice boots</li>
                  <li>• Competition blades</li>
                  <li>• Advanced clap skate systems</li>
                  <li>• Sharpening and maintenance tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Cycling & Triathlon</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High-performance cycling gear</li>
                  <li>• Triathlon equipment</li>
                  <li>• Training accessories</li>
                  <li>• Performance apparel</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Gear Up?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our premium selection of speed skating and cycling equipment and take your performance to the next
            level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
