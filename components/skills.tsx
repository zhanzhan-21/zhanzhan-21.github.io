"use client"

import { motion } from "framer-motion"
import { Database, Server, Layers, Terminal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import SkillOrbit from "@/components/3d/SkillOrbit"
import { useState } from "react"

export default function Skills() {
  const [activeTab, setActiveTab] = useState("backend")

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

  // 根据当前选中的标签返回对应的技能数据
  const getActiveSkills = () => {
    switch (activeTab) {
      case "backend": return backendSkills;
      case "database": return databaseSkills;
      case "architecture": return architectureSkills;
      case "tools": return otherSkills;
      default: return backendSkills;
    }
  }

  // 标签配置
  const tabs = [
    { id: "backend", label: "后端开发", icon: <Server className="h-5 w-5" /> },
    { id: "database", label: "数据库", icon: <Database className="h-5 w-5" /> },
    { id: "architecture", label: "系统架构", icon: <Layers className="h-5 w-5" /> },
    { id: "tools", label: "开发工具", icon: <Terminal className="h-5 w-5" /> },
  ]

  return (
    <section id="skills" className="pt-10 pb-10 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-4 relative z-10"
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
          className="h-[450px] mb-10 w-full mt-11"
        >
          <SkillOrbit skills={allSkills} />
        </motion.div>

        {/* 新的紧凑型技能卡片展示区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12"
        >
          <Card className="overflow-hidden shadow-md bg-transparent">
            <div className="flex justify-center flex-wrap border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-5 py-2.5 space-x-2 transition-all text-base font-medium ${
                    activeTab === tab.id
                      ? "bg-transparent text-primary border-b-2 border-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <CardContent className="p-0 bg-transparent">
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {getActiveSkills().map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="flex flex-col items-center p-2 rounded-lg bg-transparent hover:bg-gray-50/40 dark:hover:bg-gray-700/30 transition-all hover:shadow-sm">
                        <div className="relative mb-1.5">
                          {/* 技能图标 */}
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50/80 dark:bg-blue-900/30 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-800/40 transition-all p-2 backdrop-blur-sm">
                            <img 
                              src={skill.icon} 
                              alt={skill.name} 
                              className="w-6 h-6 object-contain" 
                              onError={(e) => { 
                                (e.target as HTMLImageElement).src = "/icons/code.svg"
                              }}
                            />
                          </div>
                          
                          {/* 环形进度条 */}
                          <svg className="absolute top-0 left-0 w-10 h-10 -rotate-90">
                            <circle 
                              cx="20" 
                              cy="20" 
                              r="17" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              fill="transparent"
                              strokeDasharray={`${skill.level * 1.07} 200`}
                              className="text-primary"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        
                        <div className="text-center">
                          <h4 className="text-xs font-medium mt-1">{skill.name}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

