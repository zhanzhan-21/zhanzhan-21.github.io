"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ExpandableProjectCard from "@/components/3d/ExpandableProjectCard"

export default function Projects() {
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null)
  
  const projects = [
    {
      title: "匠码社区项目",
      description:
        "匠码是一个前后端分离的社区项目，包括前端 PC 和管理后台，是一个用于帮助开发者成长、面向互联网开发者的技术内容分享与交流的平台。项目在后端侧重点优化登录体验、消息异步处理与活跃度统计，保障系统在高并发下的稳定性与可维护性。",
      technologies: ["Java", "Spring Boot", "MySQL", "Redis", "RabbitMQ", "ThreadLocal", "WebSocket", "Git", "Linux"],
      image: "/paicodingLogo.png",
      github: "https://github.com/zhanzhan-21/paicoding",
      demo: "https://paicoding.com",
    },
    {
      title: "线上便利店项目",
      description:
        "本项目为校园师生提供购物平台，包括后端管理系统与移动端双系统。后端管理系统提供给商家使用，用于管理便利店中的商品、分类、订单和员工信息，并具有导出运营数据功能。移动端主要提供给消费者使用，具有微信登录、添加商品至购物车、提醒商家以及下单支付等功能。",
      technologies: ["Java", "Spring Boot", "MySQL", "Redis", "Caffeine", "EasyExcel", "阿里云OSS", "Spring Mail", "雪花算法"],
      image: "/images/线上便利店.png",
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

