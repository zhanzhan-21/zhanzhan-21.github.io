"use client"

import { motion } from "framer-motion"
import { Database, Server, Layers, Terminal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import SkillOrbit from "@/components/3d/SkillOrbit"

export default function Skills() {
  const backendSkills = [
    { name: "Java", level: 95, icon: "/icons/java.svg" },
    { name: "Spring Boot", level: 90, icon: "/icons/spring-boot.svg" },
    { name: "Spring Cloud", level: 85, icon: "/icons/spring-cloud.svg" },
    { name: "Microservices", level: 80, icon: "/icons/microservices.svg" },
  ]

  const databaseSkills = [
    { name: "MySQL", level: 90, icon: "/icons/mysql.svg" },
    { name: "Redis", level: 85, icon: "/icons/redis.svg" },
    { name: "MongoDB", level: 75, icon: "/icons/mongodb.svg" },
    { name: "Elasticsearch", level: 70, icon: "/icons/elasticsearch.svg" },
  ]

  const architectureSkills = [
    { name: "System Design", level: 85, icon: "/icons/system-design.svg" },
    { name: "Design Patterns", level: 80, icon: "/icons/design-patterns.svg" },
    { name: "API Design", level: 85, icon: "/icons/api.svg" },
    { name: "Performance Optimization", level: 75, icon: "/icons/performance.svg" },
  ]

  const otherSkills = [
    { name: "Git", level: 90, icon: "/icons/git.svg" },
    { name: "Docker", level: 80, icon: "/icons/docker.svg" },
    { name: "Kubernetes", level: 70, icon: "/icons/kubernetes.svg" },
    { name: "CI/CD", level: 75, icon: "/icons/cicd.svg" },
  ]

  // 所有技能合并在一起
  const allSkills = [
    ...backendSkills,
    ...databaseSkills,
    ...architectureSkills,
    ...otherSkills
  ]

  return (
    <section id="skills" className="pt-32 pb-10 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2.5">专业技能</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-3.5"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            我精通Java后端开发技术栈，包括数据库、后端框架和系统架构设计
          </p>
        </motion.div>

        {/* 新的轨道技能展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-[450px] mb-12 w-full"
        >
          <SkillOrbit skills={allSkills} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <Server className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">后端开发</h3>
                </div>
                <div className="space-y-3">
                  {backendSkills.map((skill, index) => (
                    <div key={index} className="space-y-1.5">
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
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">数据库</h3>
                </div>
                <div className="space-y-3">
                  {databaseSkills.map((skill, index) => (
                    <div key={index} className="space-y-1.5">
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
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <Layers className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">系统架构</h3>
                </div>
                <div className="space-y-3">
                  {architectureSkills.map((skill, index) => (
                    <div key={index} className="space-y-1.5">
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
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <Terminal className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">开发工具</h3>
                </div>
                <div className="space-y-3">
                  {otherSkills.map((skill, index) => (
                    <div key={index} className="space-y-1.5">
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

