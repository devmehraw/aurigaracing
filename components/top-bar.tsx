"use client"

import { useState } from "react"
import { Globe, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TopBar() {
  const [currency, setCurrency] = useState("USD")
  const [language, setLanguage] = useState("EN")

  return (
    <div className="bg-[#bd9131] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          {/* Tagline */}
          <div className="hidden md:block font-medium">
            🏆 Premium Speed Skating Equipment - Free Shipping on Orders Over $100
          </div>
          <div className="md:hidden font-medium text-xs">Free Shipping $100+</div>

          {/* Currency & Language Selectors */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-7 w-[80px] border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0 [&>svg]:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="EUR">EUR €</SelectItem>
                  <SelectItem value="GBP">GBP £</SelectItem>
                  <SelectItem value="CAD">CAD $</SelectItem>
                  <SelectItem value="AUD">AUD $</SelectItem>
                  <SelectItem value="JPY">JPY ¥</SelectItem>
                  <SelectItem value="CNY">CNY ¥</SelectItem>
                  <SelectItem value="INR">INR ₹</SelectItem>
                  <SelectItem value="KRW">KRW ₩</SelectItem>
                  <SelectItem value="CHF">CHF Fr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-white/30" />

            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-7 w-[70px] border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0 [&>svg]:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="ES">Español</SelectItem>
                  <SelectItem value="FR">Français</SelectItem>
                  <SelectItem value="DE">Deutsch</SelectItem>
                  <SelectItem value="IT">Italiano</SelectItem>
                  <SelectItem value="PT">Português</SelectItem>
                  <SelectItem value="NL">Nederlands</SelectItem>
                  <SelectItem value="RU">Русский</SelectItem>
                  <SelectItem value="JA">日本語</SelectItem>
                  <SelectItem value="KO">한국어</SelectItem>
                  <SelectItem value="ZH">中文</SelectItem>
                  <SelectItem value="AR">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
