"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  title?: string
  href?: string
  className?: string
  containerClassName?: string
}) => {
  const [transform, setTransform] = useState("translate(-50%,-50%) rotateX(0deg)")

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(20deg) scale(0.95)")
  }
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)")
  }

  return (
    <Link
      className={cn("relative group/pin z-50 cursor-pointer", containerClassName)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      href={href || "/"}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "perspective(800px) rotateX(30deg) rotateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
            transformOrigin: "bottom center",
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </Link>
  )
}

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string
  href?: string
}) => {
  return (
    <motion.div className="pointer-events-none w-96 h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <div
            className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10"
          >
            <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5">{title}</span>

            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"></span>
          </div>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "perspective(800px) rotateX(30deg) rotateZ(0deg)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                delay: 4,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40 blur-[2px]" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40" />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-cyan-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-cyan-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
        </>
      </div>
    </motion.div>
  )
}

// 特殊奖项3D效果展示组件
export const AwardPin = ({ award }: { award: { title: string; url?: string; image?: string } }) => {
  return (
    <PinContainer title={award.title} href={award.url}>
      <div className="flex flex-col items-center justify-center w-[300px] h-[300px] p-4 bg-black">
        <div className="relative w-full h-3/4 overflow-hidden rounded-lg mb-4">
          {award.image ? (
            <img 
              src={award.image} 
              alt={award.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-white">山东大学</span>
            </div>
          )}
        </div>
        <h3 className="text-white text-xl text-center font-bold">{award.title}</h3>
        <div className="mt-2 bg-gradient-to-r from-blue-500 to-primary h-1 w-24"></div>
      </div>
    </PinContainer>
  )
}

// 为现有卡片添加3D效果的包装组件
export const CardPinEffect = ({
  children,
  title,
  href,
  isActive,
  className,
  color = "emerald",
}: {
  children: React.ReactNode
  title?: string
  href?: string
  isActive: boolean
  className?: string
  color?: "emerald" | "blue" | "yellow" | "red" | "purple" | "teal" | "orange" | "violet"
}) => {
  // 根据color参数确定实际使用的颜色
  const colorMap = {
    emerald: {
      border: "border-emerald-300 dark:border-emerald-700",
      text: "text-emerald-600 dark:text-emerald-400",
      lineGradient: "bg-gradient-to-b from-emerald-400 to-transparent",
      dot: "bg-emerald-400",
      cardBorder: "rgba(16, 185, 129, 0.3)",
      shadow: "rgba(16, 185, 129, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
    },
    blue: {
      border: "border-blue-300 dark:border-blue-700",
      text: "text-blue-600 dark:text-blue-400",
      lineGradient: "bg-gradient-to-b from-blue-400 to-transparent",
      dot: "bg-blue-400",
      cardBorder: "rgba(59, 130, 246, 0.3)",
      shadow: "rgba(59, 130, 246, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
    },
    yellow: {
      border: "border-yellow-300 dark:border-yellow-700",
      text: "text-yellow-600 dark:text-yellow-400",
      lineGradient: "bg-gradient-to-b from-yellow-400 to-transparent",
      dot: "bg-yellow-400",
      cardBorder: "rgba(251, 191, 36, 0.3)",
      shadow: "rgba(251, 191, 36, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
    },
    red: {
      border: "border-red-300 dark:border-red-700",
      text: "text-red-600 dark:text-red-400",
      lineGradient: "bg-gradient-to-b from-red-400 to-transparent",
      dot: "bg-red-400",
      cardBorder: "rgba(248, 113, 113, 0.3)",
      shadow: "rgba(248, 113, 113, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(248, 113, 113, 0.15) 0%, transparent 70%)",
    },
    purple: {
      border: "border-purple-300 dark:border-purple-700",
      text: "text-purple-600 dark:text-purple-400",
      lineGradient: "bg-gradient-to-b from-purple-400 to-transparent",
      dot: "bg-purple-400",
      cardBorder: "rgba(167, 139, 250, 0.3)",
      shadow: "rgba(167, 139, 250, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(167, 139, 250, 0.15) 0%, transparent 70%)",
    },
    teal: {
      border: "border-teal-300 dark:border-teal-700",
      text: "text-teal-600 dark:text-teal-400",
      lineGradient: "bg-gradient-to-b from-teal-400 to-transparent",
      dot: "bg-teal-400",
      cardBorder: "rgba(45, 212, 191, 0.3)",
      shadow: "rgba(45, 212, 191, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(45, 212, 191, 0.15) 0%, transparent 70%)",
    },
    orange: {
      border: "border-orange-300 dark:border-orange-700",
      text: "text-orange-600 dark:text-orange-400",
      lineGradient: "bg-gradient-to-b from-orange-400 to-transparent",
      dot: "bg-orange-400",
      cardBorder: "rgba(251, 146, 60, 0.3)",
      shadow: "rgba(251, 146, 60, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(251, 146, 60, 0.15) 0%, transparent 70%)",
    },
    violet: {
      border: "border-violet-300 dark:border-violet-700",
      text: "text-violet-600 dark:text-violet-400",
      lineGradient: "bg-gradient-to-b from-violet-400 to-transparent",
      dot: "bg-violet-400",
      cardBorder: "rgba(139, 92, 246, 0.3)",
      shadow: "rgba(139, 92, 246, 0.15)",
      radialGradient: "radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
    },
  };

  const currentColor = colorMap[color];

  return (
    <div className={cn("relative group block w-full h-full", className)}>
      {/* 顶部悬浮标签 - 只在激活时显示 */}
      {isActive && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <div className={`bg-transparent ${currentColor.text} text-xs font-bold px-4 py-1.5 rounded-full border ${currentColor.border} backdrop-blur-sm shadow-sm`}>
          https://control.sdu.edu.cn/info/1033/6944.htm
          </div>
        </div>
      )}
      
      {/* 顶部连接线和圆点 - 只在激活时显示，连接到卡片中心 */}
      {isActive && (
        <>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-20 w-[1px] ${currentColor.lineGradient} z-10`}></div>
          <div className={`absolute top-20 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${currentColor.dot} z-10 animate-pulse`}></div>
        </>
      )}
      
      {/* 简化的3D卡片容器 */}
      <Link 
        href={href || "#"} 
        className="block w-full h-full"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div 
          className="w-full h-full transition-all duration-300 rounded-xl overflow-hidden"
          style={{
            transform: isActive ? "perspective(800px) rotateX(30deg)" : "none",
            transformOrigin: "bottom center",
            boxShadow: isActive ? `0 25px 40px -15px ${currentColor.shadow}` : "none",
            border: isActive ? `1px solid ${currentColor.cardBorder}` : "none"
          }}
        >
          {children}
        </div>
      </Link>
      
      {/* 底部阴影 - 只在激活时显示 */}
      {isActive && (
        <div 
          className="absolute w-[95%] h-10 left-1/2 -translate-x-1/2 bottom-[-15px] -z-10"
          style={{
            backgroundImage: currentColor.radialGradient,
            filter: "blur(8px)",
            borderRadius: "50%"
          }}
        ></div>
      )}
    </div>
  )
}