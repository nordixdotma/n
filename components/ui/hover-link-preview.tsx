"use client"

import type * as React from "react"
import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverLinkPreviewProps {
  href?: string
  previewImage: string
  imageAlt?: string
  children: React.ReactNode
  className?: string
  download?: boolean
  isMobile?: boolean
  position?: "top" | "bottom"
  newTab?: boolean
  onClick?: () => void
  as?: React.ElementType
}

const HoverLinkPreview: React.FC<HoverLinkPreviewProps> = ({
  href = "#",
  previewImage,
  imageAlt = "Link preview",
  children,
  className,
  download,
  isMobile = false,
  position = "top",
  newTab = true,
  onClick,
  as: Component = "a",
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [mounted, setMounted] = useState(false)
  const prevX = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const motionTop = useMotionValue(0)
  const motionLeft = useMotionValue(0)
  const motionRotate = useMotionValue(0)

  const springTop = useSpring(motionTop, { stiffness: 300, damping: 30 })
  const springLeft = useSpring(motionLeft, { stiffness: 300, damping: 30 })
  const springRotate = useSpring(motionRotate, { stiffness: 300, damping: 20 })

  const handleMouseEnter = () => {
    if (isMobile) return
    setShowPreview(true)
    prevX.current = null
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    setShowPreview(false)
    prevX.current = null
    motionRotate.set(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return

    const PREVIEW_WIDTH = 192
    const PREVIEW_HEIGHT = 112
    const OFFSET_Y = position === "top" ? 40 : -40

    motionTop.set(e.clientY - (position === "top" ? PREVIEW_HEIGHT : 0) - OFFSET_Y)
    motionLeft.set(e.clientX - PREVIEW_WIDTH / 2)

    if (prevX.current !== null) {
      const deltaX = e.clientX - prevX.current
      const newRotate = Math.max(-15, Math.min(15, deltaX * 1.2))
      motionRotate.set(newRotate)
    }
    prevX.current = e.clientX
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <>
      <Component
        href={Component === "a" ? href : undefined}
        target={Component === "a" && newTab ? "_blank" : undefined}
        rel={Component === "a" && newTab ? "noopener noreferrer" : undefined}
        className={cn("relative inline-flex items-center cursor-pointer no-underline text-inherit", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        download={Component === "a" ? download : undefined}
      >
        {children}
      </Component>

      {mounted && !isMobile && createPortal(
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10, rotate: 0 }}
              style={{
                position: "fixed",
                top: springTop,
                left: springLeft,
                rotate: springRotate,
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <div className="bg-white border rounded-sm shadow-sm p-1 min-w-[180px] max-w-xs overflow-hidden">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt={imageAlt}
                  draggable={false}
                  className="w-48 h-28 object-cover rounded-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export { HoverLinkPreview }
