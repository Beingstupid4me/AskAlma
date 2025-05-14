// app/chat/page.tsx or your equivalent path for ChatPage
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, PlusCircle, Search, MessageSquare } from "lucide-react" // Added MessageSquare for empty state
import ChatMessage from "@/components/chat-message" // Assuming chat-message.tsx is in components
import TypingIndicator from "@/components/typing-indicator" // Assuming this component exists
import Sidebar from "@/components/sidebar" // Assuming this component exists
// import Navbar from "@/components/navbar" // Not used in this layout, but kept if you need it elsewhere
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import axios from 'axios';

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string; // This content will be the raw string from the backend
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // const { theme } = useTheme() // theme is not directly used for styling here, but good to have
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the message container
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [sessionCode, setSessionCode] = useState<string | null>(null)

  // Scroll to bottom when messages change or loading state changes for new message
  useEffect(() => {
    if (!isLoading) { // Only scroll if not currently loading a new message (to avoid jumpiness)
      scrollToBottom();
    }
  }, [messages, isLoading])

  // Check if we need to show the scroll to bottom button
  useEffect(() => {
    const scrollContainer = chatContainerRef.current;
    const handleScroll = () => {
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        // Show button if not scrolled to the very bottom (with some tolerance)
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10 
        setShowScrollButton(!isAtBottom && scrollHeight > clientHeight); // Only show if scrollable
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [messages]) // Re-check when messages change as scrollHeight might update

  // Initialize Session Code (on mount)
  useEffect(() => {
    const storedSessionCode = localStorage.getItem("sessionCode");
    if (storedSessionCode) {
      setSessionCode(storedSessionCode);
    } else {
      const newSessionCode = generateSessionCode(); 
      setSessionCode(newSessionCode);
      localStorage.setItem("sessionCode", newSessionCode);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    } else if (chatContainerRef.current) {
      // Fallback if messagesEndRef isn't ready, scroll container to bottom
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setInput("")
    // Optionally, generate a new session code for a truly "new" chat
    // const newSessionCode = generateSessionCode();
    // setSessionCode(newSessionCode);
    // localStorage.setItem("sessionCode", newSessionCode);
    // Or just clear messages for the current session
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const generateSessionCode = (): string => {
    // Frontend can generate a UUID, or backend can assign one if session_code is null
    return crypto.randomUUID(); 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim();
    if (!trimmedInput) return

    const newUserMessage: Message = {
      id: crypto.randomUUID(), // Use crypto.randomUUID for more robust IDs
      role: "user",
      content: trimmedInput
    }
    setMessages(prev => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (!sessionCode) {
        // This case should ideally not happen if useEffect for sessionCode works
        // But as a fallback, generate one if it's somehow null
        const newSessionCode = generateSessionCode();
        setSessionCode(newSessionCode);
        localStorage.setItem("sessionCode", newSessionCode);
        console.warn("Session code was null, generated a new one:", newSessionCode);
        // Proceed with the newSessionCode for this request
      }
      
      const currentSessionCodeForRequest = sessionCode || localStorage.getItem("sessionCode");
      if (!currentSessionCodeForRequest) {
          console.error("Critical: Session code is missing even after generation attempt.");
          setIsLoading(false);
          // Add an error message to the chat for the user
          setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Sorry, there was a problem with your session. Please refresh the page."
          }]);
          return;
      }


      const response = await axios.post('http://localhost:8000/query', {
        query: trimmedInput,
        session_code: currentSessionCodeForRequest 
      });

      const botResponse: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data.response // This is the raw content including <think>
      }
      setMessages(prev => [...prev, botResponse])

      // The backend should always return the session_code it used/generated.
      // Update if it changed (e.g., if backend generated it because frontend sent null)
      if (response.data.session_code && response.data.session_code !== currentSessionCodeForRequest) {
        setSessionCode(response.data.session_code);
        localStorage.setItem("sessionCode", response.data.session_code);
      }
    } catch (error: any) {
      console.error("Error fetching response:", error);
      const errorContent = error.response?.data?.detail || "Sorry, I encountered an error connecting to the server. Please try again later.";
      const errorResponse: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorContent
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar: Assuming Sidebar component is correctly imported and functional */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64"> {/* Adjust ml-64 based on your Sidebar width */}
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold hover:text-primary">AskAlma</Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            <PlusCircle size={16} className="mr-1" />
            New chat
          </Button>
        </header>

        {/* Chat Messages */}
        <div 
          id="message-container" 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        >
          {messages.length === 0 && !isLoading && ( // Only show if not loading the first message
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare size={48} className="text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">AskAlma Assistant</h2>
              <p className="text-muted-foreground max-w-md">
                How can I assist you today with information about IIIT Delhi?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} role={message.role} content={message.content} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} /> {/* For scrolling to the latest message */}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-24 right-6 md:right-8 rounded-full shadow-lg z-20 bg-background hover:bg-muted" // Adjusted positioning
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/> {/* Arrow down icon */}
            </svg>
          </Button>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask your question here..."
              className="pr-12 py-6 rounded-lg bg-muted focus-visible:ring-1 focus-visible:ring-primary" // Enhanced styling
              aria-label="Chat input"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              {/* Search icon button removed as input field serves this, can be added back if specific UX desired */}
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md w-10 h-10",
                  (!input.trim() && !isLoading) && "opacity-50 cursor-not-allowed" // Make it clear when disabled
                )}
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}