interface Project {
  id: number
  title: string // New: for the project brand name
  description: string // New: for the old title text, now acting as description
  mainImage: string
  secondaryImage: string // Added secondary image
  tech: string[]
  demoLink: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "TierrsBlanca", // Project brand name
    description: "E-commerce Platform", // Old title, now description
    mainImage:
      "/p1.png",
    secondaryImage:
      "/p1-2.png",
    tech: ["Next.js", "Tailwind CSS", "Stripe"],
    demoLink: "https://tierrablanca.ma", // Updated demo link
  },
  {
    id: 2,
    title: "Moon", // Project brand name
    description: "SaaS Dashboard", // Old title, now description
    mainImage:
      "/p2.png",
    secondaryImage:
      "/p2-2.png",
      tech: ["Next.js", "Tailwind CSS"],
      demoLink: "https://moon11.vercel.app/dashboard",
    },
    {
      id: 5,
      title: "NexusDweb", // Project brand name
      description: "Marketing Agency", // Old title, now description
      mainImage:
        "/p5.png",
      secondaryImage:
        "/p5-2.png",
      tech: ["Next.js", "Tailwind CSS"],
      demoLink: "https://nexusdweb.com",
    },
  {
    id: 3,
    title: "Turath", // Project brand name
    description: "Moroccan Association", // Old title, now description
    mainImage:
      "/p3.png",
    secondaryImage:
      "/p3-2.png",
    tech: ["Next.js", "Tailwind CSS"],
    demoLink: "https://turath-app.vercel.app",
  },
  {
    id: 4,
    title: "Aress", // Project brand name
    description: "Sales platform", // Old title, now description
    mainImage:
      "/p4.png",
    secondaryImage:
      "/p4-2.png",
    tech: ["Next.js", "Tailwind CSS"],
    demoLink: "https://aress-ten.vercel.app",
  },
  {
    id: 7,
    title: "Plan Jardin Maroc", // Project brand name
    description: "Corporate Website", // Old title, now description
    mainImage:
      "/p7.png",
    secondaryImage:
      "/p7-2.png",
    tech: ["Next.js", "Tailwind CSS"],
    demoLink: "https://planjardinmaroc.vercel.app/",
  },
]
