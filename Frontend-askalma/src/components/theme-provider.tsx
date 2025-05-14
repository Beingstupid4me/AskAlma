"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure theme toggle only happens after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return <NextThemesProvider {...props}>{mounted ? children : null}</NextThemesProvider>
}

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
})

export const useTheme = () => useContext(ThemeContext)

