"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const handleToggle = () => {
    // Determine the target theme based on the currently resolved theme
    const targetTheme = resolvedTheme === "dark" ? "light" : "dark"
    console.log(`Toggling theme from ${resolvedTheme} to ${targetTheme}`)
    setTheme(targetTheme)
  }

  // Optional: Render nothing or a placeholder if resolvedTheme is not yet available
  // This can happen on initial server render before hydration
  if (!resolvedTheme) {
    return null
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
