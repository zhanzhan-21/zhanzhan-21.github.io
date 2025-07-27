"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Calendar, Users, ChevronDown, Code, Award, Star, ChevronRight } from 'lucide-react'
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
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function ExpandableProjectCard({ project, index = 0, isExpanded = false, onToggleExpanded }: ExpandableProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
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

  // 卡片动画变体
  const cardVariants = {
    collapsed: { 
      height: "auto",
      scale: 1,
      y: 0
    },
    expanded: { 
      height: "auto",
      scale: 1,
      y: 0
    }
  };

  // 内容动画变体
  const contentVariants = {
    collapsed: { 
      opacity: 0,
      height: 0,
      overflow: "hidden"
    },
    expanded: { 
      opacity: 1,
      height: "auto",
      overflow: "visible"
    }
  };
  
  // 动画配置
  const animationConfig = {
    type: "tween",
    duration: 0.3,
    ease: [0.33, 1, 0.68, 1]
  };

  return (
    <motion.div
      ref={ref}
      initial="collapsed"
      animate="collapsed"
      variants={cardVariants}
      transition={animationConfig}
      className={cn(
        "overflow-hidden relative w-full max-w-2xl",
        `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg ${getGlowColor()} rounded-xl`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "linear" }
      }}
    >
      {/* 卡片背景装饰 */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 blur-xl"></div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="relative z-10">
        {/* 项目标题和基本信息 - 始终显示 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            {/* 项目标题和图标 */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center"
              >
                <img 
                  src={project.image || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {project.title}
                </h3>
                                 <p className="text-sm text-gray-600 dark:text-gray-400">
                   {index === 0 ? "技术派社区项目 • 2024.10 - 2025.06" : "企业级微服务项目 • 2024.06 - 2024.12"}
                 </p>
              </div>
            </div>
            
                         {/* 展开/收起按钮 */}
             <motion.button
               onClick={() => onToggleExpanded?.()}
               className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
             >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>
          
          {/* 核心技术栈 - 始终显示 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Code className="h-4 w-4 mr-2 text-blue-500" />
              核心技术栈
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 6).map((tech, i) => {
                const { from, to } = getGradientColors();
                return (
                  <Badge 
                    key={i}
                    variant="secondary" 
                    className="text-white border-0 text-xs px-2 py-1"
                    style={{
                      background: `linear-gradient(to right, ${from}, ${to})`
                    }}
                  >
                    {tech}
                  </Badge>
                );
              })}
              {project.technologies.length > 6 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{project.technologies.length - 6} 更多
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* 详细内容 - 可折叠 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={contentVariants}
              transition={animationConfig}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 space-y-6">
                {/* 项目描述 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-blue-500" />
                    项目描述
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                                 {/* 主要职责 */}
                 <div className="space-y-3">
                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                     <Award className="h-4 w-4 mr-2 text-blue-500" />
                     主要职责
                   </h4>
                   <ul className="space-y-2">
                     {index === 0 ? (
                       <>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>维护半长连接映射关系，实现扫码登录功能</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>使用RabbitMQ实现消息异步解耦</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>基于Redis zset实现用户活跃度排名</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>使用ThreadLocal封装线程隔离的全局上下文</span>
                         </li>
                       </>
                     ) : (
                       <>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>设计并实现微服务架构，包含用户、商品、订单、支付等核心服务</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>集成Spring Cloud组件，实现服务注册发现、配置中心、熔断降级</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>实现分布式事务、分库分表、读写分离等高性能数据方案</span>
                         </li>
                         <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                           <span>使用Docker和Kubernetes实现容器化部署和自动化运维</span>
                         </li>
                       </>
                     )}
                   </ul>
                 </div>
                
                {/* 项目链接 */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 justify-center group transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 text-sm h-9" 
                    asChild
                  >
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}