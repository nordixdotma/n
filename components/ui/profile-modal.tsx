"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  Calendar,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Share,
  Bookmark,
  Pin,
  Bot,
  Instagram,
  Monitor
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="Verified account">
      <g>
        <path
          fill="#1d9bf0"
          d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681.132-.637.075-1.299-.164-1.903.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
        />
        <path fill="#fff" d="M9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246-5.683 6.206z" />
      </g>
    </svg>
  )
}

function GrokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M2.205 7.423L11.745 21h4.241L6.446 7.423H2.205zm4.237 7.541L2.2 21h4.243l2.12-3.017-2.121-3.019zm9.353-8.939L11.553 12l2.121 3.018 6.363-9.057h-4.242z" />
    </svg>
  )
}

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = ["Home", "Projects", "About", "Contact", "AI Chat"]

  return (
    <div className="mt-2 border-b border-neutral-800 sticky top-[53px] bg-black/95 backdrop-blur-sm z-10">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative flex-1 whitespace-nowrap px-3 py-3 text-[13px] font-medium transition-colors hover:bg-neutral-800/50 min-w-fit ${
              activeTab === tab ? "font-bold text-white" : "text-neutral-500"
            }`}
          >
            <span className="relative inline-block">
              {tab}
              {activeTab === tab && <span className="absolute -bottom-3 left-0 right-0 h-1 rounded-full bg-[#1d9bf0]" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

/* Post Content Component */
function PostContent({ 
  videoUrl, 
  text, 
  stats 
}: { 
  videoUrl: string, 
  text: React.ReactNode, 
  stats: { replies: string, reposts: string, likes: string, views: string } 
}) {
  return (
    <article className="border-b border-neutral-800 px-4 py-3 hover:bg-neutral-900/50 transition-colors cursor-pointer">
      <div className="mb-1 flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
        <Pin className="h-3 w-3" />
        <span>Pinned</span>
      </div>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/image.jpg" className="object-cover" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-[14px] text-white">nordix</span>
            <VerifiedBadge className="h-4 w-4" />
            <span className="text-neutral-500 text-[14px]">@nordixdotma</span>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-full p-1.5 hover:bg-neutral-800 hover:text-[#1d9bf0] transition-colors">
                <GrokIcon className="h-3.5 w-3.5 text-neutral-500" />
              </button>
              <button className="rounded-full p-1.5 hover:bg-neutral-800 hover:text-[#1d9bf0] transition-colors">
                <MoreHorizontal className="h-3.5 w-3.5 text-neutral-500" />
              </button>
            </div>
          </div>
          
          <div className="mt-0.5 text-[14px] text-white">
            {text}
          </div>

          {/* Embedded Video Card */}
          <div className="mt-2 overflow-hidden rounded-xl border border-neutral-800 hover:bg-neutral-900/40 transition-colors bg-black aspect-video relative">
             <iframe 
                width="100%" 
                height="100%" 
                src={videoUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
          </div>

          {/* Post Actions */}
          <div className="mt-2 flex justify-between text-neutral-500 max-w-[400px]">
            <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors">
              <div className="rounded-full p-1.5 group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-[12px]">{stats.replies}</span>
            </button>
            <button className="group flex items-center gap-1.5 hover:text-green-500 transition-colors">
              <div className="rounded-full p-1.5 group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="h-4 w-4" />
              </div>
              <span className="text-[12px]">{stats.reposts}</span>
            </button>
            <button className="group flex items-center gap-1.5 hover:text-pink-600 transition-colors">
              <div className="rounded-full p-1.5 group-hover:bg-pink-600/10 transition-colors">
                <Heart className="h-4 w-4" />
              </div>
              <span className="text-[12px]">{stats.likes}</span>
            </button>
            <button className="group flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors">
              <div className="rounded-full p-1.5 group-hover:bg-[#1d9bf0]/10 transition-colors">
                <BarChart2 className="h-4 w-4" />
              </div>
              <span className="text-[12px]">{stats.views}</span>
            </button>
            <div className="flex items-center gap-0.5">
              <button className="group rounded-full p-1.5 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="group rounded-full p-1.5 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("Home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset warning when changing tabs
  useEffect(() => {
    setShowMobileWarning(false)
  }, [activeTab])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setIsScrolled(scrollTop > 50)
  }

  // Define content for each tab - using famous CS-related YouTube videos
  const tabContent = {
    Home: {
      video: "https://www.youtube.com/embed/nKIu9yen5nc", // "What is Code?" - The Art of Code
      text: (
        <>
          <p>Welcome to my digital space! 🌐</p>
          <p className="mt-1">Explore my projects, learn about my journey, and let's get in touch.</p>
        </>
      ),
      stats: { replies: "25", reposts: "10", likes: "512", views: "2.3K" }
    },
    Projects: {
      video: "https://www.youtube.com/embed/Tn6-PIqc4UM", // Fireship - "React in 100 Seconds"
      text: (
        <>
          <p>Check out my latest detailed project breakdown! 🚀</p>
          <p className="mt-1">I built a full-stack application using Next.js 15, TailwindCSS, and AI integration.</p>
        </>
      ),
      stats: { replies: "14", reposts: "5", likes: "128", views: "1.2K" }
    },
    About: {
      video: "https://www.youtube.com/embed/8jLOx1hD3_o", // CS50 - "Introduction to Computer Science"
      text: (
        <>
          <p>A little bit about my journey as a developer. 👨‍💻</p>
          <p className="mt-1">From first entering the world of code to building complex systems.</p>
        </>
      ),
      stats: { replies: "8", reposts: "2", likes: "85", views: "940" }
    },
    Contact: {
      video: "https://www.youtube.com/embed/ZXsQAXx_ao0", // Lex Fridman - "Elon Musk on AI"
      text: (
        <>
          <p>Let's connect and build something amazing together! 🤝</p>
          <p className="mt-1">Available for freelance and collaboration.</p>
        </>
      ),
      stats: { replies: "22", reposts: "12", likes: "340", views: "5.1K" }
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 overflow-y-auto overflow-x-hidden max-h-[70vh] w-[95vw] sm:w-[85vw] md:w-[70vw] lg:w-[50vw] max-w-2xl gap-0 border border-neutral-800 bg-black text-white rounded-sm shadow-2xl"
        onScroll={handleScroll}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Profile Details</DialogTitle>
        <div className="w-full pb-4 md:pb-0 relative min-h-[400px] overflow-x-hidden">
          {/* Sticky Header - Transparent initially, Black on scroll */}
          <div 
            className={`sticky top-0 z-20 flex items-center gap-3 px-3 py-1.5 transition-colors duration-200 border-b ${
              isScrolled ? "bg-black/90 backdrop-blur-md border-neutral-800" : "bg-transparent border-transparent"
            }`}
          >
            <button 
              className={`rounded-full p-1.5 transition-colors ${isScrolled ? "bg-transparent hover:bg-neutral-800" : "bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"}`} 
              onClick={() => onClose(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className={`flex flex-col transition-opacity duration-200 ${isScrolled ? "opacity-100" : "opacity-0 invisible"}`}>
              <span className="flex items-center gap-1 text-base font-bold leading-tight">
                nordix
                <VerifiedBadge className="h-3.5 w-3.5" />
              </span>
              <span className="text-[11px] text-muted-foreground">5 posts</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button className={`rounded-full p-1.5 ${isScrolled ? "hover:bg-neutral-800" : "bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"}`}>
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="absolute top-0 left-0 right-0 h-[140px] w-full z-0">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop" alt="Banner" className="h-full w-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          </div>

          {/* Spacer for banner content/flow */}
          <div className="h-[100px] relative z-0 pointer-events-none"></div>

          {/* Profile Info */}
          <div className="px-3 relative z-10">
            <div className="relative flex justify-between">
              <Avatar className="-mt-[35px] h-[70px] w-[70px] border-[3px] border-black sm:-mt-[45px] sm:h-[90px] sm:w-[90px]">
                <AvatarImage src="/image.jpg" className="object-cover" />
                <AvatarFallback className="text-lg sm:text-2xl bg-neutral-900 border-neutral-800">N</AvatarFallback>
              </Avatar>
              <div className="mt-1.5 flex items-center gap-2">
                <button className="rounded-full border border-neutral-700 p-1.5 hover:bg-neutral-800 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                </button>
                <Button variant="outline" className="h-7 rounded-full border-neutral-700 font-bold bg-transparent text-[11px] hover:bg-neutral-800 hover:text-white px-3">
                  Edit profile
                </Button>
              </div>
            </div>

            <div className="mt-1">
              <h1 className="flex items-center gap-1 text-base font-bold">
                nordix
                <VerifiedBadge className="h-3.5 w-3.5" />
              </h1>
              <p className="text-[12px] text-neutral-500">@nordixdotma</p>
            </div>

            <p className="mt-1.5 text-[12px] leading-tight text-neutral-300">
              Check out my portfolio:{" "}
              <a href="https://notnordix.vercel.app" target="_blank" rel="noreferrer" className="text-[#1d9bf0] hover:underline">notnordix.vercel.app</a>
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[12px] text-neutral-500">
              <a href="https://instagram.com/nordix.ma" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#1d9bf0] hover:underline">
                <Instagram className="h-3 w-3" />
                nordix.ma
              </a>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined September 2020
              </span>
            </div>

            <div className="mt-1.5 flex gap-3 text-[12px]">
              <a href="#" className="hover:underline text-neutral-300">
                <span className="font-bold text-white">219</span> <span className="text-neutral-500">Following</span>
              </a>
              <a href="#" className="hover:underline text-neutral-300">
                <span className="font-bold text-white">183</span> <span className="text-neutral-500">Followers</span>
              </a>
            </div>
          </div>

          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "AI Chat" ? (
              showMobileWarning ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-neutral-900/50 p-4 rounded-full mb-4">
                    <Monitor className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Desktop Optimized</h3>
                  <p className="text-neutral-400 text-sm mb-6 max-w-[250px]">
                    You should open this portfolio in desktop to fully experience the AI Chat.
                  </p>
                  <Button 
                    onClick={() => setShowMobileWarning(false)} 
                    variant="ghost" 
                    className="text-white bg-red-700 rounded-full text-xs"
                  >
                    Go Back
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                   <div className="bg-neutral-900/50 p-4 rounded-full mb-4">
                    <Bot className="h-8 w-8 text-[#1d9bf0]" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Chat with my AI Clone</h3>
                   <p className="text-neutral-400 text-sm mb-6 max-w-[250px]">
                     Ask me anything about my projects, skills, or experience. My AI knows it all!
                   </p>
                   <Button 
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setShowMobileWarning(true)
                      }
                    }}
                    className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-bold px-8"
                   >
                     <MessageCircle className="mr-2 h-4 w-4" />
                     Start Chat
                   </Button>
                </div>
              )
            ) : (
             // Render content for Projects, About, Contact
             tabContent[activeTab as keyof typeof tabContent] && (
               <PostContent 
                 videoUrl={tabContent[activeTab as keyof typeof tabContent].video}
                 text={tabContent[activeTab as keyof typeof tabContent].text}
                 stats={tabContent[activeTab as keyof typeof tabContent].stats}
               />
             )
            )}
            
            {/* Fallback/Empty state if tab not found - optional */}
            {!["Home", "Projects", "About", "Contact", "AI Chat"].includes(activeTab) && (
              <div className="p-8 text-center text-neutral-500 text-sm">Content coming soon...</div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
