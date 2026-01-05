'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { AiAssistantModal } from './ai-assistant-modal';

interface AiAssistantButtonProps {
  onOpenChange?: (open: boolean) => void;
}

export function AiAssistantButton({ onOpenChange }: AiAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const baseBackgroundColor = '#ffffff';
  const hoverBackgroundColor = '#ff4500';
  const baseTextColor = '#000000';
  const hoverTextColor = '#ffffff';
  const innerCircleBg = '#000000';
  const innerCircleColor = '#ffffff';

  // Text to rotate around the button
  const rotatingText = "ASK AI • ASK AI • ASK AI • ";

  return (
    <>
      <button
        onClick={() => handleOpenChange(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-4 left-4 z-100 w-[80px] h-[80px] rounded-full cursor-pointer hidden md:flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: isHovered ? hoverBackgroundColor : baseBackgroundColor,
          color: isHovered ? hoverTextColor : baseTextColor,
          transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          fontWeight: 500,
          fontSize: '12px',
          letterSpacing: '0.5px',
          border: 'none',
          outline: 'none',
        }}
        aria-label="Open AI Chat"
      >
        {/* Rotating text around the circle */}
        <div 
          className="animate-text-rotation absolute inset-0"
          style={{
            color: isHovered ? hoverTextColor : baseTextColor,
          }}
        >
          {rotatingText.split('').map((char, index) => (
            <span
              key={index}
              className="absolute left-1/2 text-[12px] font-medium"
              style={{
                transform: `rotate(${(360 / rotatingText.length) * index}deg)`,
                transformOrigin: '0 40px',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Inner circle with Bot icon and arrow */}
        <div
          className="relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: innerCircleBg,
            color: innerCircleColor,
          }}
        >
          {/* Bot icon - hides on hover */}
          <Bot
            size={20}
            style={{
              transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
              transform: isHovered ? 'translate(150%, -150%)' : 'translate(0, 0)',
              opacity: isHovered ? 0 : 1,
            }}
          />
          {/* Arrow icon - shows on hover */}
          <svg
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={14}
            className="absolute"
            style={{
              transition: 'transform 0.3s ease-in-out 0.1s',
              transform: isHovered ? 'translate(0, 0)' : 'translate(-150%, 150%)',
            }}
          >
            <path
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>
      <AiAssistantModal open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
}
