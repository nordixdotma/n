"use client"

import { WorkSection } from "@/components/sections/projects-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { SoundToggle } from "@/components/sound-toggle"
import Header from "@/components/header"
import { AiAssistantButton } from "@/components/ai-assistant-button"
import { useRef, useEffect, useState } from "react"
import { HoverLinkPreview } from "@/components/ui/hover-link-preview"
import { Download, Github } from "lucide-react"
import Loader from "@/components/loader"

const sectionIds = ["home", "projects", "about", "contact"]

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [isMobile, setIsMobile] = useState(false)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const vimeoPlayerRef = useRef<any>(null)
  const scrollThrottleRef = useRef<number | undefined>(undefined)
  const lastSection = useRef(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Load Vimeo Player API
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const iframe = document.querySelector('#vimeo-background') as HTMLIFrameElement
      if (iframe && (window as any).Vimeo) {
        vimeoPlayerRef.current = new (window as any).Vimeo.Player(iframe)
        vimeoPlayerRef.current.ready().then(() => {
          setIsLoaded(true)
        })
      }
    }

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 2000)

    return () => {
      clearTimeout(fallbackTimer)
      document.body.removeChild(script)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setScrollDirection(index > lastSection.current ? "down" : "up")
      lastSection.current = index
      setCurrentSection(index)
    }
  }

  const handleSectionClick = (sectionId: string) => {
    const index = sectionIds.indexOf(sectionId)
    if (index !== -1) {
      scrollToSection(index)
    }
  }

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < sectionIds.length - 1) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.max(0, Math.min(sectionIds.length - 1, Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)))
        if (newSection !== currentSection) {
          setScrollDirection(newSection > currentSection ? "down" : "up")
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection < sectionIds.length) {
          setScrollDirection(newSection > currentSection ? "down" : "up")
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-svh w-full overflow-hidden bg-background">
      <div
        className={`fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <iframe
          id="vimeo-background"
          src="https://player.vimeo.com/video/1140933123?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1&amp;loop=1&amp;background=1&amp;controls=0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "56.25vw",
            minHeight: "100svh",
            minWidth: "177.78vh",
            transform: "translate(-50%, -50%)"
          }}
          title="background"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-black/50" />

      <SoundToggle vimeoPlayerRef={vimeoPlayerRef} />

      {/* Header Component */}
      <div className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Header
          currentSection={sectionIds[currentSection]}
          onSectionClick={handleSectionClick}
          scrollDirection={scrollDirection}
          isMobile={isMobile}
          onAiModalOpenChange={setIsAiModalOpen}
        />
      </div>


      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`no-scrollbar relative z-10 flex h-svh overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <section className="flex min-h-svh w-screen shrink-0 flex-col justify-center px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-3 py-1 md:px-4 md:py-1.5 duration-700">
              <p className="font-mono text-[10px] md:text-xs text-foreground/90">SOFTWARE DEVELOPER</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-6xl lg:text-7xl">
              <span className="text-balance">
                Noureddine
                <br />
                <span className="font-semibold">ELMHASSANI</span>
              </span>
            </h1>
            <div className="flex animate-in fade-in slide-in-from-top-4 gap-4 duration-1000 delay-300 flex-row sm:items-center">
              <HoverLinkPreview
                href="/ELMHASSANI RESUME.pdf"
                previewImage="/resumeimage.png"
                download
                position="top"
                isMobile={isMobile}
              >
                <MagneticButton
                  size={isMobile ? "default" : "lg"}
                  variant="primary"
                  as="span"
                >
                  <span className="flex items-center gap-2">
                    Resume
                    <Download className="h-4 w-4" />
                  </span>
                </MagneticButton>
              </HoverLinkPreview>
              <MagneticButton 
                size={isMobile ? "default" : "lg"} 
                variant="secondary" 
                as="span"
                onClick={() => window.open("https://github.com/nordixdotma", "_blank")}
              >
                <span className="flex items-center gap-2">
                  GitHub
                  <Github className="h-4 w-4" />
                </span>
              </MagneticButton>
            </div>
          </div>
        </section>

        <WorkSection isMobile={isMobile} />
        <AboutSection scrollToSection={scrollToSection} isMobile={isMobile} />
        <ContactSection isMobile={isMobile} />
      </div>

      {isLoading && <Loader onComplete={handleLoaderComplete} />}

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}