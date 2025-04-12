"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScratchCardProps {
  width: number
  height: number
  coverColor?: string
  bgColor?: string
  image?: string
  brushSize?: number
  revealPercent?: number
  onReveal?: () => void
  children: React.ReactNode
}

export function ScratchCard({
  width,
  height,
  coverColor = 'rgba(192, 192, 192, 0.95)',  // 默认使用银色（但会被渐变覆盖）
  bgColor = 'white',
  image,
  brushSize = 20,
  revealPercent = 90,
  onReveal,
  children
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hasStartedScratching, setHasStartedScratching] = useState(false)
  const [isFullyRevealed, setIsFullyRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [revealAnimationDone, setRevealAnimationDone] = useState(false)
  
  // 保存上一个鼠标或触摸位置
  const lastPosition = useRef<{ x: number, y: number } | null>(null)
  
  // 保存刮擦的像素总数和刮过的像素数
  const pixelInfo = useRef({
    total: 0,
    scratched: 0
  })

  // 用于跟踪鼠标/触摸事件
  const isMouseDown = useRef(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // 检查是否已经刮开了足够面积
  const checkFullyRevealed = () => {
    if (isFullyRevealed) return;
    
    const scratchPercent = (pixelInfo.current.scratched / pixelInfo.current.total) * 100;
    
    // 添加额外的安全检查 - 确保已刮擦至少一定数量的像素点
    const minimumScratchCount = (width * height * 0.85); // 至少刮开85%的区域
    
    // 如果刮开面积超过设定的阈值且实际刮开的像素数量满足最低要求，认为已完全揭示
    if (scratchPercent > revealPercent && pixelInfo.current.scratched > minimumScratchCount) {
      setIsFullyRevealed(true);
      setIsAnimating(true);
      // 调用回调函数
      onReveal?.();
      
      // 如果有canvas，清除剩余的覆盖层
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  // 当组件挂载或宽高改变时，初始化canvas
  useEffect(() => {
    if (!isMounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    
    // 设置canvas尺寸（确保与显示尺寸匹配）
    canvas.width = width
    canvas.height = height
    
    // 保存总像素数
    pixelInfo.current.total = width * height
    pixelInfo.current.scratched = 0
    
    // 重置画布并填充遮罩层
    ctx.clearRect(0, 0, width, height)
    
    // 创建银色
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(225, 228, 235, 0.98)');  
    gradient.addColorStop(0.5, 'rgba(225, 228, 235, 0.98)'); //全部亮银色
    gradient.addColorStop(1, 'rgba(225, 228, 235, 0.98)');  
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 添加鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      handleScratch(e);
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      lastPosition.current = null;
      
      // 检查是否已经刮开了足够的面积
      checkFullyRevealed();
    };

    // 全局事件监听
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleScratch, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleScratch);
      window.removeEventListener('touchend', handleMouseUp);
    };
    
  }, [width, height, coverColor, isMounted, revealPercent])

  // 处理动画完成
  const handleAnimationComplete = () => {
    setRevealAnimationDone(true);
    setIsAnimating(false);
  };

  // 处理鼠标/触摸移动
  const handleScratch = (e: MouseEvent | TouchEvent) => {
    if (!isMouseDown.current && e.type !== 'touchmove') return
    if (isFullyRevealed) return
    
    // 标记已经开始刮擦，隐藏提示文字
    if (!hasStartedScratching) {
      setHasStartedScratching(true);
    }
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 获取canvas边界
    const rect = canvas.getBoundingClientRect()
    
    // 获取当前位置
    let currentX, currentY
    
    if (e.type.startsWith('touch')) {
      // 触摸事件
      e.preventDefault() // 阻止默认行为
      const touchEvent = e as TouchEvent
      const touch = touchEvent.touches[0]
      currentX = touch.clientX - rect.left
      currentY = touch.clientY - rect.top
    } else {
      // 鼠标事件
      const mouseEvent = e as MouseEvent
      currentX = mouseEvent.clientX - rect.left
      currentY = mouseEvent.clientY - rect.top
    }
    
    // 确保坐标在画布范围内
    currentX = Math.max(0, Math.min(currentX, canvas.width))
    currentY = Math.max(0, Math.min(currentY, canvas.height))
    
    // 如果有上一个位置，则绘制线段
    if (lastPosition.current) {
      ctx.globalCompositeOperation = 'destination-out' // 设置为擦除模式
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()
      
      // 计算本次擦除的像素(粗略估计)
      const distance = Math.sqrt(
        Math.pow(currentX - lastPosition.current.x, 2) +
        Math.pow(currentY - lastPosition.current.y, 2)
      )
      
      // 使用更保守的计算方法来估计刮擦的像素数量 
      // 原来是直接用线段长度乘以笔刷尺寸，现在使用系数0.7来模拟曲线覆盖
      const scratchedPixels = distance * brushSize * 0.7
      pixelInfo.current.scratched += scratchedPixels
      
      // 检查是否需要显示所有内容 - 只有在接近目标阈值时才检查
      if (pixelInfo.current.scratched / pixelInfo.current.total > (revealPercent / 100) * 0.9) {
        checkFullyRevealed();
      }
    } else {
      // 即使没有上一个位置，也至少刮擦一个点
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(currentX, currentY, brushSize / 2, 0, Math.PI * 2)
      ctx.fill()
      
      // 估计刮擦的像素
      const scratchedPixels = Math.PI * Math.pow(brushSize / 2, 2)
      pixelInfo.current.scratched += scratchedPixels
    }
    
    // 更新上一个位置
    lastPosition.current = { x: currentX, y: currentY }
  }

  // 开始刮擦
  const handleScratchStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isFullyRevealed) return
    
    e.preventDefault()
    e.stopPropagation()
    
    isMouseDown.current = true
    
    // 标记已经开始刮擦，隐藏提示文字
    setHasStartedScratching(true);
    
    // 获取初始位置
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    let startX, startY
    
    if ('touches' in e) {
      // 触摸事件
      const touch = e.touches[0]
      startX = touch.clientX - rect.left
      startY = touch.clientY - rect.top
    } else {
      // 鼠标事件
      startX = e.clientX - rect.left
      startY = e.clientY - rect.top
    }
    
    // 确保坐标在画布范围内
    startX = Math.max(0, Math.min(startX, canvas.width))
    startY = Math.max(0, Math.min(startY, canvas.height))
    
    // 开始刮擦的位置
    lastPosition.current = { x: startX, y: startY }
    
    // 马上开始刮擦第一个点
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(startX, startY, brushSize / 2, 0, Math.PI * 2)
      ctx.fill()
      
      // 估计刮擦的像素
      const scratchedPixels = Math.PI * Math.pow(brushSize / 2, 2)
      pixelInfo.current.scratched += scratchedPixels
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative select-none"
      style={{ width, height }}
    >
      {/* 底层内容区域 */}
      <AnimatePresence>
        {isAnimating ? (
          <motion.div
            key="animating"
            initial={{ scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
            animate={{ 
              scale: [1, 1.03], 
              boxShadow: "0px 0px 0px rgba(0,0,0,0)"
            }}
            exit={{ scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onAnimationComplete={() => {
              setTimeout(() => {
                handleAnimationComplete();
              }, 200); // 减少延迟时间，更快地回到自然状态
            }}
            className="absolute inset-0 overflow-hidden"
            style={{ 
              backgroundColor: 'transparent',
              backgroundImage: image ? `url(${image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width,
              height,
            }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            className="absolute inset-0 overflow-hidden"
            style={{ 
              backgroundColor: 'transparent',
              backgroundImage: image ? `url(${image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width,
              height,
              borderRadius: 0 // 移除所有圆角边框
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 刮擦层 */}
      {!isFullyRevealed && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 cursor-pointer z-10 rounded-lg"
          onMouseDown={handleScratchStart}
          onTouchStart={handleScratchStart}
          style={{
            touchAction: 'none', // 防止在移动设备上滚动
            mixBlendMode: 'normal',
            pointerEvents: 'auto'
          }}
        />
      )}
      
      {/* 刮一刮提示 - 仅在未开始刮擦时显示 */}
      {!hasStartedScratching && !isFullyRevealed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <span className="text-primary text-sm font-semibold drop-shadow-lg">
            刮一刮，查看我的兴趣爱好
          </span>
        </div>
      )}
    </div>
  )
} 