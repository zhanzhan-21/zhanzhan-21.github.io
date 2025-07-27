"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ExpandableProjectCard from "@/components/3d/ExpandableProjectCard"

export default function Projects() {
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null)
  
  const projects = [
    {
      title: "技术派社区项目",
      description:
        "技术派是一个前后端分离的社区项目，包括前端PC和管理后台，是一个用于帮助开发者成长的、面向互联网开发者的技术内容分享与交流的平台。项目采用微服务架构，实现了用户认证、内容管理、消息推送、数据统计等核心功能。通过Redis缓存优化、RabbitMQ消息队列、ThreadLocal线程隔离等技术，保证了系统的高并发性能和用户体验。",
      technologies: ["Java", "Spring Boot", "MySQL", "Redis", "RabbitMQ", "ThreadLocal", "WebSocket", "Git", "Linux"],
      image: "/paicodingLogo.png",
      github: "https://github.com/zhanzhan-21/paicoding",
      demo: "https://paicoding.com",
    },
    {
      title: "企业级微服务电商平台",
      description:
        "基于Spring Cloud构建的微服务电商系统，包含用户服务、商品服务、订单服务、支付服务等模块，实现了高并发、高可用的分布式架构。项目采用了服务注册与发现、配置中心、熔断降级、链路追踪等微服务治理技术，保证了系统的稳定性和可扩展性。同时引入了分布式事务、分库分表、读写分离等技术解决高并发场景下的数据一致性问题。",
      technologies: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "Redis", "RabbitMQ", "Docker", "Kubernetes", "Nginx"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    }
  ]

  return (
    <section id="projects" className="pt-16 pb-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* 背景装饰元素 - 仅保留平滑的背景渐变 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
      
      <div className="container mx-auto relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">项目经历</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            以下是我参与开发的一些项目，展示了我的技术能力和解决问题的思路
          </p>
        </motion.div>

        {/* 项目卡片区域 - 单列布局 */}
        <div className="flex justify-center items-center px-1 sm:px-2">
          <div className="w-full max-w-4xl">
            {/* 项目卡片单列布局 */}
            <div className="flex flex-col gap-6 place-items-center">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex justify-center w-full px-1"
                >
                  <ExpandableProjectCard 
                    project={project} 
                    index={index}
                    isExpanded={expandedProjectIndex === index}
                    onToggleExpanded={() => {
                      if (expandedProjectIndex === index) {
                        setExpandedProjectIndex(null)
                      } else {
                        setExpandedProjectIndex(index)
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

