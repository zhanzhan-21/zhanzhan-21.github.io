"use client"

import { motion } from "framer-motion"
import ExpandableProjectCard from "@/components/3d/ExpandableProjectCard"

export default function Projects() {
  const projects = [
    {
      title: "企业级微服务电商平台",
      description:
        "基于Spring Cloud构建的微服务电商系统，包含用户服务、商品服务、订单服务、支付服务等模块，实现了高并发、高可用的分布式架构。项目采用了服务注册与发现、配置中心、熔断降级、链路追踪等微服务治理技术，保证了系统的稳定性和可扩展性。同时引入了分布式事务、分库分表、读写分离等技术解决高并发场景下的数据一致性问题。",
      technologies: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "Redis", "RabbitMQ", "Docker", "Kubernetes", "Nginx"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    },
    {
      title: "智能问答系统",
      description:
        "基于NLP技术的智能问答系统，集成了知识图谱和机器学习算法，能够自动回答用户提问，并支持持续学习和优化。系统采用了BERT预训练语言模型实现语义理解，结合知识图谱进行答案检索与生成，实现了高准确率的自动问答功能。系统具备上下文理解、多轮对话、知识推理等能力，并通过用户反馈不断优化模型，提升问答质量。",
      technologies: ["Java", "Spring Boot", "Elasticsearch", "MongoDB", "Python", "TensorFlow", "PyTorch", "Neo4j"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    },
    {
      title: "大数据分析平台",
      description:
        "企业级大数据处理与分析平台，整合多源异构数据，提供数据采集、清洗、存储、分析和可视化的全流程解决方案。平台采用Lambda架构，支持批处理和流处理双模式，实现了实时数据分析与离线数据挖掘的统一。系统具备弹性扩展、容错恢复、资源动态调度等特性，满足PB级数据处理需求。",
      technologies: ["Java", "Spark", "Hadoop", "Flink", "Kafka", "HBase", "Hive", "ELK", "Zookeeper"],
      image: "/placeholder.svg?height=200&width=400",
      github: "#",
      demo: "#",
    },
    {
      title: "DevOps自动化部署平台",
      description:
        "面向企业的DevOps自动化部署平台，覆盖代码提交、编译构建、测试、部署、监控的全流程自动化。系统支持多种语言和框架的CI/CD流程，提供容器化部署、蓝绿发布、金丝雀发布等多种发布策略。引入了自动化测试、代码质量分析、安全扫描等环节，保证了交付质量和发布效率。",
      technologies: ["Java", "Spring Boot", "Docker", "Kubernetes", "Jenkins", "Ansible", "Prometheus", "Grafana", "Git"],
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

        {/* 项目卡片区域 - 使用flex和自适应布局 */}
        <div className="flex justify-center items-center px-1 sm:px-2">
          <div className="w-full max-w-4xl">
            {/* 项目卡片网格 - 使用响应式布局，在移动端为单列，桌面端为双列 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-1 gap-y-4 md:gap-y-6 place-items-center">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex justify-center w-full px-1 mb-2"
                >
                  <ExpandableProjectCard project={project} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

