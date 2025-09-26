"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({ theme: "dark", setTheme: () => null })

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = false,
  attribute = "class",
  disableTransitionOnChange = false,
}) {
  const [theme, setThemeState] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old class
    root.classList.remove("light", "dark")

    // Add new class
    root.classList.add(theme)

    // Set attribute if needed
    if (attribute === "class") {
      root.classList.add(theme)
    } else {
      root.setAttribute(attribute, theme)
    }
  }, [theme, attribute])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    // Save to localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", newTheme)
    }
  }

  useEffect(() => {
    // Initialize from localStorage or default
    const savedTheme = window.localStorage.getItem("theme")
    if (savedTheme) {
      setThemeState(savedTheme)
    } else if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setThemeState(systemTheme)
    }
  }, [enableSystem])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

