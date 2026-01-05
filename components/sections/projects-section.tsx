"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface Project {
  title: string
  description: string
  demoLink: string
  githubLink: string
}

const projects: Project[] = [
  {
    title: "TierrsBlanca",
    description: "E-commerce Platform",
    demoLink: "https://tierrablanca.ma",
    githubLink: "https://github.com/nordixdotma/tierrablanca",
  },
  {
    title: "Moon",
    description: "SaaS Dashboard",
    demoLink: "https://moon11.vercel.app/dashboard",
    githubLink: "https://github.com/nordixdotma/moon11",
  },
  {
    title: "Turath",
    description: "Moroccan Association",
    demoLink: "https://turath-app.vercel.app",
    githubLink: "https://github.com/nordixdotma/turath-app",
  },
  {
    title: "Aress",
    description: "Sales Platform",
    demoLink: "https://aress-ten.vercel.app",
    githubLink: "https://github.com/nordixdotma/aress",
  },
  {
    title: "NexusDweb",
    description: "Marketing Agency",
    demoLink: "https://nexusdweb.com",
    githubLink: "https://github.com/nordixdotma/nuxesdweb",
  },
  {
    title: "Plan Jardin Maroc",
    description: "Corporate Website",
    demoLink: "https://planjardinmaroc.vercel.app/",
    githubLink: "https://github.com/nordixdotma/planjardinmaroc",
  },
]

interface WorkSectionProps {
  isMobile: boolean
}

function WorkSectionComponent({ isMobile }: WorkSectionProps) {
  const { ref: workRef, inView: workInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      id="projects"
      ref={workRef}
      className={cn(
        "w-screen shrink-0 snap-start relative overflow-hidden flex items-center",
        isMobile ? "min-h-svh py-20" : "h-svh"
      )}
    >
      <div className="container px-6 md:px-12 mx-auto relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
          animate={workInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
          className={cn(
            "flex flex-col space-y-0 w-full mb-12 md:mb-16",
            isMobile ? "text-left" : "items-start text-left"
          )}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Projects
          </h2>
          <p className="font-mono text-xs text-foreground/60 md:text-sm">/ Things I&apos;ve Made</p>
        </motion.div>

        <motion.div
          className="grid gap-x-6 gap-y-6 grid-cols-2 lg:grid-cols-3 md:gap-x-12 md:gap-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={workInView ? "visible" : "hidden"}
        >
          {projects.map((project, i) => (
            <motion.div key={i} variants={itemVariants} className="group relative">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6 bg-foreground/30 transition-all duration-300 group-hover:w-10 group-hover:bg-foreground/50" />
                <span className="font-mono text-[10px] text-foreground/60">{`0${i + 1}`}</span>
              </div>
              <h3 className="mb-1 font-sans text-xl font-light text-foreground md:text-3xl transition-colors group-hover:text-foreground/80">
                {project.title}
              </h3>
              <p className="max-w-sm text-xs leading-relaxed text-foreground/70 md:text-base">
                {project.description}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-foreground/40">
                <a
                  href={project.demoLink}
                  target="_blank"
                  className="hover:text-foreground transition-colors py-1 flex items-center gap-1"
                >
                  Preview
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
                <a
                  href={project.githubLink}
                  target="_blank"
                  className="hover:text-foreground transition-colors py-1"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export const WorkSection = memo(WorkSectionComponent)
