import type React from "react"
import "./globals.css"
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google"
import { ClientLayout } from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _bodoniModa = Bodoni_Moda({ subsets: ["latin"], variable: "--font-serif-display" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${_geist.variable} ${_bodoniModa.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
