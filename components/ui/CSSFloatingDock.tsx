"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const CSSFloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[]
  desktopClassName?: string
  mobileClassName?: string
}) => {
  return (
    <>
      <CSSFloatingDockDesktop items={items} className={desktopClassName} />
      <CSSFloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

// 移动端浮动导航
const CSSFloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[]
  className?: string
}) => {
  const [open, setOpen] = useState(false);
  const [bounce, setBounce] = useState(false);

  // 添加一个自动弹跳效果，提示用户此处有导航功能
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative block md:hidden", className)}>
      {/* 展开的导航菜单 */}
      <div 
        className={`absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2 transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {items.map((item, idx) => (
          <Link
            href={item.href}
            key={item.title}
            className="h-12 w-12 rounded-full bg-white shadow-md dark:bg-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-95"
            style={{
              transitionDelay: `${(items.length - 1 - idx) * 50}ms`
            }}
          >
            <div className="h-5 w-5 text-blue-600 dark:text-blue-400">{item.icon}</div>
            {/* 悬浮提示 */}
            <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-white dark:bg-neutral-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      
      {/* 控制按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className={`h-14 w-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 relative ${
          bounce ? 'animate-bounce' : ''
        } ${open ? 'rotate-180' : ''}`}
      >
        {/* 添加光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 animate-pulse opacity-30"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {open ? (
            // 关闭图标
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            // 导航图标
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>
    </div>
  )
}

// 桌面端浮动导航
const CSSFloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[]
  className?: string
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [bounce, setBounce] = useState(false);

  // 添加一个自动弹跳效果，提示用户此处有导航功能
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        `mx-auto hidden md:flex h-16 gap-6 items-center rounded-full bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-purple-500/90 backdrop-blur-md shadow-xl px-6 py-3 border border-white/20 dark:border-white/10 transition-all duration-300 ${bounce ? 'animate-bounce' : ''}`,
        className,
      )}
    >
      {items.map((item, idx) => (
        <IconContainer 
          key={item.title} 
          {...item} 
          isActive={activeIndex === idx} 
          onMouseEnter={() => setActiveIndex(idx)} 
          onMouseLeave={() => setActiveIndex(-1)} 
        />
      ))}
    </div>
  )
}

// 图标容器
function IconContainer({
  title,
  icon,
  href,
  isActive,
  onMouseEnter,
  onMouseLeave
}: {
  title: string
  icon: React.ReactNode
  href: string
  isActive: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <Link href={href} className="relative group">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 transition-all duration-300 ${
          isActive 
            ? 'scale-125 shadow-lg' 
            : 'scale-100 hover:scale-110 active:scale-95'
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`w-6 h-6 text-blue-600 dark:text-blue-400 transition-all duration-300 ${
          isActive ? 'scale-110' : 'scale-100'
        }`}>
          {icon}
        </div>
        
        {/* 标题提示 */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 text-xs rounded-md whitespace-nowrap bg-white text-blue-600 dark:bg-neutral-800 dark:text-blue-400 shadow-md border border-blue-100 dark:border-blue-900 transition-all duration-300 ${
            isActive ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1 pointer-events-none'
          }`}
        >
          {title}
          {/* 小三角形 */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-white dark:bg-neutral-800 rotate-45 border-r border-b border-blue-100 dark:border-blue-900"></div>
        </div>

        {/* 添加光晕效果 */}
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-20"></div>
        )}
      </div>
    </Link>
  )
} 