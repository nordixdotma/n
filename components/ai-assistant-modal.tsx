"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Minus, Maximize2, Bot, Mic, MicOff, ArrowUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AiAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WindowSize = "normal" | "expanded" | "minimized";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  isNew?: boolean;
}

/* Size / class maps moved outside component to avoid recreation */
const sizeClasses: Record<WindowSize, string> = {
  normal: "!max-w-4xl h-[75vh]",
  expanded: "!max-w-6xl h-[95vh]",
  minimized: "!max-w-2xl h-[55vh]",
};

const contentWidthClasses: Record<WindowSize, string> = {
  normal: "max-w-4xl px-4",
  expanded: "max-w-6xl px-4",
  minimized: "max-w-2xl px-3",
};

const inputWidthClasses: Record<WindowSize, string> = {
  normal: "max-w-2xl",
  expanded: "max-w-3xl",
  minimized: "max-w-xl",
};

const textSizeClasses: Record<WindowSize, string> = {
  normal: "text-md",
  expanded: "text-md",
  minimized: "text-base",
};

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "Tell me about your experience",
  "How can I reach you?",
];

const headingSizeClasses: Record<WindowSize, string> = {
  normal: "text-2xl",
  expanded: "text-3xl",
  minimized: "text-xl",
};

/* Word-by-word typing animation component */
interface TypingTextProps {
  text: string;
  onComplete?: () => void;
  speed?: number;
}

function TypingText({ text, onComplete, speed = 25 }: TypingTextProps) {
  const [displayedWords, setDisplayedWords] = useState<number>(0);
  const words = text.split(/(\s+)/); // Split but keep whitespace

  useEffect(() => {
    if (displayedWords < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedWords, words.length, speed, onComplete]);

  const visibleText = words.slice(0, displayedWords).join("");
  return <>{formatBotMessage(visibleText)}</>;
}

/* Format bot message: lines ending with colon become bold titles */
function formatBotMessage(content: string) {
  const lines = content.split("\n");
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Check if line is a title (ends with colon or is all caps with colon)
    const isTitle = trimmedLine.endsWith(":") && trimmedLine.length < 60;
    
    if (!trimmedLine) {
      return <br key={index} />;
    }
    
    return (
      <span key={index}>
        {isTitle ? (
          <strong className="font-semibold">{trimmedLine}</strong>
        ) : (
          trimmedLine
        )}
        {index < lines.length - 1 && <br />}
      </span>
    );
  });
}

