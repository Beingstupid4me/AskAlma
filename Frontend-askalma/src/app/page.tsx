import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <MessageSquare size={28} />
          </div>

          <h1 className="text-3xl font-bold">Welcome to AskAlma</h1>

          <p className="text-muted-foreground">
            AskAlma helps you quickly find answers and navigate the IIIT Delhi website with ease. Powered by advanced AI, it's your go-to assistant for discovering regulations, resources, and more.
          </p>

          <Link href="/chat" className="block">
            <Button className="w-full py-6 text-lg">
              Start Chatting
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 AskAlma. All rights reserved.</p>
      </footer>
    </div>
  )
}