import type React from "react"
import "./globals.css"
import { Geist, Geist_Mono, Rajdhani } from "next/font/google"
import { ClientLayout } from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-sporty-display" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${_geist.variable} ${_rajdhani.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
