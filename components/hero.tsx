"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Globe, Github, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroBackground from "@/components/3d/HeroBackground"
import { ConfettiEffect, useConfettiEffect } from "@/components/ui/confetti-effects"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const [isClient, setIsClient] = useState(false)
  const fullText = "Java工程师 | 后端开发工程师"
  
  // 简单的3D卡片翻转状态
  const [isFlipped, setIsFlipped] = useState(false)
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  
  // 多张照片的索引
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const photos = [
    "/images/profile.jpeg",
    "/images/profile2.jpeg", // 确保有这些图片或替换为实际路径
    "/images/profile3.jpeg"
  ]

  // 按钮引用
  const contactBtnRef = useRef<HTMLButtonElement>(null);
  const projectsBtnRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  
  // 闪亮按钮状态
  const [isShining, setIsShining] = useState(false);
  
  // 使用自定义纸屑效果
  const { isActive, triggerConfetti, config, onComplete } = useConfettiEffect();

  useEffect(() => {
    // 标记为客户端渲染
    setIsClient(true)
    
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)
    
    // 自动切换照片
    if (isClient) {
      const photoInterval = setInterval(() => {
        setActivePhotoIndex(prev => (prev + 1) % photos.length)
      }, 5000)
      
      return () => {
        clearInterval(typingInterval)
        clearInterval(photoInterval)
      }
    }

    return () => clearInterval(typingInterval)
  }, [isClient])
  
  // 处理鼠标移动的3D效果
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isClient) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    // 计算旋转角度 - 限制在小范围内
    const rotateYValue = (mouseX / (rect.width / 2)) * 5 // 最大旋转5度
    const rotateXValue = -(mouseY / (rect.height / 2)) * 5 // 最大旋转5度
    
    setRotateY(rotateYValue)
    setRotateX(rotateXValue)
  }
  
  const handleMouseLeave = () => {
    // 重置旋转
    setRotateY(0)
    setRotateX(0)
  }
  
  // 处理"展春燕"鼠标悬停事件
  const handleNameHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    // 触发闪亮效果
    setIsShining(true);
    
    // 触发纸屑效果，从鼠标悬停位置爆发
    triggerConfetti({
      pieces: 77,          // 增加星星数量，提供更丰富的视觉效果
      duration: 2100,      // 缩短持续时间为7.7秒
      originX: e.clientX,
      originY: e.clientY,
      radius: 130           // 增加爆发半径，让效果更广泛
    });
  };
  
  // 处理"展春燕"鼠标离开事件
  const handleNameLeave = () => {
    // 重置闪亮状态
    setIsShining(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4 relative">
      {/* 纸屑效果组件 */}
      <ConfettiEffect 
        active={isActive}
        duration={config.duration}
        pieces={config.pieces}
        colors={config.colors}
        originX={config.originX}
        originY={config.originY}
        onComplete={onComplete}
      />
      
      {/* 星星背景 - 设置高z-index确保可见 */}
      <div className="absolute inset-0 overflow-hidden z-[5]">
        <HeroBackground />
      </div>
      
      {/* 半透明覆盖层 - 降低不透明度使星星可见 */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-20 z-[10]"></div>
      
      {/* 内容区域 - 最高z-index确保在最上层 */}
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-[20]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white flex items-baseline">
            <span>你好，我是</span>
            <span 
              ref={nameRef}
              className={`text-primary cursor-pointer hover:scale-110 transition-transform inline-block shiny-button ${isShining ? 'animate' : ''} ml-2`}
              onMouseEnter={handleNameHover}
              onMouseLeave={handleNameLeave}
            >展春燕</span>
          </h1>
          
          {/* 客户端渲染打字效果 */}
          <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 h-8">
            {isClient ? (
              <>
                {typedText}
                <span className="animate-pulse">|</span>
              </>
            ) : (
              fullText
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
            专注于构建高性能、可扩展的企业级应用，热衷于技术创新与解决复杂问题。
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>山东德州</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>2001.12.01</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>17852327512</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>17852327512@163.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a href="https://zhanzhan-21.github.io" className="hover:text-primary transition-colors">
                zhanzhan-21.github.io
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <a href="https://github.com/zhanzhan-21" className="hover:text-primary transition-colors">
                github.com/zhanzhan-21
              </a>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              ref={contactBtnRef}
              asChild
            >
              <a href="#contact" onClick={(e) => {
                e.preventDefault();
                
                // 提取目标ID
                const targetId = 'contact';
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  // 获取当前滚动位置
                  const currentScrollPosition = window.scrollY;
                  
                  // 计算目标元素的绝对位置
                  const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
                  
                  // 使用一致的偏移量
                  const offset = 80;
                  
                  // 先更新URL，然后再滚动
                  window.history.pushState(null, '', '#contact');
                  
                  // 使用setTimeout确保DOM更新后再滚动
                  setTimeout(() => {
                    window.scrollTo({
                      top: targetPosition - offset,
                      behavior: 'smooth'
                    });
                  }, 10);
                }
              }}>联系我</a>
            </Button>
            <Button 
              ref={projectsBtnRef}
              variant="outline" 
              asChild
            >
              <a href="#projects" onClick={(e) => {
                e.preventDefault();
                
                // 提取目标ID
                const targetId = 'projects';
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  // 获取当前滚动位置
                  const currentScrollPosition = window.scrollY;
                  
                  // 计算目标元素的绝对位置
                  const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
                  
                  // 使用一致的偏移量
                  const offset = 80;
                  
                  // 先更新URL，然后再滚动
                  window.history.pushState(null, '', '#projects');
                  
                  // 使用setTimeout确保DOM更新后再滚动
                  setTimeout(() => {
                    window.scrollTo({
                      top: targetPosition - offset,
                      behavior: 'smooth'
                    });
                  }, 10);
                }
              }}>查看项目</a>
            </Button>
          </div>
        </motion.div>

        {/* 圆形3D照片展示区域 - 修改结构避免白边 */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-80 h-80 flex justify-center items-center perspective-1000">
            {/* 背景装饰圆 */}
            <div className="absolute w-full h-full rounded-full bg-primary/10 animate-pulse"></div>
            <div className="absolute w-64 h-64 rounded-full bg-primary/20 animate-pulse animation-delay-1000"></div>
            
            {/* 3D圆形头像 - 响应鼠标移动产生3D效果 */}
            <div 
              className="w-72 h-72 preserve-3d transition-transform duration-300 cursor-pointer z-10 rounded-full"
              style={{ 
                transform: isClient ? `rotateY(${rotateY}deg) rotateX(${rotateX}deg)` : 'none'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* 正面 - 主要照片 */}
              <div 
                className={`absolute inset-0 backface-hidden rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl transition-opacity duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(79, 70, 229, 1) 100%)'
                }}
              >
                <img 
                  src={isClient ? photos[activePhotoIndex] : photos[0]} 
                  alt="展春燕" 
                  className="w-full h-full object-cover"
                />
                
                {/* 照片指示器 */}
                {isClient && (
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {photos.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${index === activePhotoIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* 背面 - 背景信息 */}
              <div 
                className={`absolute inset-0 backface-hidden rounded-full p-6 flex flex-col justify-center items-center transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 1) 100%)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}
              >
                <h3 className="text-xl font-bold text-center mb-4 text-white">关于我</h3>
                <p className="text-white text-center text-sm">
                  毕业于山东大学，拥有2年Java开发经验，
                  专注于后端系统架构设计和微服务开发。
                </p>
                <div className="mt-6 text-center">
                  <span className="text-xs text-white/80 italic">点击返回查看照片</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D效果所需的样式 */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
} 