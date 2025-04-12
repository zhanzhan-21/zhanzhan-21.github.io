"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

// 自定义导航链接组件
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // 提取目标ID
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      // 获取当前滚动位置
      const currentScrollPosition = window.scrollY
      
      // 计算目标元素的绝对位置
      const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition
      
      // 计算偏移量 - 导航栏高度(80px) + 额外间距(40px)
      const offset = 0
      
      // 滚动到目标位置
      window.scrollTo({
        top: targetPosition - offset,
        behavior: 'smooth'
      })
      
      // 更新URL哈希，但不触发默认的滚动行为
      window.history.pushState(null, '', href)
    }
  }
  
  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
    >
      {children}
    </a>
  )
}

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
          <div className="hidden md:flex space-x-8">
            <NavLink href="#about">关于</NavLink>
            <NavLink href="#skills">技能</NavLink>
            <NavLink href="#projects">项目展示</NavLink>
            <NavLink href="#awards">荣誉奖项</NavLink>
          </div>
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
