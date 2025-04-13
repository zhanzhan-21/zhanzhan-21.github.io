"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Calendar, Users, ChevronDown, Code, Award, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 处理卡片展开/收起的副作用
  useEffect(() => {
    if (isExpanded) {
      // 保存当前滚动位置但不锁定滚动
      const currentScrollPos = window.scrollY;
      
      return () => {
        // 恢复滚动位置
        window.scrollTo(0, currentScrollPos);
      };
    }
  }, [isExpanded]);
  
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
      display: "block",
      zIndex: 40
    },
    closed: {
      opacity: 0,
      zIndex: -1,
      transitionEnd: {
        display: "none"
      }
    }
  };

  // 卡片动画变体 - 使用transform代替宽度变化
  const cardVariants = {
    collapsed: { 
      width: "320px", 
      height: "64px", // 固定高度
      borderRadius: "16px",
      scale: 1,
      zIndex: 10,
      y: 0
    },
    expanded: { 
      width: "90%", 
      maxWidth: "800px",
      height: "auto", 
      borderRadius: "12px",
      scale: 1,
      zIndex: 60,
      y: 0
    }
  };

  // 内容动画变体 - 优化内容展开动画
  const contentVariants = {
    collapsed: { 
      opacity: 0, 
      scaleY: 0.8,
      height: 0,
      transformOrigin: "top"
    },
    expanded: { 
      opacity: 1, 
      scaleY: 1,
      height: "auto",
      transformOrigin: "top"
    }
  };
  
  // 为展开定义动画配置
  const expandTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    duration: 0.18
  };
  
  // 收起时使用纯补间动画，避免任何弹簧效果
  const collapseTransition = {
    type: "tween",
    duration: 0.15,
    ease: "easeIn" // 使用easeIn让收起更加迅速直接
  };
  
  if (!mounted) return null;

  return (
    <>
      {/* 全屏覆盖层 - 在卡片展开时显示 */}
      <motion.div
        className="fixed inset-x-0 bottom-0 bg-gray-800/40 backdrop-blur-sm z-40"
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
        variants={overlayVariants}
        transition={{ 
          type: "tween",
          duration: 0.15,
          ease: "easeOut"
        }}
        onClick={() => setIsExpanded(false)}
        style={{ 
          position: 'fixed', 
          top: '80px', // 为导航栏预留空间
          left: 0, 
          right: 0, 
          bottom: 0,
          willChange: 'opacity',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* 卡片容器 */}
      <div className={cn(
        "relative w-full flex justify-center",
        isExpanded ? "fixed inset-0 z-50 flex items-center justify-center p-6" : "h-full"
      )}
      style={isExpanded ? { 
        position: 'fixed', 
        top: '80px', // 为导航栏预留空间 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 50
      } : {}}
      onClick={(e) => {
        // 如果点击的是容器而不是卡片内容，则收起卡片
        if (isExpanded && e.currentTarget === e.target) {
          setIsExpanded(false);
        }
      }}>
        <motion.div
          layout={false}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={cardVariants}
          // 单独控制每个属性的动画过渡
          transition={!isExpanded ? {
            // 收起时的过渡设置
            type: "tween",
            duration: 0.15,
            ease: "easeInOut",
            // 重要：收起时不对高度进行动画
            height: { duration: 0 }
          } : {
            // 展开时的过渡设置
            type: "tween",
            duration: 0.15,
            ease: "easeInOut",
            width: {
              type: "tween",
              duration: 0.18,
              ease: "easeOut"
            },
            height: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.18
            }
          }}
          className={cn(
            "overflow-hidden relative transition-all duration-100",
            isExpanded 
              ? `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl ${getGlowColor()} max-w-3xl mx-auto` 
              : `text-white shadow-lg ${getGlowColor()} h-16` // 固定高度为64px (h-16)
          )}
          style={!isExpanded ? {
            background: `linear-gradient(to right, ${getGradientColors().from}, ${getGradientColors().to})`,
            willChange: 'transform, width, border-radius',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            height: '64px' // 固定高度值
          } : isExpanded ? {
            position: 'relative',
            zIndex: 60,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            willChange: 'transform, width, border-radius',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          } : {}}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={isExpanded ? {} : {
            scale: 1.03,
            transition: { duration: 0.1, ease: "easeOut" }
          }}
        >
          {/* 卡片背景装饰 */}
          {!isExpanded && (
            <div className="absolute inset-0 overflow-hidden opacity-50">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
            </div>
          )}
          
          {/* 头部/按钮部分 */}
          <div 
            className={cn(
              "flex items-center cursor-pointer justify-between",
              isExpanded 
                ? "border-b border-gray-200 dark:border-gray-800 p-4" 
                : "p-2.5 pl-4 pr-4 h-full"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* 项目标题 */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {!isExpanded && (
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
              )}
              
              <h3 className={cn(
                "font-bold truncate",
                isExpanded ? "text-xl text-gray-900 dark:text-white" : "text-base text-white"
              )}>
                {project.title}
              </h3>
            </div>
            
            {/* 操作按钮 */}
            <motion.div
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 ml-2 flex-shrink-0",
                isExpanded 
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" 
                  : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              )}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              {isExpanded ? "收起" : "展开"}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  damping: 25,
                  duration: 0.15
                }}
              >
                <ChevronDown className="h-3 w-3" /> 
              </motion.div>
            </motion.div>
          </div>
          
          {/* 展开内容部分 */}
          <AnimatePresence initial={false} mode="sync">
            {isExpanded && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={collapseTransition}
                className="overflow-auto max-h-[70vh]"
                style={{ 
                  overflowY: 'auto', 
                  maxHeight: '70vh',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  WebkitFontSmoothing: 'subpixel-antialiased',
                  transform: 'translateZ(0)',
                  isolation: 'isolate'
                }}
              >
                <div className="p-5">
                  <div className="grid grid-cols-1 gap-5">
                    {/* 项目描述和关键特性 */}
                    <div className="space-y-5">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                          <Code className={cn("h-4 w-4 mr-2", getTextColor())} />
                          项目描述
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
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
                                <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
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
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
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
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}