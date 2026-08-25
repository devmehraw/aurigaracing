"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SkateWheelMark } from "@/components/decor/skate-wheel-mark"

const slides = [
  {
    image: "/home/hero-skater.png",
    alt: "Professional speed skater racing on a track",
    eyebrow: "Auriga Racing — 2025 Collection",
    title: "Precision Engineered. Race Proven.",
    description: "Dominate the track. Explore our elite skating tech.",
    cta: "Shop New Collection",
    href: "/products",
    position: "object-center",
  },
  {
    image: "/home/precision-boot.png",
    alt: "Auriga Racing carbon fiber racing boot",
    eyebrow: "Signature Carbon Series",
    title: "Built For The Breakaway.",
    description: "Heat-moldable carbon. Locked-in support. Zero compromise.",
    cta: "Shop Race Boots",
    href: "/products/category/boots",
    position: "object-center",
  },
  {
    image: "/home/performance-frame.png",
    alt: "Auriga Racing performance frame with inline wheels",
    eyebrow: "Race Hardware / OCCULT",
    title: "Find Your Fastest Line.",
    description: "Precision-machined frames engineered to turn speed into control.",
    cta: "Shop Frames",
    href: "/products/category/frames",
    position: "object-center",
  },
]

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches)
    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)
    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    if (isPaused || isReducedMotion) return
    const interval = window.setInterval(() => goTo(activeIndex + 1), 6500)
    return () => window.clearInterval(interval)
  }, [activeIndex, goTo, isPaused, isReducedMotion])

  return (
    <section
      className="relative h-[440px] w-full overflow-hidden bg-black md:h-[500px]"
      aria-roledescription="carousel"
      aria-label="Auriga Racing featured banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsPaused(false)
      }}
    >
      <div className="absolute inset-0" aria-live="polite">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className={`object-cover ${slide.position}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-full overflow-hidden" aria-hidden="true">
        <span className="absolute top-[28%] h-[2px] w-24 bg-gradient-to-r from-transparent via-[#e0b64f] to-transparent animate-speed-streak" />
        <span className="absolute top-[52%] h-[2px] w-32 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-speed-streak [animation-delay:0.8s]" />
        <span className="absolute top-[74%] h-[2px] w-20 bg-gradient-to-r from-transparent via-[#e0b64f] to-transparent animate-speed-streak [animation-delay:1.6s]" />
      </div>

      <SkateWheelMark className="pointer-events-none absolute -bottom-16 -left-16 z-20 h-56 w-56 text-white/10 animate-spin-slow" />

      <div className="container relative z-30 mx-auto flex h-full items-center px-4">
        <div className="max-w-sm rounded-xl bg-background/95 p-6 shadow-2xl backdrop-blur-sm md:p-7">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#bd9131] animate-hud-pulse" />
            {slides[activeIndex].eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold uppercase leading-[1.08] tracking-tight text-foreground md:text-4xl text-balance">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground leading-relaxed">
            {slides[activeIndex].description}
          </p>
          <Button asChild size="sm" className="mt-5 rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]">
            <Link href={slides[activeIndex].href}>{slides[activeIndex].cta}</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-white hover:bg-white/15 hover:text-white"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Select banner">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show banner ${index + 1}: ${slide.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-[#e0b64f]" : "w-1.5 bg-white/60 hover:bg-white"
              }`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-white hover:bg-white/15 hover:text-white"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next banner"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-white hover:bg-white/15 hover:text-white"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? "Play banner rotation" : "Pause banner rotation"}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-40 hidden items-center gap-2 rounded-lg bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm sm:flex">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#bd9131]">New</p>
          <p className="text-xs font-bold uppercase tracking-wide text-foreground">Collection</p>
        </div>
        <div
          className="h-6 w-6 rounded"
          style={{
            backgroundImage: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)",
            backgroundSize: "6px 6px",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
