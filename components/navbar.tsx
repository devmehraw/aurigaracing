"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, LogOut, Package, Heart, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { Badge } from "@/components/ui/badge"
import { CartSidebar } from "@/components/cart-sidebar"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchCounts(user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCounts(session.user.id)
      } else {
        setWishlistCount(0)
        setCartCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCounts = async (userId: string) => {
    const supabase = createClient()

    // Fetch wishlist count
    const { count: wishCount } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Fetch cart count
    const { count: cartCountData } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    setWishlistCount(wishCount || 0)
    setCartCount(cartCountData || 0)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <nav className="border-b bg-black text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/auriga-logo.png" alt="Auriga Racing" width={50} height={50} className="h-18 w-auto" />
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <SearchBar />
            </div>

            <div className="hidden lg:flex items-center gap-2 text-white">
              <Phone className="h-5 w-5 text-[#bd9131]" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Hotline</span>
                <a href="tel:+919911429393" className="text-sm font-semibold hover:text-[#bd9131] transition-colors">
                  +91 991 142 9393
                </a>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {user && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:text-[#bd9131] hover:bg-white/10"
                >
                  <Link href="/account/wishlist">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#bd9131]"
                      >
                        {wishlistCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-[#bd9131] hover:bg-white/10"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#bd9131]"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-[#bd9131] hover:bg-white/10">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/products" className="cursor-pointer">
                        <Package className="h-4 w-4 mr-2" />
                        Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-[#bd9131] hover:bg-[#a07d28] text-black font-semibold">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black text-white border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <SearchBar />
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#bd9131]" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Hotline</span>
                      <a href="tel:+919911429393" className="text-base font-semibold text-[#bd9131]">
                        +91 991 142 9393
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/products"
                    className="text-lg font-medium hover:text-[#bd9131]"
                    onClick={() => setIsOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/products/category/inline-speed-skating"
                    className="text-lg font-medium hover:text-[#bd9131]"
                    onClick={() => setIsOpen(false)}
                  >
                    Inline Speed Skating
                  </Link>
                  <Link
                    href="/products/category/ice-speed-skating"
                    className="text-lg font-medium hover:text-[#bd9131]"
                    onClick={() => setIsOpen(false)}
                  >
                    Ice Speed Skating
                  </Link>
                  <Link
                    href="/products/category/cycling-triathlon"
                    className="text-lg font-medium hover:text-[#bd9131]"
                    onClick={() => setIsOpen(false)}
                  >
                    Cycling & Triathlon
                  </Link>
                  <hr className="border-white/10" />
                  <Link
                    href="/cart"
                    className="text-lg font-medium hover:text-[#bd9131]"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className="text-lg font-medium hover:text-[#bd9131]"
                        onClick={() => setIsOpen(false)}
                      >
                        Account
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleSignOut()
                          setIsOpen(false)
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      onClick={() => setIsOpen(false)}
                      className="bg-[#bd9131] hover:bg-[#a07d28] text-black font-semibold"
                    >
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
