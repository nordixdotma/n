"use client";

import { memo, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Github, Linkedin, Phone, Instagram, ExternalLink } from "lucide-react";
import { XIcon } from "@/components/x-icon";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

interface ContactSectionProps {
  isMobile: boolean;
}

const contactItems = [
  {
    icon: Phone,
    title: "Phone & WhatsApp",
    content: "(+212) 704 749 027",
    href: "https://wa.me/212704749027",
    color: "#25D366",
  },
  {
    icon: Mail,
    title: "Email",
    content: "noureddineelmhassani@email.com",
    href: "mailto:noureddineelmhassani@email.com",
    color: "#EA4335",
  },
  {
    icon: Github,
    title: "GitHub",
    content: "nordixdotma",
    href: "https://github.com/nordixdotma",
    color: "#000000",
  },
  {
    icon: XIcon,
    title: "X / Twitter",
    content: "nordixdotma",
    href: "https://x.com/nordixdotma",
    color: "#000000",
  },
  {
    icon: Instagram,
    title: "Instagram",
    content: "nordix.ma",
    href: "https://instagram.com/nordix.ma",
    color: "#E1306C",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    content: "nordixdotma",
    href: "https://linkedin.com/in/nordixdotma",
    color: "#0A66C2",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function ContactSectionComponent({ isMobile }: ContactSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredItem(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const { ref: contactRef, inView: contactInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section
      id="contact"
      className={cn(
        "w-screen shrink-0 snap-start relative overflow-hidden flex items-center",
        isMobile ? "min-h-screen py-20" : "h-screen"
      )}
    >
      <div
        className={cn(
          "container px-6 md:px-12 mx-auto relative z-10 w-full max-w-7xl",
          isMobile ? "flex flex-col h-full justify-center" : "grid lg:grid-cols-3 gap-12 items-start"
        )}
      >
        <motion.div
          ref={contactRef}
          initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
          animate={contactInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col space-y-4 w-full",
            isMobile ? "items-center text-center mb-10" : "items-start text-left"
          )}
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-5xl font-light tracking-tighter sm:text-6xl md:text-7xl mb-1 text-white">Let’s Talk</h2>
          </motion.div>

          <motion.p
            className={cn(
              "text-sm sm:text-base mt-0! text-white/50 font-mono",
              isMobile ? "max-w-xs mx-auto" : "max-w-md"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isMobile ? "/ Got a project idea? Hit me up." : "/ Got a project idea or curious about something I've made? Hit me up. I'd love to chat. Find me on my socials."}
          </motion.p>
        </motion.div>

        <div className={cn(!isMobile && "lg:col-span-2 w-full")}>
          {isMobile ? (
            <motion.div
              className="grid grid-cols-3 gap-3 max-w-3xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
            >
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { x: i % 2 === 0 ? -20 : 20, y: i % 3 === 0 ? -10 : 0 },
                    visible: {
                      x: 0,
                      y: 0,
                      transition: { type: "spring", stiffness: 100, damping: 15 },
                    },
                  }}
                  className="touch-manipulation relative"
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    className={cn(
                      "flex flex-col items-center justify-center aspect-square p-2 rounded-sm text-center cursor-pointer",
                      "backdrop-blur-md border border-white/50 transition-colors duration-200 bg-white/5",
                      "active:scale-95 group relative z-10"
                    )}
                    style={
                      {
                        boxShadow: !isMobile && hoveredItem === i ? `0 0 15px 2px ${item.color}40` : "none",
                        willChange: "transform",
                        borderColor: hoveredItem === i ? item.color : "rgba(255,255,255,0.1)",
                      } as CSSProperties
                    }
                    onClick={() => handleMouseEnter(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleMouseEnter(i)}
                    onTouchEnd={handleMouseLeave}
                  >
                    <div className="flex items-center justify-center mb-1 relative">
                      <item.icon
                        className={cn(
                          "w-7 h-7 transition-colors duration-200",
                          hoveredItem === i ? "text-(--item-color)" : "text-white/70"
                        )}
                        style={{ ["--item-color" as any]: item.color } as CSSProperties}
                      />
                    </div>

                    <h3
                      className={cn(
                        "text-[11px] font-medium transition-colors line-clamp-1",
                        hoveredItem === i ? "text-(--item-color)" : "text-white/70"
                      )}
                      style={{ ["--item-color" as any]: item.color } as CSSProperties}
                    >
                      {item.title.split(" ")[0]}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
              variants={containerVariants}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
            >
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { x: i % 2 === 0 ? -50 : 50, rotateY: i % 2 === 0 ? -10 : 10 },
                    visible: {
                      x: 0,
                      rotateY: 0,
                      transition: { type: "spring", stiffness: 70, damping: 15 },
                    },
                  }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-sm cursor-pointer",
                      "backdrop-blur-md border border-white/50 transition-colors duration-200 bg-white/5",
                      "group relative overflow-hidden"
                    )}
                    style={
                      {
                        boxShadow: hoveredItem === i ? `0 0 20px 2px ${item.color}40` : "none",
                        willChange: "transform, box-shadow",
                        borderColor: hoveredItem === i ? item.color : "rgba(255,255,255,0.1)",
                      } as CSSProperties
                    }
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <AnimatePresence>
                      {hoveredItem === i && (
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r"
                          style={{ backgroundImage: `linear-gradient(120deg, ${item.color}15, transparent 80%)` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 relative z-10 bg-white/5">
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          hoveredItem === i ? "text-(--item-color)" : "text-white/70"
                        )}
                        style={{ ["--item-color" as any]: item.color } as CSSProperties}
                      />

                      {hoveredItem === i && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: item.color } as CSSProperties}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 0.1, 0], scale: [0.8, 1.2, 0.8] }}
                          transition={{ repeat: 1, duration: 1.5 }}
                        />
                      )}
                    </div>

                    <div className="flex-1 relative z-10">
                      <h3
                        className={cn("text-sm font-medium transition-colors", hoveredItem === i ? "text-(--item-color)" : "text-white")}
                        style={{ ["--item-color" as any]: item.color } as CSSProperties}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/40">{item.content}</p>
                    </div>

                    <AnimatePresence>
                      {hoveredItem === i && (
                        <motion.div className="ml-auto relative z-10" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: -10 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                          <ExternalLink className={cn("w-4 h-4", hoveredItem === i ? "text-(--item-color)" : "text-white")} style={{ ["--item-color" as any]: item.color } as CSSProperties} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export const ContactSection = memo(ContactSectionComponent);
