"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleHistory = () => {
    setIsHistoryExpanded(!isHistoryExpanded)
  }

  const pastConversations = [
    "Website Navigation Assistance",
    "Finding Regulations on IIIT Delhi Website",
    "Chatbot Integration Strategy",
    "Troubleshooting Web Scraping",
    "Model Evaluation for AskAlma",
    "Vector Database Setup",
    "LLM Selection for AskAlma",
    "User Experience Feedback on AskAlma",
    "Optimizing Chatbot Responses",
    "Deployment of AskAlma on IIIT Delhi Website"
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-secondary border-r border-border transition-transform duration-300 ease-in-out transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex flex-col h-full">

          {/* History Section */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="px-3 py-2">
              <button
                onClick={toggleHistory}
                className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              >
                <span>Previous 30 Days</span>
                {isHistoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isHistoryExpanded && (
                <div className="mt-1 space-y-1">
                  {pastConversations.map((title, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="p-3 border-t border-border">
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings size={16} />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
