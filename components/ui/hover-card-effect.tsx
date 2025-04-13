"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useId } from "react"

// 定义一个颜色数组，包含不同的颜色
const backgroundColors = [
  "linear-gradient(135deg, rgba(167, 243, 208, 0.3) 0%, rgba(110, 231, 183, 0.4) 100%)", // 绿色
  "linear-gradient(135deg, rgba(191, 219, 254, 0.3) 0%, rgba(96, 165, 250, 0.4) 100%)", // 蓝色
  "linear-gradient(135deg, rgba(253, 230, 138, 0.3) 0%, rgba(251, 191, 36, 0.4) 100%)", // 黄色
  "linear-gradient(135deg, rgba(254, 202, 202, 0.3) 0%, rgba(248, 113, 113, 0.4) 100%)", // 红色
  "linear-gradient(135deg, rgba(221, 214, 254, 0.3) 0%, rgba(167, 139, 250, 0.4) 100%)", // 紫色
  "linear-gradient(135deg, rgba(209, 250, 229, 0.3) 0%, rgba(52, 211, 153, 0.4) 100%)", // 青绿色
  "linear-gradient(135deg, rgba(254, 215, 170, 0.3) 0%, rgba(251, 146, 60, 0.4) 100%)", // 橙色
  "linear-gradient(135deg, rgba(251, 207, 232, 0.3) 0%, rgba(244, 114, 182, 0.4) 100%)", // 粉色
]

// 定义边框颜色数组
const borderColors = [
  "rgba(110, 231, 183, 0.3)", // 绿色
  "rgba(96, 165, 250, 0.3)", // 蓝色
  "rgba(251, 191, 36, 0.3)", // 黄色
  "rgba(248, 113, 113, 0.3)", // 红色
  "rgba(167, 139, 250, 0.3)", // 紫色
  "rgba(52, 211, 153, 0.3)", // 青绿色
  "rgba(251, 146, 60, 0.3)", // 橙色
  "rgba(244, 114, 182, 0.3)", // 粉色
]

// 定义阴影颜色数组
const shadowColors = [
  "rgba(110, 231, 183, 0.25)", // 绿色
  "rgba(96, 165, 250, 0.25)", // 蓝色
  "rgba(251, 191, 36, 0.25)", // 黄色
  "rgba(248, 113, 113, 0.25)", // 红色
  "rgba(167, 139, 250, 0.25)", // 紫色
  "rgba(52, 211, 153, 0.25)", // 青绿色
  "rgba(251, 146, 60, 0.25)", // 橙色
  "rgba(244, 114, 182, 0.25)", // 粉色
]

// 创建一个服务器端安全的基础卡片组件（无动态效果）
const StaticCardGrid = ({
  items,
  className,
}: {
  items: {
    title: string
    description?: string
    content: React.ReactNode
    link?: string
  }[]
  className?: string
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, idx) => (
        <div key={idx} className="relative group block h-full w-full">
          {item.link ? (
            <Link 
              href={item.link} 
              className="block h-full w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative z-20 h-full">
                {item.content}
              </div>
            </Link>
          ) : (
            <div className="relative z-20 h-full">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// 实际的动态卡片组件（仅在客户端渲染）
const DynamicCardGrid = ({
  items,
  className,
  hoveredIndex,
  setHoveredIndex,
}: {
  items: {
    title: string
    description?: string
    content: React.ReactNode
    link?: string
    hasNestedLink?: boolean
  }[]
  className?: string
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}) => {
  // 每个组件实例使用相同的layoutId
  const layoutId = "hoverBackground";
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, idx) => {
        // 为每个卡片选择颜色，如果索引超出数组长度则循环使用
        const colorIndex = idx % backgroundColors.length;
        const bgColor = backgroundColors[colorIndex];
        const borderColor = borderColors[colorIndex];
        const shadowColor = shadowColors[colorIndex];
        
        // 只为非首个卡片添加背景效果，首个卡片由CardPinEffect处理
        const shouldShowEffect = hoveredIndex === idx && idx !== 0;
        
        // 检查内容是否已经包含链接
        const hasNestedLink = item.hasNestedLink === true;
        
        return (
          <div
            key={idx}
            className="relative group block h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* 使用单独的AnimatePresence，确保一次只显示一个动画 */}
            <AnimatePresence mode="wait">
              {shouldShowEffect && (
                <motion.span
                  className="absolute inset-0 h-full w-full block rounded-xl z-10"
                  style={{
                    background: bgColor,
                    backdropFilter: "blur(4px)",
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 4px 20px ${shadowColor}`
                  }}
                  layoutId={layoutId}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                  }}
                  exit={{ 
                    opacity: 0,
                  }}
                  transition={{
                    type: "tween", // 使用线性动画替代弹簧动画，消除抖动
                    ease: "easeOut",
                    duration: 0.2
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* 条件性渲染链接或普通容器 */}
            {item.link && !hasNestedLink ? (
              <Link 
                href={item.link} 
                className="block h-full w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative z-20 h-full">
                  {item.content}
                </div>
              </Link>
            ) : (
              <div className="relative z-20 h-full">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}

// 类型定义更新
type HoverCardItem = {
  title: string
  description?: string
  content: React.ReactNode
  link?: string
  hasNestedLink?: boolean
}

// 导出的主组件，结合静态和动态渲染
export const HoverCardEffect = ({
  items,
  className,
  hoveredIndex: externalHoveredIndex, 
  setHoveredIndex: externalSetHoveredIndex,
}: {
  items: HoverCardItem[]
  className?: string
  hoveredIndex?: number | null
  setHoveredIndex?: (index: number | null) => void
}) => {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // 确保组件在客户端渲染后才显示动画效果，避免水合错误
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 使用外部提供的状态或内部状态
  const hoveredIndex = externalHoveredIndex !== undefined ? externalHoveredIndex : internalHoveredIndex;
  const setHoveredIndex = externalSetHoveredIndex || setInternalHoveredIndex;

  // 关键：仅在客户端渲染动态内容，服务端使用静态渲染
  if (!isMounted) {
    return <StaticCardGrid items={items} className={className} />;
  }

  return (
    <DynamicCardGrid 
      items={items} 
      className={className} 
      hoveredIndex={hoveredIndex} 
      setHoveredIndex={setHoveredIndex} 
    />
  );
} 