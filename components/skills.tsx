"use client"

import { motion } from "framer-motion"
import { Database, Server, Layers, Terminal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Skills() {
  const backendSkills = [
    { name: "Java", level: 95 },
    { name: "Spring Boot", level: 90 },
    { name: "Spring Cloud", level: 85 },
    { name: "Microservices", level: 80 },
  ]

  const databaseSkills = [
    { name: "MySQL", level: 90 },
    { name: "Redis", level: 85 },
    { name: "MongoDB", level: 75 },
    { name: "Elasticsearch", level: 70 },
  ]

  const architectureSkills = [
    { name: "System Design", level: 85 },
    { name: "Design Patterns", level: 80 },
    { name: "API Design", level: 85 },
    { name: "Performance Optimization", level: 75 },
  ]

  const otherSkills = [
    { name: "Git", level: 90 },
    { name: "Docker", level: 80 },
    { name: "Kubernetes", level: 70 },
    { name: "CI/CD", level: 75 },
  ]

  return (
    <section id="skills" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">专业技能</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            我精通Java后端开发技术栈，包括数据库、后端框架和系统架构设计
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Server className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">后端开发</h3>
                </div>
                <div className="space-y-4">
                  {backendSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Database className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">数据库</h3>
                </div>
                <div className="space-y-4">
                  {databaseSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Layers className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">系统架构</h3>
                </div>
                <div className="space-y-4">
                  {architectureSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Terminal className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">开发工具</h3>
                </div>
                <div className="space-y-4">
                  {otherSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

