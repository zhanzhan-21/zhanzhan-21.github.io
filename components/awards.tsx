"use client"

import { motion } from "framer-motion"
import { Award, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Awards() {
  const awards = [
    {
      title: '"华为杯"中国研究生数学建模竞赛 二等奖',
      date: "2023",
      level: "国家级",
    },
    {
      title: '"华为杯"中国研究生数学建模竞赛 三等奖',
      date: "2022",
      level: "国家级",
    },
    {
      title: "山东大学创新创业活动先进个人",
      date: "2023",
      level: "校级",
    },
    {
      title: "山东大学2023年度优秀研究生",
      date: "2023",
      level: "校级",
    },
    {
      title: "山东大学2022年度硕士新生二等学业奖学金",
      date: "2022",
      level: "校级",
    },
    {
      title: "优秀毕业生",
      date: "2023",
      level: "校级",
    },
    {
      title: "全国大学生数学建模竞赛西北赛区二等奖",
      date: "2021",
      level: "省级",
    },
  ]

  return (
    <section id="awards" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">荣誉奖励</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">我在学术和专业领域获得的一些荣誉和奖项</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Award className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{award.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{award.date}</span>
                      </div>
                      <Badge variant="outline">{award.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

