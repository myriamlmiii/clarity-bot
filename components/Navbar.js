"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sparkles, Moon, Sun } from "lucide-react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Set default theme to dark
    if (!theme) {
      setTheme("dark")
    }
  }, [theme, setTheme])

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">ClarityBot</span>
      </Link>

      <div className="flex items-center gap-6">
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">
                About
              </Link>
            </li>
          </ul>
        </nav>

        {mounted && (
          <button
            className="p-2 rounded-md hover:bg-muted/50 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </button>
        )}
      </div>
    </header>
  )
}

