"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Globe, Github, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroBackground from "@/components/3d/HeroBackground"
import { ConfettiEffect, useConfettiEffect } from "@/components/ui/confetti-effects"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)  // 新增：检测是否为竖屏
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
  
  // 使用自定义纸屑效果
  const { isActive, triggerConfetti, config, onComplete } = useConfettiEffect();

  // 检测是否为平板或移动设备，以及屏幕方向
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 检测设备类型和屏幕方向
      const checkDeviceTypeAndOrientation = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 添加平板设备的判断 (768px-1024px)
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
        
        // 检测是否为竖屏模式（高度大于宽度）
        setIsPortrait(height > width);
      };
      
      // 初始检测
      checkDeviceTypeAndOrientation();
      
      // 监听窗口大小变化和屏幕方向变化
      window.addEventListener('resize', checkDeviceTypeAndOrientation);
      window.addEventListener('orientationchange', checkDeviceTypeAndOrientation);
      
      return () => {
        window.removeEventListener('resize', checkDeviceTypeAndOrientation);
        window.removeEventListener('orientationchange', checkDeviceTypeAndOrientation);
      };
    }
  }, []);

  // 打字效果和照片切换的 useEffect
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
    const photoInterval = setInterval(() => {
      setActivePhotoIndex(prev => (prev + 1) % photos.length)
    }, 5000)
    
    // 获取名字元素，在非移动设备上重置并重新应用动画以同步开始
    if (nameRef.current && !isMobile) {
      const nameElement = nameRef.current;
      // 移除再添加auto-shine类来重置动画
      nameElement.classList.remove('auto-shine');
      // 使用setTimeout确保DOM有时间处理类移除
      setTimeout(() => {
        nameElement.classList.add('auto-shine');
      }, 10);
    }
    
    return () => {
      clearInterval(typingInterval)
      clearInterval(photoInterval)
    }
  }, [isMobile]) // 添加isMobile作为依赖
  
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
  
  // 处理名字单击事件（特别针对移动设备）
  const handleNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (isMobile) {
      // 移动设备上触发一次闪光和纸屑效果
      if (nameRef.current) {
        const nameElement = nameRef.current;
        nameElement.classList.add('animate'); // 添加手动闪光类
        
        // 2秒后移除动画类
        setTimeout(() => {
          nameElement.classList.remove('animate');
        }, 2000);
      }
      
      // 触发纸屑效果
      triggerConfetti({
        pieces: 21,
        duration: 2100,
        originX: e.clientX,
        originY: e.clientY,
        radius: 130
      });
    }
  }, [isMobile, triggerConfetti]);
  
  // 用 useCallback 包装处理事件函数，确保它们的引用稳定
  const handleNameHover = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    // 只在非移动设备上触发纸屑效果
    if (!isMobile) {
      triggerConfetti({
        pieces: 77,
        duration: 2100,
        originX: e.clientX,
        originY: e.clientY,
        radius: 130
      });
    }
  }, [triggerConfetti, isMobile]);
  
  // 用 useCallback 包装处理事件函数
  const handleNameLeave = useCallback(() => {
    // 自动闪光效果由CSS控制，这里不再需要重置状态
  }, []);

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
      
      {/* 星星背景 - 设置高z-index确保可见，在移动设备上隐藏 */}
      <div className={`absolute inset-0 overflow-hidden z-[5] ${isMobile ? 'opacity-30' : ''}`}>
        <HeroBackground />
      </div>
      
      {/* 半透明覆盖层 - 降低不透明度使星星可见 */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-20 z-[10]"></div>
      
      {/* 内容区域 - 最高z-index确保在最上层，针对iPad竖屏做特殊处理 */}
      <div className={`container mx-auto ${isTablet && isPortrait ? 'flex flex-col items-start px-8' : 'grid md:grid-cols-2'} gap-8 items-center relative z-[20]`}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`flex flex-col ${isTablet && isPortrait ? 'items-start text-left w-full max-w-md' : 'space-y-4 md:space-y-6'}`}
        >
          <h1 className="flex flex-row flex-wrap items-baseline gap-2 text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
  <span className="text-gray-900 dark:text-white">你好，我是</span>
  <span
    ref={nameRef}
    className={`text-primary cursor-pointer hover:scale-110 transition-transform shiny-button ${!isMobile ? 'auto-shine' : ''}`}
    onMouseEnter={handleNameHover}
    onMouseLeave={handleNameLeave}
    onClick={handleNameClick}
  >
    展春燕
  </span>
