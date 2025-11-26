"use client"

import { useState, useEffect } from "react"

interface SoundToggleProps {
    videoRef: React.RefObject<HTMLVideoElement>
}

export function SoundToggle({ videoRef }: SoundToggleProps) {
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        // Initialize muted state from localStorage
        const savedMutedState = localStorage.getItem("videoMuted")
        if (savedMutedState !== null) {
            const mutedState = savedMutedState === "true"
            setIsMuted(mutedState)
            if (videoRef.current) {
                videoRef.current.muted = mutedState
            }
        }
    }, [videoRef])

    const handleToggleSound = () => {
        const newMutedState = !isMuted
        setIsMuted(newMutedState)

        if (videoRef.current) {
            videoRef.current.muted = newMutedState
        }

        // Persist to localStorage
        localStorage.setItem("videoMuted", String(newMutedState))
    }

    return (
        <button
            onClick={handleToggleSound}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center justify-center cursor-pointer"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
            <span className="font-sans text-xs font-bold text-foreground">SOUND</span>
            <div className="flex items-center gap-1 -mt-1">
                <span className={`font-sans text-xs font-bold transition-colors ${isMuted ? "text-foreground/50" : "text-foreground"}`}>
                    ON
                </span>
                <span className="text-white">|</span>
                <span className={`font-sans text-xs font-bold transition-colors ${isMuted ? "text-foreground" : "text-foreground/50"}`}>
                    OFF
                </span>
            </div>
        </button>
    )
}
