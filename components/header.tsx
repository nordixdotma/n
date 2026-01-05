"use client"

import { useState } from "react"
import { ProfileModal } from "@/components/ui/profile-modal"
import { AiAssistantButton } from "@/components/ai-assistant-button"
import { HoverLinkPreview } from "@/components/ui/hover-link-preview"

interface HeaderProps {
  currentSection: string
  onSectionClick: (sectionId: string) => void
  scrollDirection: "up" | "down"
  isMobile: boolean
  onAiModalOpenChange: (open: boolean) => void
}

const sectionTitles = {
  home: "HERE",
  about: "A DEVELOPER",
  projects: "A CREATOR",
  contact: "AVAILABLE",
}

const sectionLinks = [
  { id: "home", label: "HOME" },
  { id: "projects", label: "PROJECTS" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
]

export default function Header({ currentSection, onSectionClick, scrollDirection, isMobile, onAiModalOpenChange }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <header className="header">
        {/* Left - Dynamic Title */}
        <div className="header-left">
          <span>I'M&nbsp;</span>
          <span key={currentSection} className={`dynamic-title-part slide-in-${scrollDirection}`}>
            {sectionTitles[currentSection as keyof typeof sectionTitles]}
          </span>
        </div>

        {/* Right - Mobile: Profile Image, Desktop: Navigation */}
        {isMobile ? (
          <div className="header-right">
            <button onClick={() => setIsProfileOpen(true)} className="home-image-link">
              <img
                src="/g.jpg"
                alt="Home"
                style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
              />
            </button>
            <ProfileModal isOpen={isProfileOpen} onClose={setIsProfileOpen} />
          </div>
        ) : (
          <nav className="header-right">
            {sectionLinks.map((link) => (
              <HoverLinkPreview
                key={link.id}
                href={`/#${link.id}`}
                previewImage={`/${link.id}-preview.png`}
                imageAlt={`${link.label} section preview`}
                className="nav-link cursor-pointer group"
                isMobile={isMobile}
                position="bottom"
                newTab={false}
                onClick={() => onSectionClick(link.id)}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                    currentSection === link.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </HoverLinkPreview>
            ))}
          </nav>
        )}
      </header>

      {!isMobile && <AiAssistantButton onOpenChange={onAiModalOpenChange} />}

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${isMobile ? '60px' : '80px'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 ${isMobile ? '20px' : '40px'};
          z-index: 1000;
          font-family: var(--font-inter), 'Inter', system-ui, sans-serif;
          color: #ffffff;
        }

        .header-left {
          flex: 1;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          overflow: hidden;
          height: ${isMobile ? '1em' : '1.2em'};
        }

        .dynamic-title-part {
          display: inline-block;
          white-space: nowrap;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }

        .slide-in-down {
          animation-name: slideInFromBottom;
        }

        .slide-in-up {
          animation-name: slideInFromTop;
        }

        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          gap: ${isMobile ? '0' : '20px'};
          font-size: ${isMobile ? 'inherit' : '0.8rem'};
          font-weight: 500;
        }

        .home-image-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-image-link img {
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 69, 0, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(255, 69, 0, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 69, 0, 0);
          }
        }

        .nav-link {
          background: none;
          border: none;
          color: inherit;
          font-family: var(--font-inter), 'Inter', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 400;
          cursor: pointer;
          padding: 0;
          outline: none;
          transition: opacity 0.3s ease;
          text-decoration: none;
        }

        .nav-link:hover {
          opacity: 0.7;
        }
      `}</style>
    </>
  )
}
