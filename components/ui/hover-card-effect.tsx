"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

// 定义一个颜色数组，包含不同的颜色
const backgroundColors = [
  "linear-gradient(135deg, rgba(167, 243, 208, 0.08) 0%, rgba(110, 231, 183, 0.12) 100%)", // 绿色
  "linear-gradient(135deg, rgba(191, 219, 254, 0.08) 0%, rgba(96, 165, 250, 0.12) 100%)", // 蓝色
  "linear-gradient(135deg, rgba(253, 230, 138, 0.08) 0%, rgba(251, 191, 36, 0.12) 100%)", // 黄色
  "linear-gradient(135deg, rgba(254, 202, 202, 0.08) 0%, rgba(248, 113, 113, 0.12) 100%)", // 红色
  "linear-gradient(135deg, rgba(221, 214, 254, 0.08) 0%, rgba(167, 139, 250, 0.12) 100%)", // 紫色
  "linear-gradient(135deg, rgba(209, 250, 229, 0.08) 0%, rgba(52, 211, 153, 0.12) 100%)", // 青绿色
  "linear-gradient(135deg, rgba(254, 215, 170, 0.08) 0%, rgba(251, 146, 60, 0.12) 100%)", // 橙色
  "linear-gradient(135deg, rgba(196, 181, 253, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%)", // 淡紫色
]

// 定义边框颜色数组
const borderColors = [
  "rgba(110, 231, 183, 0.15)", // 绿色
  "rgba(96, 165, 250, 0.15)", // 蓝色
  "rgba(251, 191, 36, 0.15)", // 黄色
  "rgba(248, 113, 113, 0.15)", // 红色
  "rgba(167, 139, 250, 0.15)", // 紫色
  "rgba(52, 211, 153, 0.15)", // 青绿色
  "rgba(251, 146, 60, 0.15)", // 橙色
  "rgba(139, 92, 246, 0.15)", // 淡紫色
]

// 定义阴影颜色数组
const shadowColors = [
  "rgba(110, 231, 183, 0.08)", // 绿色
  "rgba(96, 165, 250, 0.08)", // 蓝色
  "rgba(251, 191, 36, 0.08)", // 黄色
  "rgba(248, 113, 113, 0.08)", // 红色
  "rgba(167, 139, 250, 0.08)", // 紫色
  "rgba(52, 211, 153, 0.08)", // 青绿色
  "rgba(251, 146, 60, 0.08)", // 橙色
  "rgba(139, 92, 246, 0.08)", // 淡紫色
]

export const HoverCardEffect = ({
  items,
  className,
  hoveredIndex: externalHoveredIndex, 
  setHoveredIndex: externalSetHoveredIndex,
}: {
  items: {
    title: string
    description?: string
    content: React.ReactNode
    link?: string
  }[]
  className?: string
  hoveredIndex?: number | null
  setHoveredIndex?: (index: number | null) => void
}) => {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null)
  
  // 使用外部提供的状态或内部状态
  const hoveredIndex = externalHoveredIndex !== undefined ? externalHoveredIndex : internalHoveredIndex
  const setHoveredIndex = externalSetHoveredIndex || setInternalHoveredIndex

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
        
        return (
          <div
            key={idx}
            className="relative group block h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {shouldShowEffect && (
                <motion.span
                  className="absolute inset-0 h-full w-full block rounded-xl"
                  style={{
                    background: bgColor,
                    backdropFilter: "blur(4px)",
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 4px 20px ${shadowColor}`
                  }}
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.25 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.25, delay: 0.1 },
                  }}
                />
              )}
            </AnimatePresence>
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
        );
      })}
    </div>
  )
} 