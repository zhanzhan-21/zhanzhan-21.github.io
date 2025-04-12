"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

// 自定义导航链接组件
const NavLink = ({ 
  href, 
  children,
  isActive
}: { 
  href: string; 
  children: React.ReactNode;
  isActive: boolean;
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  
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
      
      // 使用80px的固定偏移量，与其他地方保持一致
      const offset = 80
      
      // 先更新URL，然后再滚动 - 避免默认的自动滚动行为
      window.history.pushState(null, '', href)
      
      // 使用setTimeout确保DOM更新和浏览器默认滚动行为不会干扰我们的自定义滚动
      setTimeout(() => {
        window.scrollTo({
          top: targetPosition - offset,
          behavior: 'smooth'
        })
      }, 10)
    }
  }
  
  return (
    <a 
      ref={linkRef}
      href={href} 
      onClick={handleClick}
      className={`text-lg font-medium transition-colors ${
        isActive 
          ? "text-primary font-semibold" 
          : "text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
      }`}
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  // 添加Logo引用
  const logoRef = useRef<HTMLDivElement>(null);
  
  // 添加当前活动部分的状态
  const [activeSection, setActiveSection] = useState<string>("");
  
  // 监听滚动以更新活动部分
  const checkActiveSection = () => {
    // 获取所有部分
    const sections = ['about', 'skills', 'projects', 'awards', 'contact'];
    // 添加顶部检查
    if (window.scrollY < 300) {
      setActiveSection('');
      return;
    }
    
    // 检查每个部分是否在视口中
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        // 当部分的顶部进入视口顶部下方150px范围内时，将其视为活动部分
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  };

  // 处理URL哈希改变，确保从外部访问锚点也能正确滚动
  const handleHashChange = () => {
    // 获取当前URL哈希（去掉#符号）
    const hash = window.location.hash.replace('#', '');
    
    // 如果哈希存在并且对应的元素存在
    if (hash && document.getElementById(hash)) {
      // 获取目标元素
      const targetElement = document.getElementById(hash);
      
      if (targetElement) {
        // 防止浏览器的默认滚动行为
        if (history.scrollRestoration) {
          history.scrollRestoration = 'manual';
        }
        
        // 获取当前滚动位置
        const currentScrollPosition = window.scrollY;
        
        // 计算目标元素的绝对位置
        const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
        
        // 使用统一的偏移量
        const offset = 80;
        
        // 使用平滑滚动到目标位置
        window.scrollTo({
          top: targetPosition - offset,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      checkActiveSection();
    }
    window.addEventListener("scroll", handleScroll)
    
    // 添加哈希变更事件监听
    window.addEventListener('hashchange', handleHashChange);
    
    // 页面加载时处理URL中的锚点
    if (window.location.hash) {
      // 防止浏览器的默认滚动行为
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }
      
      // 先滚动到顶部，防止初始的跳跃行为
      window.scrollTo(0, 0);
      
      // 阻止默认的滚动行为
      document.body.style.overflow = 'hidden';
      
      // 使用RAF确保在浏览器渲染之前执行
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 在下一帧恢复滚动
          document.body.style.overflow = '';
          
          // 在DOM完全加载后执行我们的自定义滚动
          setTimeout(handleHashChange, 100);
        });
      });
    }
    
    // 初始检查
    checkActiveSection();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [])

  // Logo点击事件处理
  const handleLogoClick = () => {
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 更新URL
    window.history.pushState(null, '', '/');
  };

  // 主题切换按钮点击处理
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div 
          ref={logoRef}
          onClick={handleLogoClick}
          className="text-xl font-bold text-primary cursor-pointer hover:scale-110 transition-transform"
        >
          展春燕
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-8">
            <NavLink href="#about" isActive={activeSection === 'about'}>
              关于我
            </NavLink>
            <NavLink href="#skills" isActive={activeSection === 'skills'}>
              专业技能
            </NavLink>
            <NavLink href="#projects" isActive={activeSection === 'projects'}>
              项目经历
            </NavLink>
            <NavLink href="#awards" isActive={activeSection === 'awards'}>
              荣誉奖励
            </NavLink>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
