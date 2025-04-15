"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { AboutIcon, SkillsIcon, ProjectsIcon, AwardsIcon, HomeIcon } from "@/components/ui/NavIcons"
import Link from 'next/link'

// 定义统一的滚动偏移量常量
const SCROLL_OFFSET = 80;

// 自定义导航链接组件
const NavLink = ({ 
  href, 
  children,
  icon,
  isActive,
  isMobile = false
}: { 
  href: string; 
  children: React.ReactNode;
  icon: React.ReactNode;
  isActive: boolean;
  isMobile?: boolean;
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // 提取目标ID
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // 获取当前滚动位置
      const currentScrollPosition = window.scrollY;
      
      // 计算目标元素的绝对位置
      const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
      
      // 使用统一的SCROLL_OFFSET常量
      
      // 先更新URL，然后再滚动 - 避免默认的自动滚动行为
      window.history.pushState(null, '', href);
      
      // 使用requestAnimationFrame确保DOM更新和浏览器默认滚动行为不会干扰我们的自定义滚动
      requestAnimationFrame(() => {
        window.scrollTo({
          top: targetPosition - SCROLL_OFFSET,
          behavior: 'smooth'
        });
      });
    }
    
    // 如果是移动端，点击后关闭菜单
    if (isMobile && window.innerWidth < 768) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('closeMobileMenu');
        window.dispatchEvent(event);
      }
    }
  };
  
  // 移动端菜单样式
  if (isMobile) {
    return (
      <a 
        ref={linkRef}
        href={href} 
        onClick={handleClick}
        className={`flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-300 ${
          isActive 
            ? "bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold" 
            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50"
        }`}
      >
        {/* 图标容器 */}
        <div className={`w-6 h-6 ${
          isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {icon}
        </div>
        
        {/* 文字 */}
        <span className="text-lg">{children}</span>
      </a>
    )
  }
  
  // 桌面端菜单样式
  return (
    <a 
      ref={linkRef}
      href={href} 
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex items-center gap-2 transition-all duration-300 ${
        hovered ? 'scale-110' : 'scale-100'
      } ${
        isActive 
          ? "text-primary font-semibold" 
          : "text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
      }`}
    >
      {/* 图标容器 */}
      <div className={`w-6 h-6 transition-all duration-300 ${
        hovered ? 'text-blue-500 dark:text-blue-400' : isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
      }`}>
        {icon}
      </div>
      
      {/* 文字 */}
      <span className="text-lg font-medium">{children}</span>
      
      {/* 悬浮效果 - 下划线 */}
      <div className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 ${
        hovered ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`}></div>
    </a>
  )
}

// 留言板图标组件
const MessageBoardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  // 添加移动菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 添加Logo引用
  const logoRef = useRef<HTMLDivElement>(null);
  
  // 添加当前活动部分的状态
  const [activeSection, setActiveSection] = useState<string>("");
  
  // 监听滚动以更新活动部分
  const checkActiveSection = () => {
    // 获取所有部分
    const sections = ['about', 'skills', 'projects', 'awards', 'contact', 'message-board'];
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
        
        // 使用统一的常量偏移量
        
        // 使用requestAnimationFrame确保滚动在下一帧执行
        requestAnimationFrame(() => {
          // 使用平滑滚动到目标位置
          window.scrollTo({
            top: targetPosition - SCROLL_OFFSET,
            behavior: 'smooth'
          });
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
    
    // 添加关闭移动菜单的事件监听
    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };
    window.addEventListener('closeMobileMenu', closeMobileMenu);
    
    // 页面加载时处理URL中的锚点
    if (window.location.hash) {
      // 防止浏览器的默认滚动行为
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }
      
      // 先滚动到顶部，防止初始的跳跃行为
      window.scrollTo(0, 0);
      
      // 使用RAF确保在浏览器渲染之前执行
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 在这里不执行handleHashChange，让SmoothScrollFix组件处理初始哈希导航
          // 避免两个组件同时处理导致冲突
        });
      });
    }
    
    // 初始检查
    checkActiveSection();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('closeMobileMenu', closeMobileMenu);
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

  // 关闭移动菜单并执行导航
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div 
          ref={logoRef}
          onClick={handleLogoClick}
          className="text-xl font-bold text-primary cursor-pointer hover:scale-110 transition-transform flex items-center gap-2"
        >
          <div className="w-7 h-7 text-primary">
            <HomeIcon />
          </div>
          <span>展春燕</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* 桌面导航链接 - 添加图标和浮动效果 */}
          <div className="hidden md:flex space-x-7">
            <NavLink href="#about" isActive={activeSection === 'about'} icon={<AboutIcon />}>
              关于我
            </NavLink>
            <NavLink href="#skills" isActive={activeSection === 'skills'} icon={<SkillsIcon />}>
              专业技能
            </NavLink>
            <NavLink href="#projects" isActive={activeSection === 'projects'} icon={<ProjectsIcon />}>
              项目经历
            </NavLink>
            <NavLink href="#awards" isActive={activeSection === 'awards'} icon={<AwardsIcon />}>
              荣誉奖励
            </NavLink>
            <Link href="/message-board" legacyBehavior>
              <a className="relative flex items-center gap-2 transition-all duration-300 text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary hover:scale-110">
                <div className="w-6 h-6 text-gray-500 dark:text-gray-400">
                  <MessageBoardIcon />
                </div>
                <span className="text-lg font-medium">留言板</span>
              </a>
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-transform hover:scale-110 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">Menu</span>
            {/* 汉堡菜单图标 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 scale-110' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            className="transition-transform hover:scale-110 active:scale-95"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* 移动端下拉菜单 */}
      <div 
        className={`md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-64 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-1">
          <NavLink href="#about" isActive={activeSection === 'about'} icon={<AboutIcon />} isMobile={true}>
            关于我
          </NavLink>
          <NavLink href="#skills" isActive={activeSection === 'skills'} icon={<SkillsIcon />} isMobile={true}>
            专业技能
          </NavLink>
          <NavLink href="#projects" isActive={activeSection === 'projects'} icon={<ProjectsIcon />} isMobile={true}>
            项目经历
          </NavLink>
          <NavLink href="#awards" isActive={activeSection === 'awards'} icon={<AwardsIcon />} isMobile={true}>
            荣誉奖励
          </NavLink>
          <Link 
            href="/message-board" 
            onClick={handleMobileNavClick} 
            className="flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50"
          >
            <div className="w-6 h-6 text-gray-500 dark:text-gray-400">
              <MessageBoardIcon />
            </div>
            <span className="text-lg">留言板</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