function AiAssistantModalComponent({ open, onOpenChange }: AiAssistantModalProps) {
  const [windowSize, setWindowSize] = useState<WindowSize>("normal");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // keep a ref to the latest messages for async handlers to avoid stale closures
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Small timeout to ensure DOM updated (keeps UX consistent)
    const id = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
    return () => clearTimeout(id);
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  // Voice recording logic
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      // Trigger textarea resize
      if (textareaRef.current) {
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
          }
        }, 0);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isRecording]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: trimmed,
    };

    // append user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setHasStartedChat(true);

    try {
      // Build conversation using the up-to-date messagesRef
      const conversationHistory = [...messagesRef.current, userMessage].map((m) => ({
        role: m.type,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      if (data?.text) {
        const botMessage: Message = { id: Date.now() + 1, type: "bot", content: data.text, isNew: true };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // graceful fallback if API returns no text
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: "bot", content: "I didn't get a reply — please try again.", isNew: true },
        ]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input]);

  // keyboard handler for Enter (without shift) is kept on textarea
  // UI rendering
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-black! border-none! outline-none! text-white p-0 gap-0 overflow-hidden transition-all duration-300 ease-in-out [&>button]:hidden shadow-2xl flex flex-col rounded-[6px]",
          sizeClasses[windowSize]
        )}
      >
        <VisuallyHidden.Root>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>Chat with our AI assistant to learn more about Nordix.</DialogDescription>
        </VisuallyHidden.Root>

        {/* Header (macOS-like) */}
        <div className="bg-gray-100 px-3 py-3 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2 group">
            <button
              onClick={() => onOpenChange(false)}
              className="w-5 h-5 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3 h-3 text-[#4d0000]" />
            </button>

            <button
              onClick={() => setWindowSize("minimized")}
              className="w-5 h-5 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Minimize"
            >
              <Minus className="w-3 h-3 text-[#4d3900]" />
            </button>

            <button
              onClick={() => setWindowSize((s) => (s === "expanded" ? "normal" : "expanded"))}
              className="w-5 h-5 rounded-full bg-[#28C840] hover:bg-[#28C840]/90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Expand"
            >
              <Maximize2 className="w-3 h-3 text-[#003d0d]" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-medium text-neutral-500">Nordix</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-col flex-1 min-h-0 bg-black">
          {!hasStartedChat ? (
            /* Initial centered state */
            <div className="flex-1 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("w-full flex flex-col items-center", contentWidthClasses[windowSize])}
                >
                  <motion.h3 
                    layoutId="chat-title"
                    className={cn("font-semibold text-white mb-8 text-center", headingSizeClasses[windowSize])}
                  >
                    Hi there! I'm your AI assistant. <br className="hidden sm:block" /> How can I help you today?
                  </motion.h3>
                  
                  {/* Modern Input Container */}
                  <div className={cn("w-full mb-6", inputWidthClasses[windowSize])}>
                    <motion.div 
                      className="relative rounded-full"
                      animate={{ 
                        boxShadow: isFocused 
                          ? '0 0 0 1px rgba(255,255,255,0.25), 0 8px 40px rgba(0,0,0,0.5)' 
                          : '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Gradient border effect on focus */}
                      <AnimatePresence>
                        {isFocused && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -inset-px rounded-full -z-10 animate-shimmer"
                            style={{ 
                              background: 'linear-gradient(90deg, #505050, #909090, #505050)',
                              backgroundSize: '200% 100%'
                            }}
                          />
                        )}
                      </AnimatePresence>
                      
                      <div className="relative flex items-center gap-2 bg-[#1a1a1a] rounded-full p-2 pl-3">
                        {/* Microphone icon */}
                        <motion.button
                          type="button"
                          onClick={toggleRecording}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "w-9 h-9 flex items-center justify-center transition-colors shrink-0 rounded-full",
                            isRecording ? "bg-red-500 text-white animate-pulse" : "text-neutral-500 hover:text-neutral-300"
                          )}
                          aria-label={isRecording ? "Stop recording" : "Start recording"}
                        >
                          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </motion.button>

                        <textarea
                          ref={textareaRef}
                          value={input}
                          onChange={handleTextareaChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              void handleSend();
                            }
                          }}
                          placeholder="Ask me anything..."
                          rows={1}
                          className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 outline-none focus:outline-none text-white placeholder:text-neutral-600 py-2.5 resize-none text-[15px] leading-relaxed max-h-[150px] min-h-[24px]"
                        />

                        {/* Send button with animations */}
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: input.trim() ? 1 : 0.9,
                            opacity: input.trim() ? 1 : 0.5
                          }}
                          className="shrink-0 mb-1 mr-1"
                        >
                          <motion.button
                            onClick={() => void handleSend()}
                            disabled={!input.trim()}
                            whileHover={input.trim() ? { scale: 1.05 } : {}}
                            whileTap={input.trim() ? { scale: 0.95 } : {}}
                            className={cn(
                              "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200",
                              input.trim() 
                                ? "bg-white text-black cursor-pointer" 
                                : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                            )}
                            aria-label="Send message"
                          >
                            <motion.div
                              animate={{ 
                                scale: input.trim() ? 1 : 0.95
                              }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                              <ArrowUp className="h-5 w-5" />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <div className={cn("flex flex-wrap justify-center gap-2 w-full", inputWidthClasses[windowSize])}>
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        onClick={() => {
                          setInput(question);
                          // We don't auto-send here to let user edit if they want, 
                          // but the user might prefer auto-send. 
                          // Let's keep it interactive.
                        }}
                        className="px-4 py-2 rounded-full border border-neutral-800 text-neutral-400 text-sm hover:border-neutral-600 hover:text-white transition-all bg-neutral-900/50"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
              </motion.div>
            </div>
          ) : (
            /* Chat messages state */
            <div
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400"
              ref={scrollRef}
            >
              <div className="flex flex-col pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("px-4 py-6 w-full", textSizeClasses[windowSize])}>
                    <div className={cn("mx-auto flex gap-4", contentWidthClasses[windowSize])}>


                      <div
                        className={cn(
                          "relative flex-1 overflow-hidden leading-7",
                          message.type === "user" && "max-w-[85%] ml-auto flex justify-end"
                        )}
                      >
                        {message.type === "user" ? (
                          <div className="bg-[#303030] px-5 py-2.5 rounded-3xl text-[#ececec]">{message.content}</div>
                        ) : (
                          <div className="text-[#ececec] pt-1">
                            {message.isNew ? (
                              <TypingText
                                text={message.content}
                                speed={20}
                                onComplete={() => {
                                  setMessages((prev) =>
                                    prev.map((m) =>
                                      m.id === message.id ? { ...m, isNew: false } : m
                                    )
                                  );
                                }}
                              />
                            ) : (
                              formatBotMessage(message.content)
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="px-4 py-6 w-full">
                    <div className={cn("mx-auto flex gap-4", contentWidthClasses[windowSize])}>

                      <div className="pt-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" } as CSSProperties} />
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" } as CSSProperties} />
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" } as CSSProperties} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input area (only shown after chat starts) */}
          {hasStartedChat && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 shrink-0 bg-linear-to-t from-black via-black to-transparent"
            >
              <div className={cn("mx-auto", contentWidthClasses[windowSize])}>
                <motion.div 
                  className="relative rounded-full"
                  animate={{ 
                    boxShadow: isFocused 
                      ? '0 0 0 1px rgba(255,255,255,0.25), 0 8px 40px rgba(0,0,0,0.5)' 
                      : '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Gradient border effect on focus */}
                  <AnimatePresence>
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -inset-px rounded-full -z-10 animate-shimmer"
                        style={{ 
                          background: 'linear-gradient(90deg, #505050, #909090, #505050)',
                          backgroundSize: '200% 100%'
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="relative flex items-center gap-2 bg-[#1a1a1a] rounded-full p-2 pl-3">
                    {/* Microphone icon */}
                    <motion.button
                      type="button"
                      onClick={toggleRecording}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center transition-colors shrink-0 rounded-full",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "text-neutral-500 hover:text-neutral-300"
                      )}
                      aria-label={isRecording ? "Stop recording" : "Start recording"}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>

                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleTextareaChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                      placeholder="Continue the conversation..."
                      rows={1}
                      className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 outline-none focus:outline-none text-white placeholder:text-neutral-600 py-2.5 resize-none text-[15px] leading-relaxed max-h-[150px] min-h-[24px]"
                    />

                    {/* Send button with animations */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        scale: input.trim() ? 1 : 0.9,
                        opacity: input.trim() ? 1 : 0.5
                      }}
                      className="shrink-0 mb-1 mr-1"
                    >
                      <motion.button
                        onClick={() => void handleSend()}
                        disabled={!input.trim()}
                        whileHover={input.trim() ? { scale: 1.05 } : {}}
                        whileTap={input.trim() ? { scale: 0.95 } : {}}
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200",
                          input.trim() 
                            ? "bg-white text-black cursor-pointer" 
                            : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                        )}
                        aria-label="Send message"
                      >
                        <motion.div
                          animate={{ 
                            scale: input.trim() ? 1 : 0.95
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="text-center mt-3">
                  <p className="text-[11px] text-neutral-600">Nordix can make mistakes. Check important info.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const AiAssistantModal = memo(AiAssistantModalComponent);
