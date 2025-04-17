import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import { ClientAuthProvider } from "../components/client-auth-provider"
import { Inter, Nunito, Roboto } from "next/font/google"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Load fonts using Next.js font optimization
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Dental Clinic",
  description: "Professional dental services for all your needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${roboto.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body>
        <ClientAuthProvider>{children}</ClientAuthProvider>
        <Script src="https://code.jquery.com/jquery-3.6.0.min.js" />
      </body>
    </html>
  )
}



import './globals.css'