</h1>



          
          {/* 客户端渲染打字效果 */}
          <div className={`${isTablet && isPortrait ? 'text-lg mt-3' : `text-xl ${isTablet ? 'text-xl' : 'md:text-2xl'} mt-2`} text-gray-600 dark:text-gray-300 h-8`}>
            {isClient ? (
              <>
                {typedText}
                <span className="animate-pulse">|</span>
              </>
            ) : (
              fullText
            )}
          </div>

          <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mb-6 md:mb-8 ${isTablet && isPortrait ? 'text-left pl-0 pr-4 text-sm leading-relaxed' : isTablet ? 'text-sm leading-relaxed' : ''}`}>
            专注于构建高性能、可扩展的企业级应用，热衷于技术创新与解决复杂问题。
          </p>
          
          {/* 联系信息 - 针对iPad竖屏模式做特殊排列，但保持左对齐 */}
          <div className={`${isTablet && isPortrait ? 'grid grid-cols-2 gap-x-6 gap-y-4 justify-items-start' : 'flex flex-wrap gap-3 md:gap-4'} text-sm text-gray-600 dark:text-gray-300 ${isTablet ? 'text-xs' : ''}`}>
            <div className="flex items-center gap-2">
              <MapPin className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <span>山东德州</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <span>2001.12.01</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <span>17852327512</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <span>17852327512@163.com</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Globe className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <a href="https://zhanzhan-21.github.io" className="hover:text-primary transition-colors">
                zhanzhan-21.github.io
              </a>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Github className={`${isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              <a href="https://github.com/zhanzhan-21" className="hover:text-primary transition-colors">
                github.com/zhanzhan-21
              </a>
            </div>
          </div>

          <div className={`flex flex-wrap gap-3 pt-6 md:pt-8 ${isTablet && isPortrait ? 'justify-start' : ''}`}>
            <Button 
              ref={projectsBtnRef}
              variant="outline" 
              className={`${isTablet && isPortrait ? 'px-8' : 'px-8'} rounded-xl border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white font-medium transition-all duration-300`}
            >
              <a href="#projects" onClick={(e) => {
                e.preventDefault();
                const targetId = 'projects';
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  const currentScrollPosition = window.scrollY;
                  const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
                  const offset = 80;
                  window.history.pushState(null, '', '#projects');
                  setTimeout(() => {
                    window.scrollTo({
                      top: targetPosition - offset,
                      behavior: 'smooth'
                    });
                  }, 10);
                }
              }}>
                <span className="flex items-center gap-2">
                  查看项目
                </span>
              </a>
            </Button>
            <Button 
              variant="outline"
              className={`${isTablet && isPortrait ? 'px-8' : 'px-8'} rounded-xl border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white font-medium transition-all duration-300`}
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = '展春燕的简历.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <span className="flex items-center gap-2">
                下载简历
              </span>
            </Button>
            <Button 
              ref={contactBtnRef}
              variant="outline"
              className={`${isTablet && isPortrait ? 'px-8' : 'px-8'} rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium transition-all duration-300`}
            >
              <a href="#contact" onClick={(e) => {
                e.preventDefault();
                const targetId = 'contact';
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  const currentScrollPosition = window.scrollY;
                  const targetPosition = targetElement.getBoundingClientRect().top + currentScrollPosition;
                  const offset = 80;
                  window.history.pushState(null, '', '#contact');
                  setTimeout(() => {
                    window.scrollTo({
                      top: targetPosition - offset,
                      behavior: 'smooth'
                    });
                  }, 10);
                }
              }}>
                <span className="flex items-center gap-2">
                  联系我
                </span>
              </a>
            </Button>
          </div>
        </motion.div>

        {/* 圆形3D照片展示区域 - iPad竖屏模式下调整位置 */}
        <div className={`${isTablet && isPortrait ? 'flex self-center' : 'hidden md:flex'} justify-center items-center ${isTablet && isPortrait ? 'mt-8' : ''}`}>
          <div className={`relative ${isTablet && isPortrait ? 'w-60 h-60' : isTablet ? 'w-72 h-72' : 'w-80 h-80'} flex justify-center items-center perspective-1000`}>
            {/* 背景装饰圆 */}
            <div className="absolute w-full h-full rounded-full bg-primary/10 animate-pulse"></div>
            <div className={`absolute ${isTablet && isPortrait ? 'w-52 h-52' : 'w-64 h-64'} rounded-full bg-primary/20 animate-pulse animation-delay-1000`}></div>
            
            {/* 3D圆形头像 - 响应鼠标移动产生3D效果 */}
            <div 
              className={`${isTablet && isPortrait ? 'w-52 h-52' : isTablet ? 'w-64 h-64' : 'w-72 h-72'} preserve-3d transition-transform duration-300 cursor-pointer z-10 rounded-full`}
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