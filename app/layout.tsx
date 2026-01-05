import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nordix.ma"),
  title: {
    default: "Noureddine El Mhassani | Full Stack Developer & Software Engineer",
    template: "%s | Noureddine El Mhassani",
  },
  description:
    "Experienced Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and modern web technologies. Building innovative digital solutions and crafting exceptional user experiences.",
  keywords: [
    "Noureddine El Mhassani",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Morocco Developer",
    "Freelance Developer",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Noureddine El Mhassani" }],
  creator: "Noureddine El Mhassani",
  publisher: "Noureddine El Mhassani",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nordix.ma",
    siteName: "Noureddine El Mhassani Portfolio",
    title: "Noureddine El Mhassani | Full Stack Developer & Software Engineer",
    description:
      "Experienced Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and modern web technologies.",
    images: [
      {
        url: "/home-preview.png",
        width: 1200,
        height: 630,
        alt: "Noureddine El Mhassani - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noureddine El Mhassani | Full Stack Developer",
    description:
      "Experienced Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and modern web technologies.",
    images: ["/home-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
