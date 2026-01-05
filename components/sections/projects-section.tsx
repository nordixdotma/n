"use client"

import { useReveal } from "@/hooks/use-reveal"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  const projects = [
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

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start items-center px-6 pt-10 md:px-12 md:pt-0 "
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
            Projects
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Things I've Made</p>
        </div>

        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 md:gap-x-12 md:gap-y-12">
          {projects.map((project, i) => (
            <WorkCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkCard({
  project,
  index,
  isVisible,
}: {
  project: { title: string; description: string; demoLink: string; githubLink: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () =>
    isVisible ? "translate-x-0 translate-y-0 opacity-100" : "-translate-y-16 opacity-0"

  return (
    <div
      className={`group transition-all duration-700 ${getRevealClass()}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
        <span className="font-mono text-xs text-foreground/60">{`0${index + 1}`}</span>
      </div>
      <h3 className="mb-2 font-sans text-2xl font-light text-foreground md:text-3xl">
        {project.title}
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">
        {project.description}
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs font-mono text-foreground/60">
        <a href={project.demoLink} target="_blank" className="hover:text-foreground transition">
          Preview
        </a>
        <a href={project.githubLink} target="_blank" className="hover:text-foreground transition">
          GitHub
        </a>
      </div>
    </div>
  )
}
