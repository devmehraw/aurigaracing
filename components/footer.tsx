import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2 text-[#bd9131]">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6">Get the latest updates on new products and exclusive offers</p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/auriga-logo.png" alt="Auriga Racing" width={250} height={80} className="h-20 w-auto" />
            </div>
            <p className="text-sm text-gray-400">
              Your premier destination for high-performance speed skating, cycling, and sports equipment.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-[#bd9131] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#bd9131] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#bd9131] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#bd9131] transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#bd9131]">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/inline-speed-skating"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Inline Speed Skating
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/ice-speed-skating"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Ice Speed Skating
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/cycling-triathlon"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cycling & Triathlon
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#bd9131]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal/distributors" className="text-gray-400 hover:text-white transition-colors">
                  Distributors
                </Link>
              </li>
              <li>
                <Link href="/legal/dealer-application" className="text-gray-400 hover:text-white transition-colors">
                  Dealer Application
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#bd9131]">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/warranty-shipping" className="text-gray-400 hover:text-white transition-colors">
                  Warranty & Shipping
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/faqs" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Auriga Racing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
