"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FlipCard from "@/components/3d/FlipCard"

export default function Projects() {
  const projects = [
    {
      title: "企业级微服务电商平台",
      description:
        "基于Spring Cloud构建的微服务电商系统，包含用户服务、商品服务、订单服务、支付服务等模块，实现了高并发、高可用的分布式架构。",
      technologies: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "Redis", "RabbitMQ", "Docker"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    },
    {
      title: "智能问答系统",
      description:
        "基于NLP技术的智能问答系统，集成了知识图谱和机器学习算法，能够自动回答用户提问，并支持持续学习和优化。",
      technologies: ["Java", "Spring Boot", "Elasticsearch", "MongoDB", "Python", "TensorFlow"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    },
  ]

  return (
    <section id="projects" className="pt-32 pb-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">项目经历</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            以下是我参与开发的一些项目，展示了我的技术能力和解决问题的思路
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FlipCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

