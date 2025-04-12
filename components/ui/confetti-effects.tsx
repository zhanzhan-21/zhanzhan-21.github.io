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
  pieces = 27, // 设置默认数量为20
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
    
    for (let i = 0; i < pieces; i++) {
      const size = Math.random() * 8 + 3 // 3-11px，减小颗粒的尺寸
      
      // 改变角度计算方式，使所有纸屑方向都向上，但有左右偏移
      // 角度范围在 -60 到 +60 度之间（垂直向上为0度）
      const angle = (Math.random() * 120 - 60) * (Math.PI / 180)
      const speed = Math.random() * 7 + 3 // 速度
      
      // 计算初始速度分量，所有纸屑都会向上发射，但有左右偏移
      const speedX = Math.sin(angle) * speed // 使用sin让纸屑有左右偏移
      const speedY = -Math.abs(Math.cos(angle) * speed) * 1.2 // 使用负号和绝对值确保所有纸屑初始都向上运动
      
      newConfetti.push({
        id: i,
        x: startX,
        y: startY,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX,
        speedY,
        angle: Math.random() * 360,
        tilt: Math.random() * 20 - 10,
        opacity: 1,
        gravity: 0.15 + Math.random() * 0.1, // 减小重力加速度
        distance: Math.random() * radius // 随机最大飞行距离，不超过指定半径
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
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: '2px',
            transform: `rotate(${piece.angle}deg) skew(${piece.tilt}deg)`,
            opacity: piece.opacity,
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  )
}

// 自定义Hook
export function useConfettiEffect() {
  const [isActive, setIsActive] = useState(false)
  const [config, setConfig] = useState({
    duration: 1500,    // 缩短默认持续时间
    pieces: 20,        // 设置默认粒子数量
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