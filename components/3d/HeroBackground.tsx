"use client"

import { useEffect, useState, useRef } from 'react'

// 纯CSS实现的背景粒子效果（星星样式）
export default function HeroBackground() {
  const [particles, setParticles] = useState<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    speed: number;
    delay: number;
  }[]>([])
  
  // 添加客户端渲染标记
  const [isMounted, setIsMounted] = useState(false)
  
  // 使用useRef存储animationDelay，避免每次渲染时重新生成随机值
  const delayRef = useRef<{[key: number]: number}>({})
  
  useEffect(() => {
    // 标记组件已在客户端挂载
    setIsMounted(true)
    
    // 创建粒子数据
    const particlesCount = 7
    const newParticles = []
    
    for (let i = 0; i < particlesCount; i++) {
      delayRef.current[i] = Math.random() * 5
      
      newParticles.push({
        id: i,
        x: Math.random() * 100, // 水平位置百分比
        y: Math.random() * 100, // 垂直位置百分比
        size: Math.random() * 7 + 4, // 4-11px大小
        speed: Math.random() * 0.12 + 0.05, // 保持适当的移动速度
        delay: delayRef.current[i], // 随机动画延迟
      })
    }
    
    setParticles(newParticles)
    
    // 动画效果
    const moveParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y - particle.speed, // 向上移动
          // 如果粒子移出屏幕顶部，重新从底部出现
          ...(particle.y < 0 ? { y: 100 + particle.y } : {})
        }))
      )
    }
    
    // 每100ms移动一次粒子
    const interval = setInterval(moveParticles, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  // 确保在客户端和服务器端返回相同的结构，避免水合错误
  // 初始渲染（包括服务器渲染）只返回空容器
  if (!isMounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
      {/* 只在客户端渲染星星粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 2.5}px`,
            height: `${particle.size * 2.5}px`,
            opacity: 0.9, // 提高不透明度到0.9
            transition: 'top 0.1s linear',
            zIndex: 10
          }}
        >
          {/* 星星形状 */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(99, 102, 241, 0.8) 70%)', // 增强渐变效果
              boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.95), 0 0 20px rgba(99, 102, 241, 0.8)', // 增强光晕效果
              animation: `twinkle 4s infinite alternate ease-in-out`,
              animationDelay: `${particle.delay}s`
            }}
          />
        </div>
      ))}
      
      {/* 渐变背景 */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.12) 0%, rgba(255, 255, 255, 0) 70%)', // 增强背景渐变
          zIndex: 1
        }}
      />

      {/* 添加闪烁动画 */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; }
          100% { opacity: 0.7; transform: scale(1.4) rotate(5deg); }
        }
      `}</style>
    </div>
  )
} 