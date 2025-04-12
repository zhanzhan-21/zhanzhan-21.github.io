"use client"

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

interface Skill {
  name: string;
  level: number;
  icon?: string; // 技能图标路径
}

interface SkillOrbitProps {
  skills: Skill[];
}

// 技能图标映射，将技能名称映射到对应图标
const skillIconMap: Record<string, string> = {
  "Java": "/icons/java.svg",
  "Spring Boot": "/icons/spring-boot.svg",
  "Spring Cloud": "/icons/spring-cloud.svg",
  "Microservices": "/icons/microservices.svg",
  "MySQL": "/icons/mysql.svg",
  "Redis": "/icons/redis.svg",
  "MongoDB": "/icons/mongodb.svg", 
  "Elasticsearch": "/icons/elasticsearch.svg",
  "System Design": "/icons/system-design.svg",
  "Docker": "/icons/docker.svg",
  "Kubernetes": "/icons/kubernetes.svg",
  "Git": "/icons/git.svg",
}

// 默认图标集合，用于没有特定图标的技能
const defaultIcons = [
  "/icons/code.svg",
  "/icons/server.svg",
  "/icons/database.svg",
  "/icons/cloud.svg"
]

export default function SkillOrbit({ skills }: SkillOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  // 添加暂停动画的状态
  const [pauseAnimation, setPauseAnimation] = useState(false)
  
  // 客户端挂载后设置标记
  useEffect(() => {
    setIsMounted(true)
    
    // 计算容器尺寸
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      })
    }
    
    // 响应窗口尺寸变化
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // 获取技能图标
  const getSkillIcon = (skill: Skill, index: number): string => {
    // 优先使用技能自带图标
    if (skill.icon) return skill.icon
    
    // 其次使用映射表中的图标
    if (skillIconMap[skill.name]) return skillIconMap[skill.name]
    
    // 最后使用默认图标
    return defaultIcons[index % defaultIcons.length]
  }
  
  // 生成三个轨道上的技能，确保不重复
  const createOrbits = () => {
    if (!isMounted) return { innerOrbit: [], middleOrbit: [], outerOrbit: [] }
    
    // 按熟练度对技能进行分组
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level)
    
    // 将技能分配到不同轨道
    const innerOrbit = sortedSkills.slice(0, Math.min(6, sortedSkills.length))
    const middleOrbit = sortedSkills.slice(Math.min(6, sortedSkills.length), Math.min(12, sortedSkills.length))
    const outerOrbit = sortedSkills.slice(Math.min(12, sortedSkills.length), Math.min(16, sortedSkills.length))
    
    // 为每个轨道分配唯一标识，防止重复
    const usedIcons = new Set<string>()
    
    const processOrbit = (orbit: Skill[]) => {
      return orbit.map((skill, index) => {
        let iconPath = skill.icon || skillIconMap[skill.name]
        
        // 如果图标已被使用或不存在
        if (!iconPath || usedIcons.has(iconPath)) {
          // 尝试从默认图标中选择未使用过的
          for (const defaultIcon of defaultIcons) {
            if (!usedIcons.has(defaultIcon)) {
              iconPath = defaultIcon
              break
            }
          }
          
          // 如果仍然没有可用的，使用索引修饰的默认图标
          if (!iconPath || usedIcons.has(iconPath)) {
            iconPath = defaultIcons[index % defaultIcons.length]
          }
        }
        
        usedIcons.add(iconPath)
        return {
          ...skill,
          icon: iconPath
        }
      })
    }
    
    return {
      innerOrbit: processOrbit(innerOrbit),
      middleOrbit: processOrbit(middleOrbit),
      outerOrbit: processOrbit(outerOrbit)
    }
  }
  
  const { innerOrbit, middleOrbit, outerOrbit } = createOrbits()
  
  // 轨道样式常量
  const innerOrbitStyles = {
    borderColor: 'rgba(99, 102, 241, 0.8)',
    animationDuration: '50s',
  }
  const middleOrbitStyles = {
    borderColor: 'rgba(99, 102, 241, 0.6)',
    animationDuration: '70s',
  }
  const outerOrbitStyles = {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    animationDuration: '90s',
  }
  
  // 处理技能图标悬停
  const handleSkillHover = (skill: Skill, enter: boolean) => {
    if (enter) {
      setHoveredSkill(skill)
      setPauseAnimation(true) // 悬停时暂停动画
    } else {
      setHoveredSkill(null)
      setPauseAnimation(false) // 离开时恢复动画
    }
  }
  
  // 为每个技能创建节点
  const createSkillNodes = (orbit: Skill[], radius: number, reverse = false, iconSize = 36) => {
    if (!orbit.length) return null;
    
    // 根据技能数量计算间距角度
    const angleStep = 360 / orbit.length;
    
    return orbit.map((skill, index) => {
      // 计算角度位置
      const angle = index * angleStep;
      // 转换为弧度
      const radian = (angle * Math.PI) / 180;
      // 计算坐标
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      const isHovered = hoveredSkill?.name === skill.name;
      
      return (
        <div
          key={`${skill.name}-${index}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            // 提高所有图标的基础z-index，确保它们在轨道上方
            zIndex: isHovered ? 100 : 60,
            pointerEvents: 'auto', // 确保所有图标都可以接收鼠标事件
            transition: 'transform 0.3s ease-out',
            // 添加模糊过滤器，使悬停效果更明显
            filter: isHovered ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.7))' : 'none'
          }}
          // 将事件处理程序移至外层div
          onMouseEnter={(e) => {
            e.stopPropagation() // 阻止事件冒泡
            handleSkillHover(skill, true)
          }}
          onMouseLeave={(e) => {
            e.stopPropagation() // 阻止事件冒泡
            handleSkillHover(skill, false)
          }}
        >
          <div
            className={`
              rounded-full flex items-center justify-center
              transition-all duration-300 transform
              ${isHovered 
                ? 'ring-3 ring-primary shadow-xl scale-125 bg-primary/10 dark:bg-primary/20' 
                : 'bg-white/95 dark:bg-gray-800/95 shadow-md hover:shadow-lg hover:scale-110'}
            `}
            style={{ 
              width: iconSize, 
              height: iconSize,
              boxShadow: isHovered ? '0 0 15px rgba(99, 102, 241, 0.6)' : '0 0 5px rgba(99, 102, 241, 0.2)'
            }}
          >
            <Image
              src={skill.icon || getSkillIcon(skill, index)}
              alt={skill.name}
              width={iconSize * 0.75}
              height={iconSize * 0.75}
              className={`object-contain transition-all duration-300 ${isHovered ? 'brightness-125' : ''}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/code.svg';
              }}
            />
          </div>
        </div>
      );
    });
  };
  
  if (!isMounted) {
    return <div className="w-full h-full" ref={containerRef}></div>
  }
  
  // 计算轨道半径 - 调整为更合适的尺寸
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  const maxDimension = Math.min(centerX, centerY) * 0.85; // 缩小整体比例，确保内圈图标完全显示
  
  // 调整轨道间距，使图标不重叠且完全显示
  const innerOrbitRadius = maxDimension * 0.7; // 进一步减小内圈半径，确保图标完全可见
  const middleOrbitRadius = maxDimension * 1.0; // 调整中圈半径，与内圈保持距离
  const outerOrbitRadius = maxDimension * 1.3; // 调整外圈半径
  
  // 生成动画类名，根据悬停状态决定是否暂停
  const getAnimationClass = (baseClass: string) => {
    return pauseAnimation ? `${baseClass} pause-animation` : baseClass;
  };
  
  const offset = 120;
  
  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* 背景和中心元素 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-full h-full flex items-center justify-center">
          {/* 轨道 - 静态 */}
          <div 
            className="absolute rounded-full border-2 border-dashed border-primary/80"
            style={{
              width: innerOrbitRadius * 2,
              height: innerOrbitRadius * 2,
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
              zIndex: 10
            }}
          />
          
          <div 
            className="absolute rounded-full border-2 border-dashed border-primary/60"
            style={{
              width: middleOrbitRadius * 2,
              height: middleOrbitRadius * 2,
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.15)',
              zIndex: 10
            }}
          />
          
          <div 
            className="absolute rounded-full border-2 border-dashed border-primary/40"
            style={{
              width: outerOrbitRadius * 2,
              height: outerOrbitRadius * 2,
              boxShadow: '0 0 5px rgba(99, 102, 241, 0.1)',
              zIndex: 10
            }}
          />
          
          {/* 中心区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-full z-50 shadow-lg p-4 w-40 h-40 flex flex-col items-center justify-center border-2 border-primary/20">
            {hoveredSkill ? (
              <>
                <h3 className="font-bold text-md text-primary text-center">{hoveredSkill.name}</h3>
                <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-32">
                  <div 
                    className="bg-primary h-3 rounded-full" 
                    style={{ width: `${hoveredSkill.level}%` }}
                  />
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{hoveredSkill.level}%</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-xl text-primary">技能概览</h3>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 text-center">悬停查看详情</p>
              </>
            )}
          </div>
          
          {/* 轨道技能节点 */}
          <div className="absolute w-full h-full pointer-events-none">
            {/* 内层轨道 */}
            <div 
              className={getAnimationClass("absolute w-full h-full animate-spin-slow")}
              style={{
                animationDuration: innerOrbitStyles.animationDuration,
                transformOrigin: 'center center',
                zIndex: 20
              }}
            >
              {createSkillNodes(innerOrbit, innerOrbitRadius, false, 34)}
            </div>
            
            {/* 中层轨道（相反方向）*/}
            <div 
              className={getAnimationClass("absolute w-full h-full animate-spin-slow-reverse")}
              style={{
                animationDuration: middleOrbitStyles.animationDuration,
                transformOrigin: 'center center',
                zIndex: 30
              }}
            >
              {createSkillNodes(middleOrbit, middleOrbitRadius, true, 36)}
            </div>
            
            {/* 外层轨道 */}
            <div 
              className={getAnimationClass("absolute w-full h-full animate-spin-slower")}
              style={{
                animationDuration: outerOrbitStyles.animationDuration,
                transformOrigin: 'center center',
                zIndex: 40
              }}
            >
              {createSkillNodes(outerOrbit, outerOrbitRadius, false, 38)}
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加CSS来支持动画暂停 */}
      <style jsx>{`
        .pause-animation {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  )
} 