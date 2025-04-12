"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MouseFollower() {
  const followerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    // 标记组件已挂载，仅在客户端渲染
    setIsMounted(true)
    
    // 使用requestAnimationFrame优化性能，减少DOM更新频率
    let frame: number
    
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      
      frame = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])
  
  // 仅在客户端渲染
  if (!isMounted) return null
  
  return (
    <>
      {/* 主光晕效果 - 更小更淡 */}
      <motion.div
        className="hidden md:block fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          translateX: "-50%",
          translateY: "-50%",
          width: "12rem", // 减小尺寸
          height: "12rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0) 70%)", // 使用更淡的主题色
        }}
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.7, 0.4, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
      />
      
      {/* 小圆点跟随效果 */}
      <motion.div
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          zIndex: 50,
          pointerEvents: "none",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "rgba(79, 70, 229, 0.5)", // 更淡的主色调
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.5
        }}
      />
    </>
  )
} 