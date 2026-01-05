import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

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
  authors: [{ name: "Noureddine El Mhassani", url: "https://nordix.ma" }],
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
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Noureddine El Mhassani Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noureddine El Mhassani | Full Stack Developer",
    description:
      "Experienced Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and modern web technologies.",
    images: ["/home-preview.png"],
    creator: "@nordixdotma",
  },
  category: "technology",
  classification: "Portfolio",
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
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Noureddine Portfolio",
  },
  applicationName: "Noureddine El Mhassani Portfolio",
  referrer: "origin-when-cross-origin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Noureddine El Mhassani",
    url: "https://nordix.ma",
    jobTitle: "Full Stack Developer",
    description: "Experienced Full Stack Developer specializing in React, Next.js, Node.js, TypeScript and modern web technologies.",
    sameAs: [
      "https://github.com/nordixdotma",
      "https://linkedin.com/in/nordixdotma",
      "https://x.com/nordixdotma",
      "https://instagram.com/nordix.ma"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Noureddine El Mhassani Portfolio",
    url: "https://nordix.ma",
    description: "Portfolio of Noureddine El Mhassani, a Full Stack Developer & Software Engineer.",
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
