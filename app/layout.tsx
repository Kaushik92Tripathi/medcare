import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { montserrat } from './fonts';

export const metadata: Metadata = {
  title: "MedCare - Book Your Doctor Appointment",
  description: "Book your next doctor visit in seconds with MedCare",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}


