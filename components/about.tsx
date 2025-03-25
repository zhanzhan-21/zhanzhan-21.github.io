"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Bike, Gamepad} from "lucide-react"
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
                    <p className="text-gray-600 dark:text-gray-300 text-sm">硕士 控制工程</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">平均绩点：3.9</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">发表SCI二区文章一篇：<a href="https://www.sciencedirect.com/science/article/pii/S0263224125005731" className="text-primary hover:text-primary/80">文章链接</a></p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">青岛大学</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2019.09 - 2023.06</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">本科 自动化</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">排名：2/100 保研</p>
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
                  <BookOpen className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">个人简介</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    我是一名专注于Java后端开发的工程师，拥有扎实的计算机科学基础和丰富的项目经验。
                    在学习和工作中，我不断探索新技术，提升自己的技术能力和解决问题的能力。
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    我热爱编程，善于团队协作，能够快速适应新环境和新技术。
                    我的目标是成为一名优秀的后端架构师，为用户提供高效、稳定的系统解决方案。
                  </p>
                  </div>

                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">兴趣爱好</h4>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M17 3h.2c.5 0 .9.4.9.9v16.2c0 .5-.4.9-.9.9H17"></path>
                          <path d="M10 8V6c0-1.1.9-2 2-2h3"></path>
                          <path d="M21 12H7a2 2 0 0 0-2 2v4"></path>
                          <path d="M11 12V3"></path>
                          <path d="M7 19a2 2 0 0 1-2-2"></path>
                          <path d="M14 6c0-1.1.9-2 2-2"></path>
                          <circle cx="5" cy="19" r="2"></circle>
                        </svg>
                  </div>
                      <span className="text-sm">羽毛球</span>
                  </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M2 12h20"></path>
                          <path d="M16 12V8a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v4"></path>
                          <path d="M7 16a2 2 0 0 0 2 2h.5"></path>
                          <path d="M14.5 18H15a2 2 0 0 0 2-2"></path>
                          <path d="M8 7h8"></path>
                          <path d="M8 10h8"></path>
                          <path d="m17 6-1-4"></path>
                          <path d="m8 6 1-4"></path>
                          <path d="M12 16v4"></path>
                          <path d="M10 22h4"></path>
                        </svg>
                  </div>
                      <span className="text-sm">游泳</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                        <Bike className="text-primary" />
                      </div>
                      <span className="text-sm">骑行</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                        <Gamepad className="text-primary" />
                      </div>
                      <span className="text-sm">Switch</span>
                    </div>
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

