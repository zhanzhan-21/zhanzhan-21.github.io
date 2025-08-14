"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Award, Calendar, ExternalLink } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface AwardItem {
  title: string;
  url?: string;
  date: string;
  level: string;
  hasLink: boolean;
  image?: string; // 奖项证书或图片路径
  cloned?: boolean; // 标记是否为克隆项目用于无缝循环
}

interface AwardsCarouselProps {
  awards: AwardItem[];
}

export default function AwardsCarousel({ awards }: AwardsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  const currentTranslateXRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  
  // 创建适合移动端显示的奖项卡片
  const AwardCard = ({ award }: { award: AwardItem }) => {
    return (
      <motion.div 
        className={`w-full h-[320px] overflow-hidden bg-white dark:bg-gray-800/30 dark:hover:bg-gray-800/50 rounded-xl ${isMobile ? 'shadow-lg' : ''}`}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25
        }}
      >
        {/* 奖项图片占位区域 - 进一步增加高度 */}
        <div className={`relative overflow-hidden ${isMobile ? 'h-72' : 'h-64'}`}>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {award.image ? (
              <motion.img 
                src={award.image} 
                alt={award.title}
                className="w-full h-full object-contain p-2"
                whileHover={{ scale: 1.02 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 25
                }}
              />
            ) : (
              <Award className="h-16 w-16 text-primary opacity-20" />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80 text-primary dark:text-primary-foreground font-medium border-0 backdrop-blur-sm text-xs shadow-sm">{award.level}</Badge>
          </div>
        </div>
        
        {/* 奖项信息 - 更紧凑布局 */}
        <div className="p-2">
          <h3 className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'} text-gray-900 dark:text-white line-clamp-1 mb-1`}>{award.title}</h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{award.date}</span>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检查
    checkMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 计算实际需要展示的奖项（原始奖项列表 + 复制的项目用于无缝循环）
  const displayItems = useMemo(() => {
    if (awards.length === 0) return [];
    
    // 复制三次奖项，确保足够的克隆内容用于无缝循环
    return [
      ...awards.map(item => ({...item, cloned: true, group: 'first', id: `clone-first-${item.title}`})),
      ...awards.map(item => ({...item, cloned: false, group: 'original', id: `original-${item.title}`})), 
      ...awards.map(item => ({...item, cloned: true, group: 'last', id: `clone-last-${item.title}`}))
    ];
  }, [awards]);
  
  // 获取滑块宽度
  const getSlideWidth = useCallback(() => {
    if (!containerRef.current) return 0;
    // 移动端显示单个奖项
    if (isMobile) {
      return containerRef.current.offsetWidth;
    }
    // 桌面端显示三个奖项
    return containerRef.current.offsetWidth / 3;
  }, [isMobile]);
  
  // 获取单组奖项的总宽度
  const getTotalWidth = useCallback(() => {
    return getSlideWidth() * awards.length;
  }, [awards.length, getSlideWidth]);
  
  // 重置循环位置 - 确保无限循环的关键
  const resetPositionIfNeeded = useCallback(() => {
    if (!carouselRef.current || awards.length === 0) return;
    
    const totalWidth = getTotalWidth();
    
    // 当滚动到最后一组克隆区域时，立即回到原始区域
    if (currentTranslateXRef.current <= -(totalWidth * 2)) {
      // 回到原始区域的相同相对位置
      currentTranslateXRef.current += totalWidth;
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
      // 强制回流以确保无动画跳转生效
      void carouselRef.current.offsetHeight;
    }
    
    // 当滚动到第一组克隆区域之前时，立即跳到最后一组
    if (currentTranslateXRef.current > -getSlideWidth()) {
      // 跳到最后一组的相同相对位置
      currentTranslateXRef.current -= totalWidth;
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
      // 强制回流以确保无动画跳转生效
      void carouselRef.current.offsetHeight;
    }
  }, [awards.length, getTotalWidth, getSlideWidth]);
  
  // 启动平滑滚动
  const startSmoothScroll = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    
    if (!carouselRef.current || awards.length === 0 || isPaused) return;
    
    const totalWidth = getTotalWidth();
    const duration = awards.length * 8 * 1000; // 总时长(毫秒)
    const pixelsPerMs = totalWidth / duration; // 每毫秒移动的像素数
    
    lastTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      if (isPaused || !carouselRef.current) {
        animFrameRef.current = null;
        return;
      }
      
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      
      // 计算新位置 - 向左移动
      currentTranslateXRef.current -= pixelsPerMs * deltaTime;
      
      // 应用新位置
      carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
      
      // 检查是否需要重置位置
      resetPositionIfNeeded();
      
      // 更新活动索引
      const slideWidth = getSlideWidth();
      const totalWidth = getTotalWidth();
      
      // 计算当前位置相对于原始集合的位置
      let relativePosition = Math.abs(currentTranslateXRef.current);
      while (relativePosition >= totalWidth) {
        relativePosition -= totalWidth;
      }
      
      const currentIndex = Math.floor(relativePosition / slideWidth) % awards.length;
      setActiveIndex(currentIndex);
      
      // 继续动画
      animFrameRef.current = requestAnimationFrame(animate);
    };
    
    animFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [awards.length, getSlideWidth, getTotalWidth, isPaused, resetPositionIfNeeded]);
  
  // 初始化和窗口大小变化处理
  useEffect(() => {
    if (!carouselRef.current || awards.length === 0) return;
    
    // 初始化时，将位置设置为第一个原始项目的位置（跳过第一组克隆）
    if (!isInitializedRef.current) {
      const totalWidth = getTotalWidth();
      currentTranslateXRef.current = -totalWidth;
      carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
      isInitializedRef.current = true;
    }
    
    // 启动平滑滚动
    const cleanup = startSmoothScroll();
    
    // 窗口大小变化时
    const handleResize = () => {
      if (!carouselRef.current) return;
      
      // 暂停当前动画
      if (cleanup) cleanup();
      
      // 存储当前的相对位置比例（相对于一组奖项的总宽度）
      const oldTotalWidth = getTotalWidth();
      let relativePosition = Math.abs(currentTranslateXRef.current);
      while (relativePosition >= oldTotalWidth) {
        relativePosition -= oldTotalWidth;
      }
      const currentRatio = oldTotalWidth > 0 ? relativePosition / oldTotalWidth : 0;
      
      // 重新计算位置，保持相对位置不变
      const newTotalWidth = getTotalWidth();
      const baseOffset = Math.floor(Math.abs(currentTranslateXRef.current) / oldTotalWidth) * newTotalWidth;
      currentTranslateXRef.current = -(baseOffset + currentRatio * newTotalWidth);
      
      // 应用新位置
      carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
      
      // 如果之前不是暂停状态，重启滚动
      if (!isPaused) {
        startSmoothScroll();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cleanup) cleanup();
    };
  }, [awards.length, getTotalWidth, startSmoothScroll, isPaused, getSlideWidth]);
  
  // 处理暂停/播放状态变化
  useEffect(() => {
    if (isPaused) {
      // 暂停动画，但保持当前位置
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    } else {
      // 继续动画，从当前位置开始
      startSmoothScroll();
    }
  }, [isPaused, startSmoothScroll]);
  
  // 鼠标悬停事件处理
  const handleMouseEnter = useCallback(() => {
    // 暂停动画，但保持当前位置
    setIsPaused(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    // 继续动画，从当前位置开始
    setIsPaused(false);
  }, []);
  
  // 手动切换到指定奖项，优化导航体验
  const jumpToItem = (index: number, direction: 'prev' | 'next' = 'next') => {
    if (!carouselRef.current || awards.length === 0) return;
    
    const normalizedIndex = index % awards.length;
    setActiveIndex(normalizedIndex);
    
    // 获取相关尺寸
    const slideWidth = getSlideWidth();
    const totalWidth = getTotalWidth();
    
    // 当前位置在哪一组内（第一组克隆、原始组或最后一组克隆）
    let currentGroup = 0;
    if (currentTranslateXRef.current <= -totalWidth) {
      currentGroup = Math.floor(Math.abs(currentTranslateXRef.current) / totalWidth);
    }
    
    // 特殊处理边界情况，确保总是向左滑动
    if (direction === 'next' && normalizedIndex === 0 && activeIndex === awards.length - 1) {
      // 从最后一个到第一个（下一个按钮）- 向左滑动到下一组的第一个
      const targetGroup = currentGroup + 1;
      currentTranslateXRef.current = -(targetGroup * totalWidth);
    } else if (direction === 'prev' && normalizedIndex === awards.length - 1 && activeIndex === 0) {
      // 从第一个到最后一个（上一个按钮）- 向左滑动到上一组的最后一个
      const targetGroup = currentGroup - 1;
      // 如果已经在第一组，则跳到前一组（即使这意味着去到负数组索引）
      const effectiveGroup = targetGroup >= 0 ? targetGroup : 0;
      currentTranslateXRef.current = -(effectiveGroup * totalWidth + normalizedIndex * slideWidth);
    } else {
      // 常规情况 - 保持在当前组内滑动
      currentTranslateXRef.current = -(currentGroup * totalWidth + normalizedIndex * slideWidth);
    }
    
    // 应用新位置，带有平滑过渡
    carouselRef.current.style.transition = 'transform 0.3s ease-out';
    carouselRef.current.style.transform = `translateX(${currentTranslateXRef.current}px)`;
    
    // 过渡完成后移除过渡效果，检查是否需要重置位置
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.style.transition = '';
        
        // 检查是否需要重置位置（无动画跳转到合适的位置）
        resetPositionIfNeeded();
        
        // 如果之前是播放状态，恢复动画
        if (!isPaused) {
          startSmoothScroll();
        }
      }
    }, 300);
    
    // 暂停当前动画
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };
  
  // 更新底部指示器的点击处理，确保提供导航方向
  const handleIndicatorClick = (index: number) => {
    // 确定导航方向（顺时针或逆时针，选择较短的路径）
    const currentIndex = activeIndex;
    const count = awards.length;
    
    // 计算顺时针和逆时针的距离
    const clockwiseDistance = (index - currentIndex + count) % count;
    const counterClockwiseDistance = (currentIndex - index + count) % count;
    
    // 选择较短的路径作为导航方向
    const direction = clockwiseDistance <= counterClockwiseDistance ? 'next' : 'prev';
    
    jumpToItem(index, direction);
  };
  
  // 单个卡片的动画变体
  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 25
      }
    },
    rest: {
      scale: 1,
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 25
      }
    }
  };
  
  // 图片的动画变体
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 150,
        damping: 25
      }
    },
    rest: {
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 150,
        damping: 25
      }
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden h-[420px] p-4 bg-transparent dark:bg-transparent backdrop-blur-sm rounded-2xl"
      ref={containerRef}
    >
      {/* 箭头导航按钮 */}
      <button 
        onClick={() => {
          const newIndex = activeIndex === 0 ? awards.length - 1 : activeIndex - 1;
          jumpToItem(newIndex, 'prev');
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-all hover:scale-110"
        aria-label="上一个"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={() => {
          const newIndex = activeIndex === awards.length - 1 ? 0 : activeIndex + 1;
          jumpToItem(newIndex, 'next');
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-all hover:scale-110"
        aria-label="下一个"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* 轮播容器 - 直接控制transform的版本 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pt-6 pb-16">
        {/* 左侧渐变模糊效果 */}
        <div className="absolute left-0 top-0 bottom-0 w-[8%] z-20 pointer-events-none bg-gradient-to-r from-white dark:from-gray-800 to-transparent"></div>
        
        {/* 右侧渐变模糊效果 */}
        <div className="absolute right-0 top-0 bottom-0 w-[8%] z-20 pointer-events-none bg-gradient-to-l from-white dark:from-gray-800 to-transparent"></div>
        
        <div 
          className="flex flex-row items-center h-full will-change-transform"
          ref={carouselRef}
          style={{ transform: 'translateX(0px)' }}
        >
          {displayItems.map((award, idx) => (
            <div
              key={`award-${award.id || idx}`}
              className="flex-shrink-0 px-4 h-full flex items-center justify-center"
              style={{ 
                width: isMobile ? '100%' : '33.333%'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-group={award.group}
            >
              <AwardCard award={award} />
            </div>
          ))}
        </div>
      </div>
      
      {/* 指示器 - 简化版 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {awards.map((_, index) => {
          const isActive = index === activeIndex % awards.length;
          return (
            <motion.button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`h-2 rounded-full transition-all ${
                isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              animate={{
                width: isActive ? '2rem' : '0.5rem',
                scale: isActive ? 1.1 : 1
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ 
                type: "tween", 
                duration: 0.25, 
                ease: "easeOut" 
              }}
              aria-label={`切换到奖项 ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}