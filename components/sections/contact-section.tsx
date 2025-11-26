"use client"

import { Mail, Phone, Github, Twitter, Instagram, Linkedin } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)

  const contacts = [
    {
      label: "Phone & WhatsApp",
      value: "(+212) 704 749 027",
      href: "tel:+212704749027",
      icon: Phone,
      direction: "top",
    },
    {
      label: "Email",
      value: "noureddineelmhassani@email.com",
      href: "mailto:noureddineelmhassani@email.com",
      icon: Mail,
      direction: "right",
    },
    {
      label: "GitHub",
      value: "nordixdotma",
      href: "https://github.com/nordixdotma",
      icon: Github,
      direction: "left",
    },
    {
      label: "X / Twitter",
      value: "nordixdotma",
      href: "https://x.com/nordixdotma",
      icon: Twitter,
      direction: "bottom",
    },
    {
      label: "Instagram",
      value: "nordix.ma",
      href: "https://instagram.com/nordix.ma",
      icon: Instagram,
      direction: "left",
    },
    {
      label: "LinkedIn",
      value: "nordixdotma",
      href: "https://www.linkedin.com/in/nordixdotma",
      icon: Linkedin,
      direction: "right",
    },
  ]

  const getRevealClass = (direction: string) => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "-translate-x-12 opacity-0"
        case "right":
          return "translate-x-12 opacity-0"
        case "top":
          return "-translate-y-12 opacity-0"
        case "bottom":
          return "translate-y-12 opacity-0"
        default:
          return "translate-y-8 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-screen shrink-0 snap-start items-center px-4 pt-10 md:px-12 md:pt-0"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Title */}
        <div
          className={`mb-10 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Contact
          </h2>
          <p className="font-mono text-xs text-foreground/60 md:text-sm">/ Let’s Talk</p>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
          {contacts.map((c, i) => {
            const Icon = c.icon
            return (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-md p-3 sm:p-4 transition-all duration-700 ${
                  getRevealClass(c.direction)
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >

                {/* Icon + Label */}
                <div className="flex items-center gap-2 sm:gap-3">
                  
                  <span className="font-mono text-xs text-foreground/60">{c.label}</span>
                </div>

                {/* Value (phone, email, username...) */}
                <p className="mt-1 text-white text-sm md:text-xl">{c.value}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
