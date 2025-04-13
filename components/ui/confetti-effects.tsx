"use client"

import { useEffect, useState, useCallback } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  angle: number
  tilt: number
  opacity: number
  gravity: number
  distance: number // 控制纸屑的最大飞行距离
  delay: number // 星星延迟爆发时间
}

interface ConfettiEffectProps {
  active: boolean
  duration?: number
  pieces?: number
  colors?: string[]
  originX?: number
  originY?: number
  radius?: number // 爆发半径
  onComplete?: () => void
}

export function ConfettiEffect({
  active,
  duration = 2700,
  pieces = 666, // 设置默认数量为20
  colors = [
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", 
    "#009688", "#4caf50", "#8bc34a", "#cddc39", 
    "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"
  ],
  originX,
  originY,
  radius = 80, // 默认80px的爆发半径
  onComplete
}: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  // 创建纸屑
  const createConfetti = useCallback(() => {
    const newConfetti: ConfettiPiece[] = []
    
    // 默认爆发点为屏幕中心
    const startX = originX ?? dimensions.width / 2
    const startY = originY ?? dimensions.height / 2
    
    // 星星颜色 - 包含亮色系
    const starColors = [
      ...colors,
      "#ffffff", // 纯白色
      "#f0f0f0", // 亮银色
      "#ccccff", // 银蓝色
      "#ffffcc"  // 银黄色
    ]
    
    for (let i = 0; i < pieces; i++) {
      // 随机尺寸，调整为更适中的大小
      const size = Math.random() * 8 + 4 // 4-12px，基础尺寸更适中
      
      // 改变角度计算方式，减小角度范围使星星不会飞得太高或太远
      // 角度范围在 -50 到 +50 度之间（垂直向上为0度）
      const angle = (Math.random() * 100 - 50) * (Math.PI / 180)
      const speed = Math.random() * 6 + 3 // 降低速度
      
      // 计算初始速度分量
      const speedX = Math.sin(angle) * speed // 使用sin让星星有左右偏移
      const speedY = -Math.abs(Math.cos(angle) * speed) * 1.1 // 略微降低垂直速度
      
      // 随机选择颜色
      const particleColor = starColors[Math.floor(Math.random() * starColors.length)]
      
      // 生成不同大小的星星，但整体尺寸更小
      const sizeMultiplier = Math.random() < 0.3 ? 2.0 : (Math.random() < 0.6 ? 1.5 : 1.0)
      
      newConfetti.push({
        id: i,
        x: startX,
        y: startY,
        size: size * sizeMultiplier, // 更适中的星星大小
        color: particleColor,
        speedX,
        speedY,
        angle: Math.random() * 360,
        tilt: Math.random() * 20 - 10,
        opacity: 0.9 + Math.random() * 0.1, // 高初始透明度
        gravity: 0.12 + Math.random() * 0.1, // 增加重力效果使星星更快落下
        distance: Math.random() * radius * 1.5, // 减小飞行距离
        delay: Math.random() * 500 // 0-500ms的延迟，让星星不会同时爆发
      })
    }
    
    setConfetti(newConfetti)
  }, [pieces, colors, dimensions.width, dimensions.height, originX, originY, radius])

  // 移动纸屑
  const updateConfetti = useCallback(() => {
    setConfetti(prev => prev.map(piece => {
      // 加入重力效果
      const newSpeedY = piece.speedY + piece.gravity
      const newX = piece.x + piece.speedX
      const newY = piece.y + newSpeedY
      
      // 摆动效果
      const newTilt = piece.tilt + (Math.random() * 2 - 1)
      
      // 计算已经飞行的距离
      const dx = newX - (originX ?? dimensions.width / 2)
      const dy = newY - (originY ?? dimensions.height / 2)
      const distanceTraveled = Math.sqrt(dx * dx + dy * dy)
      
      // 超过最大飞行距离或落到屏幕底部，则开始淡出
      const fadeOutStart = 
        distanceTraveled > piece.distance || 
        newY > (originY ?? dimensions.height / 2) + 100; // 只允许下落100px
      
      // 计算透明度 - 根据距离或持续时间慢慢消失
      const newOpacity = fadeOutStart 
        ? Math.max(0, piece.opacity - 0.05) // 更快的淡出速度
        : piece.opacity;
      
      return {
        ...piece,
        x: newX,
        y: newY,
        speedY: newSpeedY,
        tilt: newTilt,
        opacity: newOpacity
      }
    }).filter(piece => piece.opacity > 0))
  }, [dimensions.width, dimensions.height, originX, originY])

  // 监听窗口大小变化
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 控制纸屑效果的开始和结束
  useEffect(() => {
    if (active) {
      createConfetti()
      
      // 设置持续时间
      const timer = setTimeout(() => {
        setConfetti([])
        if (onComplete) onComplete()
      }, duration)
      
      return () => clearTimeout(timer)
    } else {
      setConfetti([])
    }
  }, [active, createConfetti, duration, onComplete])

  // 更新纸屑动画
  useEffect(() => {
    if (confetti.length === 0) return
    
    const animationFrame = requestAnimationFrame(() => {
      updateConfetti()
    })
    
    return () => cancelAnimationFrame(animationFrame)
  }, [confetti, updateConfetti])

  // 如果没有纸屑，不渲染任何内容
  if (confetti.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {confetti.map(piece => (
        // 星星粒子 - 烟花效果
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`, 
            height: `${piece.size}px`, 
            background: `radial-gradient(circle at center, ${piece.color} 0%, rgba(255, 255, 255, 0.8) 40%, transparent 70%)`, // 添加径向渐变
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', 
            transform: `rotate(${piece.angle}deg) skew(${piece.tilt}deg)`,
            opacity: piece.opacity,
            pointerEvents: 'none',
            animation: `starTwinkle ${Math.random() * 1.5 + 0.8}s infinite alternate ease-in-out ${piece.delay}ms`, // 更快的动画
            boxShadow: `0 0 ${piece.size/2}px ${piece.color}, 0 0 ${piece.size*0.8}px ${piece.color}`, // 稍微减小光晕
            filter: `blur(${piece.size/25}px) brightness(1.2)` // 轻微模糊，略微降低亮度
          }}
        />
      ))}
      
      {/* 添加星星动画 */}
      <style jsx>{`
        @keyframes starTwinkle {
          0% { opacity: 0.4; transform: scale(0.7) rotate(0deg) skew(${Math.random() * 10 - 5}deg); filter: blur(2px) brightness(0.8); }
          40% { opacity: 1; transform: scale(1.2) rotate(${Math.random() * 20}deg) skew(${Math.random() * 10 - 5}deg); filter: blur(0px) brightness(1.5); }
          60% { opacity: 0.8; transform: scale(0.9) rotate(${Math.random() * 20 + 20}deg) skew(${Math.random() * 10 - 5}deg); filter: blur(1px) brightness(1.2); }
          100% { opacity: 1; transform: scale(1.1) rotate(${Math.random() * 20 + 40}deg) skew(${Math.random() * 10 - 5}deg); filter: blur(0px) brightness(1.3); }
        }
      `}</style>
    </div>
  )
}

// 自定义Hook
export function useConfettiEffect() {
  const [isActive, setIsActive] = useState(false)
  const [config, setConfig] = useState({
    duration: 1500,    // 缩短默认持续时间
    pieces: 270,        // 设置默认粒子数量
    colors: [
      "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
      "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", 
      "#009688", "#4caf50", "#8bc34a", "#cddc39", 
      "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"
    ],
    originX: undefined,
    originY: undefined,
    radius: 80        // 缩小默认爆发半径
  })

  const triggerConfetti = useCallback((options = {}) => {
    setConfig(prev => ({ ...prev, ...options }))
    setIsActive(true)
  }, [])

  const onComplete = useCallback(() => {
    setIsActive(false)
  }, [])

  return {
    isActive,
    triggerConfetti,
    config,
    onComplete
  }
}