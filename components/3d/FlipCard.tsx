"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Layers, Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  demo: string;
}

interface FlipCardProps {
  project: Project;
}

export default function FlipCard({ project }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }
  
  // 从描述中提取一些假数据用于背面显示
  const duration = "6个月"
  const teamSize = "5人团队"
  const keyFeatures = [
    "高并发处理",
    "分布式架构",
    "安全认证",
    "性能优化"
  ]
  
  return (
    <div 
      className="h-[450px] w-full relative perspective-1000 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300" 
      onClick={handleFlip}
    >
      <motion.div 
        className="h-full w-full relative preserve-3d duration-500 rounded-lg"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* 正面 */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-primary/80 text-white hover:bg-primary">
                项目展示
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="outline">+{project.technologies.length - 3}</Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">{project.description}</p>
            
            <div className="flex justify-end mt-3">
              <span className="text-xs text-gray-500 italic">点击查看详情</span>
            </div>
          </div>
        </div>
        
        {/* 背面 - 完全重新设计 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 border border-primary/30 shadow-lg rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white border-b border-primary/20 pb-3">{project.title}</h3>
          
          {/* 项目信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1 text-primary" />
                <span>持续时间: {duration}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Users className="h-3 w-3 mr-1 text-primary" />
                <span>团队规模: {teamSize}</span>
              </div>
            </div>
          </div>
          
          {/* 关键特性 */}
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
              <Layers className="h-4 w-4 mr-1 text-primary" />
              关键特性
            </h4>
            <ul className="text-xs space-y-1 pl-5 list-disc text-gray-700 dark:text-gray-300">
              {keyFeatures.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* 技术栈 */}
          <div className="mb-auto">
            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">技术栈:</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <Badge key={i} variant="outline" className="text-xs py-0 h-5 bg-primary/5 border-primary/20 text-primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm" className="h-8" asChild>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs"
              >
                <Github className="h-3 w-3 mr-1" />
                查看代码
              </a>
            </Button>
            <Button size="sm" className="h-8 bg-primary hover:bg-primary/90" asChild>
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                在线演示
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 