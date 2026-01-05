"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

const frontendSkills = [
  "react",
  "nextjs",
  "angular",
  "javascript",
  "tailwindcss",
  "vuejs",
]

const backendSkills = [
  "nodejs",
  "c",
  "csharp",
  "java",
  "python",
  "php",
  "laravel",
]

const toolsSkills = [
  "git",
  "docker",
  "postgresql",
  "vscode",
  "mysql",
]

interface AboutSectionProps {
  scrollToSection?: (index: number) => void
  isMobile: boolean
}

function AboutSectionComponent({ isMobile }: AboutSectionProps) {
  const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  const categories = [
    { label: "Frontend", skills: frontendSkills },
    { label: "Backend", skills: backendSkills },
    { label: "Tools & Databases", skills: toolsSkills },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const

  return (
    <section
      id="about"
      ref={aboutRef}
      className={cn(
        "w-screen shrink-0 snap-start relative overflow-hidden flex items-center",
        isMobile ? "min-h-svh py-20" : "h-svh"
      )}
    >
      <div className="container px-6 md:px-12 mx-auto relative z-10 w-full max-w-7xl">
        <div className="grid gap-6 md:gap-8 lg:gap-12 md:grid-cols-2">
          {/* Left side - Story */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
            animate={aboutInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
            className={cn(
              "flex flex-col space-y-0 w-full",
              isMobile ? "text-left mb-0" : "items-start text-left"
            )}
          >
            <div className="mb-6 md:mb-12">
              <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                About
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-sm">/ Who I Am</p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                I'm a software engineer who loves solving real-world problems with code that works. I build fast, reliable, and useful web apps.
              </p>
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                I've worked with React, C, and more, delivering projects like e-commerce platforms and sustainable product showcases. Clean solutions, no fluff.
              </p>
            </div>
          </motion.div>

          {/* Right side - Categories */}
          <motion.div 
            className="flex flex-col justify-center space-y-6 md:space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
          >
            {categories.map((category, i) => {
              const isBackend = i === 1
              const marginLeft = isBackend ? "18%" : i % 2 === 0 ? "0" : "auto"
              const maxWidth = isBackend ? "82%" : i % 2 === 0 ? "100%" : "85%"

              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col gap-2 border-l border-foreground/30 pl-4 md:pl-8"
                  style={{
                    marginLeft,
                    maxWidth,
                  }}
                >
                  <span className="font-mono text-xs text-foreground/60">{category.label}</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {category.skills.map((skill, j) => (
                      <div
                        key={j}
                        role="img"
                        aria-label={skill}
                        title={skill}
                        className="h-6 w-6 sm:h-8 sm:w-8 bg-contain bg-center bg-no-repeat transition-transform hover:scale-110"
                        style={{
                          backgroundImage: `url(https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill}/${skill}-original.svg)`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export const AboutSection = memo(AboutSectionComponent)
