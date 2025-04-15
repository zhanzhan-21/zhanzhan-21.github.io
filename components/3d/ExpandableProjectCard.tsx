"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Calendar, Users, ChevronDown, Code, Award, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  demo: string;
}

interface ExpandableProjectCardProps {
  project: Project;
  index?: number;
}

export default function ExpandableProjectCard({ project, index = 0 }: ExpandableProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 处理卡片展开/收起的副作用
  useEffect(() => {
    if (isExpanded) {
      // 使用事件监听器禁止在卡片区域内滚动背景
      const preventScrollOnCard = (e: WheelEvent) => {
        if (ref.current && ref.current.contains(e.target as Node)) {
          // 找到滚动容器
          const scrollableContent = ref.current;
          // 检查是否到达滚动边界
          const { scrollTop, scrollHeight, clientHeight } = scrollableContent;
          const isAtTop = scrollTop <= 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;
          
          // 只有在到达边界并继续滚动时才阻止事件
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
          }
          // 否则允许滚动
        }
      };
      
      // 添加事件监听器，使用捕获阶段
      window.addEventListener('wheel', preventScrollOnCard, { passive: false, capture: true });
      
      // 移除事件监听器
      return () => {
        window.removeEventListener('wheel', preventScrollOnCard, { capture: true });
        document.body.style.overflow = '';
      };
    }
  }, [isExpanded]);
  
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
  
  // 从描述中提取一些假数据用于详情显示
  const duration = "6个月"
  const teamSize = "5人团队"
  const keyFeatures = [
    "高并发处理",
    "分布式架构",
    "安全认证",
    "性能优化"
  ]

  // 根据索引获取渐变颜色对象
  const getGradientColors = () => {
    const colors = [
      { from: '#3B82F6', to: '#4F46E5' }, // blue to indigo
      { from: '#A855F7', to: '#DB2777' }, // purple to pink
      { from: '#10B981', to: '#0D9488' }, // emerald to teal
      { from: '#F59E0B', to: '#EA580C' }  // amber to orange
    ];
    return colors[index % colors.length];
  };

  // 根据索引获取不同的渐变背景色
  const getGradientBg = () => {
    const gradients = [
      'bg-gradient-to-r from-blue-500 to-indigo-600', 
      'bg-gradient-to-r from-purple-500 to-pink-600', 
      'bg-gradient-to-r from-emerald-500 to-teal-600', 
      'bg-gradient-to-r from-amber-500 to-orange-600'
    ];
    return gradients[index % gradients.length];
  }

  // 获取暗色渐变背景
  const getDarkGradientBg = () => {
    const gradients = [
      'bg-gradient-to-r from-blue-900 to-indigo-900', 
      'bg-gradient-to-r from-purple-900 to-pink-900', 
      'bg-gradient-to-r from-emerald-900 to-teal-900', 
      'bg-gradient-to-r from-amber-900 to-orange-900'
    ];
    return gradients[index % gradients.length];
  }
  
  // 获取卡片边框发光效果颜色
  const getGlowColor = () => {
    const glows = [
      'shadow-blue-500/30',
      'shadow-purple-500/30',
      'shadow-emerald-500/30',
      'shadow-amber-500/30'
    ];
    return glows[index % glows.length];
  }
  
  // 获取文本主色调
  const getTextColor = () => {
    const colors = [
      'text-blue-600',
      'text-purple-600',
      'text-emerald-600', 
      'text-amber-600'
    ];
    return colors[index % colors.length];
  }
  
  // 获取背景色（非渐变）
  const getBgColor = () => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-emerald-500',
      'bg-amber-500'
    ];
    return colors[index % colors.length];
  }

  // 全屏覆盖层变体
  const overlayVariants = {
    open: {
      opacity: 1,
      display: "block"
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none"
      }
    }
  };

  // 卡片动画变体 - 使用更简单的动画策略
  const cardVariants = {
    collapsed: { 
      width: "100%",
      maxWidth: "380px",
      height: "64px",
      borderRadius: "16px",
      scale: 1,
      y: 0
    },
    expanded: { 
      width: "92%", // 略微减小宽度，确保在小屏幕上也有边距
      maxWidth: "800px",
      height: "auto", 
      borderRadius: "12px",
      scale: 1,
      y: 0
    }
  };

  // 内容动画变体 - 优化内容展开动画
  const contentVariants = {
    collapsed: { 
      opacity: 0
    },
    expanded: { 
      opacity: 1
    }
  };
  
  // 动画配置修改为优雅的淡入动画
  const instantAnimationConfig = {
    type: "tween",
    duration: 0.35,  // 适中的持续时间
    ease: [0.33, 1, 0.68, 1]  // 平滑的缓动函数
  };
  
  // 为内容展示定义不同的动画配置
  const contentAnimationConfig = {
    type: "tween",
    duration: 0.25,
    ease: [0.35, 1, 0.68, 1],
    delay: 0.1  // 轻微延迟，让卡片先展开再显示内容
  };

  // 添加自定义样式，隐藏滚动条但保留滚动功能
  const hideScrollbarStyle = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
    '&::-webkit-scrollbar': {
      display: 'none' // Chrome/Safari/Opera
    }
  };
  
  // 非展开状态下的渲染
  const renderCollapsedCard = () => (
    <motion.div
      id={`project-card-${index}`}
      initial="collapsed"
      animate="collapsed"
      variants={cardVariants}
      transition={instantAnimationConfig}
      className={cn(
        "overflow-hidden relative w-full",
        `text-white shadow-lg ${getGlowColor()} h-16 max-w-[380px]`
      )}
      style={{
        background: `linear-gradient(to right, ${getGradientColors().from}, ${getGradientColors().to})`,
        willChange: 'transform, width, border-radius',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        height: '64px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.1, ease: "linear" }
      }}
    >
      {/* 卡片背景装饰 */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
      </div>
      
      {/* 头部/按钮部分 */}
      <div 
        className="flex items-center cursor-pointer justify-between p-2.5 pl-4 pr-4 h-full"
        onClick={() => setIsExpanded(true)}
      >
        {/* 项目标题 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-lg overflow-hidden shadow-sm flex-shrink-0 bg-white/20 flex items-center justify-center backdrop-blur-sm"
          >
            <img 
              src={project.image || "/placeholder.svg"} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <h3 className="font-bold truncate text-base text-white">
            {project.title}
          </h3>
        </div>
        
        {/* 操作按钮 */}
        <motion.div
          className="rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 ml-2 flex-shrink-0 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          展开
          <motion.div>
            <ChevronDown className="h-3 w-3" /> 
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
  
  // 展开状态的渲染 - 使用Portal挂载到body
  const renderExpandedCard = () => {
    if (!mounted) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 flex items-start justify-center" 
        style={{ 
          zIndex: 95,
          paddingTop: isMobile ? '100px' : '40px',
          overflowY: 'auto'
        }}
      >
        {/* 背景遮罩 */}
        <div 
          className="fixed bg-white/30 backdrop-blur-md"
          onClick={() => setIsExpanded(false)}
          style={{ 
            zIndex: 90,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        
        {/* 卡片容器 */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          variants={cardVariants}
          transition={instantAnimationConfig}
          className={cn(
            "overflow-auto relative w-full scrollbar-hide",
            `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl ${getGlowColor()} max-w-3xl rounded-2xl`
          )}
          style={{
            boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.8)',
            willChange: 'transform, width, border-radius',
            backfaceVisibility: 'hidden',
            maxHeight: isMobile ? '75vh' : '85vh',
            zIndex: 96,
            position: 'relative',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowY: 'scroll',
            width: isMobile ? '95%' : '92%',
            margin: isMobile ? '0 auto' : 'auto'
          }}
        >
          {/* 自定义样式，隐藏滚动条 */}
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* 头部/按钮部分 */}
          <div 
            className="flex items-center cursor-pointer justify-between border-b border-gray-200 dark:border-gray-800 p-4"
            onClick={() => setIsExpanded(false)}
          >
            {/* 项目标题 */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h3 className="font-bold truncate text-xl text-gray-900 dark:text-white">
                {project.title}
              </h3>
            </div>
            
            {/* 操作按钮 */}
            <motion.div
              className="rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 ml-2 flex-shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              收起
              <motion.div
                animate={{ rotate: 180 }}
                transition={{ 
                  type: "tween", 
                  duration: 0.25,
                  ease: [0.33, 1, 0.68, 1]
                }}
              >
                <ChevronDown className="h-3 w-3" /> 
              </motion.div>
            </motion.div>
          </div>
          
          {/* 展开内容部分 - 使用优雅的动画 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={contentAnimationConfig}
            className="overflow-visible relative"
          >
            <div className="p-5">
              <div className="grid grid-cols-1 gap-5">
                {/* 项目描述和关键特性 */}
                <div className="space-y-5">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <Code className={cn("h-4 w-4 mr-2", getTextColor())} />
                      项目描述
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-justify">{project.description}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <Star className={cn("h-4 w-4 mr-2", getTextColor())} />
                      关键特性
                    </h4>
                    <ul className="grid grid-cols-2 gap-3">
                      {keyFeatures.map((feature, i) => {
                        const { from, to } = getGradientColors();
                        return (
                          <li 
                            key={i} 
                            className="flex items-start"
                          >
                            <div 
                              className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(to right, ${from}, ${to})`
                              }}
                            >
                              <Award className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-justify">{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tech, i) => {
                      const { from, to } = getGradientColors();
                      return (
                        <Badge 
                          key={i}
                          variant="secondary" 
                          className="text-white border-0"
                          style={{
                            background: `linear-gradient(to right, ${from}, ${to})`
                          }}
                        >
                          {tech}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {/* 项目信息和链接 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className={cn("h-4 w-4 mr-2", getTextColor())} />
                        <span>持续时间: {duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className={cn("h-4 w-4 mr-2", getTextColor())} />
                        <span>团队规模: {teamSize}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 justify-center group transition-all hover:bg-primary/5 dark:hover:bg-primary/10 border-gray-200 dark:border-gray-700 text-sm h-9" 
                        asChild
                      >
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className={cn("h-4 w-4 mr-2", getTextColor())} />
                          查看代码
                        </a>
                      </Button>
                      <Button 
                        className="flex-1 justify-center text-sm h-9 text-white border-0"
                        style={{
                          background: `linear-gradient(to right, ${getGradientColors().from}, ${getGradientColors().to})`
                        }}
                        asChild
                      >
                        <a 
                          href={project.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          在线演示
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>,
      document.body
    );
  };
  
  // 根据展开状态渲染不同的卡片
  return (
    <>
      {!isExpanded ? renderCollapsedCard() : null}
      {isExpanded ? renderExpandedCard() : null}
    </>
  );
}