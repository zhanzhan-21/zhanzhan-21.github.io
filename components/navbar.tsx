"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">展春燕</div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary">关于</a>
            <a href="#skills" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary">技能</a>
            <a href="#projects" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary">项目展示</a>
            <a href="#awards" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary">荣誉奖项</a>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
