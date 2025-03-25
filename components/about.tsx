"use client"

import { motion } from "framer-motion"
import { GraduationCap, MapPin, Mail, Phone, Globe, Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">关于我</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            专注于构建高性能、可扩展的企业级应用，热衷于技术创新与工程实践。致力于打造优质的用户体验和可靠的系统架构。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">教育背景</h3>
                </div>
                <div className="space-y-6 flex-grow">
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">山东大学</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2023.09 - 2026.06</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">硕士研究生</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">平均绩点：3.9</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">发表SCI二区文章一篇：<a href="http." className="text-primary hover:text-primary/80">链接待更新</a></p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">青岛大学</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2019.09 - 2023.06</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">计算机科学与技术</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">平均绩点：3.8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">个人信息</h3>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">籍贯：山东德州</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">邮箱：17852327512@163.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">电话：17852327512</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <a href="https://zhanzhan-21.github.io" className="text-primary hover:text-primary/80">zhanzhan-21.github.io</a>
                  </div>
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <a href="https://github.com/zhanzhan-21" className="text-primary hover:text-primary/80">github.com/zhanzhan-21</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
