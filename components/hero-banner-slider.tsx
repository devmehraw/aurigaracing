"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Auriga Racing Pro Inline Skate Boots",
    subtitle: "Handcrafted Excellence",
    description: "Designed in India with Japanese Carbon Fiber and premium microfiber leather by the finest craftsmen",
    image: "https://aurigaracing.com/wp-content/uploads/revslider/slider-1/1.png",
    link: "/products",
    buttonText: "Shop Boots",
  },
  {
    id: 2,
    title: "Aero Helmets - Pure Speed",
    subtitle: "Wind Tunnel Tested",
    description: "Delivering aerodynamics, pure speed, and unmatched performance for competitive racing",
    image: "https://aurigaracing.com/wp-content/uploads/revslider/slider-1/2.png",
    link: "/products",
    buttonText: "Explore Helmets",
  },
  {
    id: 3,
    title: "High-Performance Racing Wheels",
    subtitle: "Engineered for Champions",
    description: "Speed, grip, and durability in every roll - Hydrogen Pro & MPC Storm Surge technology",
    image: "https://aurigaracing.com/wp-content/uploads/revslider/slider-1/3.png",
    link: "/products",
    buttonText: "View Wheels",
  },
]

export function HeroBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={banner.image || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-contain"
            priority={index === 0}
          />

        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-[#bd9131] w-8" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
