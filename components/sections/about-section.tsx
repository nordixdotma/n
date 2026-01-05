"use client"

import { useReveal } from "@/hooks/use-reveal"

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

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)
  const categories = [
    { label: "Frontend", skills: frontendSkills },
    { label: "Backend", skills: backendSkills },
    { label: "Tools & Databases", skills: toolsSkills },
  ]

  return (
    <section
      ref={ref}
      className="flex h-svh w-screen shrink-0 snap-start items-center px-4 pt-10 md:px-12 md:pt-0"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-4 md:grid-cols-2 md:gap-12">
          {/* Left side - Story */}
          <div>
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"}`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                About
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-sm">/ Who I Am</p>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 md:space-y-4 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                I'm a software engineer who loves solving real-world problems with code that works. I build fast, reliable, and useful web apps.
              </p>
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                I've worked with React, C, and more, delivering projects like e-commerce platforms and sustainable product showcases. Clean solutions, no fluff.
              </p>
            </div>
          </div>

          {/* Right side - Categories */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12">
            {categories.map((category, i) => {
              const revealClass = isVisible
                ? "translate-x-0 opacity-100"
                : i % 2 === 0
                  ? "-translate-x-8 opacity-0" // slightly left for even items
                  : "translate-x-16 opacity-0"

              // Move only the Backend card slightly to the left (not all the way)
              const isBackend = i === 1
              const marginLeft = isBackend ? "18%" : i % 2 === 0 ? "0" : "auto"
              const maxWidth = isBackend ? "82%" : i % 2 === 0 ? "100%" : "85%"

              return (
                <div
                  key={i}
                  className={`flex flex-col gap-2 border-l border-foreground/30 pl-4 transition-all duration-700 md:pl-8 ${revealClass}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                    marginLeft,
                    maxWidth,
                  }}
                >
                  <span className="font-mono text-xs text-foreground/60">{category.label}</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {category.skills.map((skill, j) => (
                      <div
                        key={j}
                        className="h-6 w-6 sm:h-8 sm:w-8 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill}/${skill}-original.svg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
