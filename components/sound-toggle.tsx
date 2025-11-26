"use client"

import { useState, useEffect } from "react"

interface SoundToggleProps {
    vimeoPlayerRef: React.RefObject<any>
}

export function SoundToggle({ vimeoPlayerRef }: SoundToggleProps) {
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        // Initialize muted state - Vimeo starts muted by default
        const savedMutedState = sessionStorage.getItem("videoMuted")
        if (savedMutedState !== null) {
            const mutedState = savedMutedState === "true"
            setIsMuted(mutedState)
            if (vimeoPlayerRef.current) {
                vimeoPlayerRef.current.setMuted(mutedState)
            }
        }
    }, [vimeoPlayerRef])

    const handleToggleSound = () => {
        const newMutedState = !isMuted
        setIsMuted(newMutedState)
        if (vimeoPlayerRef.current) {
            vimeoPlayerRef.current.setMuted(newMutedState)
            if (!newMutedState) {
                // Set volume to a reasonable level when unmuting
                vimeoPlayerRef.current.setVolume(0.5)
            }
        }
        // Persist to sessionStorage (using session instead of local to avoid localStorage issues)
        sessionStorage.setItem("videoMuted", String(newMutedState))
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