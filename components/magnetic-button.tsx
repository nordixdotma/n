"use client"

import type React from "react"
import { useRef } from "react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "lg"
  onClick?: () => void
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    positionRef.current = { x: x * 0.15, y: y * 0.15 }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.setProperty('--tx', `${positionRef.current.x}px`)
        ref.current.style.setProperty('--ty', `${positionRef.current.y}px`)
      }
    })
  }

  const handleMouseLeave = () => {
    positionRef.current = { x: 0, y: 0 }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.setProperty('--tx', '0px')
        ref.current.style.setProperty('--ty', '0px')
      }
    })
  }

  const variants = {
    primary:
      "bg-foreground/95 text-background hover:bg-foreground backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 hover:border-foreground/20",
    ghost: "bg-transparent text-foreground hover:bg-foreground/5 backdrop-blur-sm",
  }

  const sizes = {
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-full font-medium
        transition-all duration-300 ease-out will-change-transform
        magnetic-button
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
