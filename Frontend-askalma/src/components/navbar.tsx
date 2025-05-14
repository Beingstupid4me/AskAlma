import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b border-border p-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">AskAlma</Link>
      <div className="flex gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="sm">
            <Settings size={16} className="mr-1" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  </header>
  )
}

