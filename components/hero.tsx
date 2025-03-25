"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin,Mail, Phone, Globe, Github, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Java工程师 | 后端开发工程师"

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            你好，我是<span className="text-primary">展春燕</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 h-8">
            {typedText}
            <span className="animate-pulse">|</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
            专注于构建高性能、可扩展的企业级应用，热衷于技术创新与解决复杂问题。
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>山东德州</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>2001.10.17</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>17852327512</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>17852327512@163.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a href="https://zhanzhan-21.github.io" className="hover:text-primary transition-colors">
                zhanzhan-21.github.io
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <a href="https://github.com/zhanzhan-21" className="hover:text-primary transition-colors">
                github.com/zhanzhan-21
              </a>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild>
              <a href="#contact">联系我</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#projects">查看项目</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block"
        >
          <div className="w-80 h-80 rounded-full bg-primary/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="w-64 h-64 rounded-full bg-primary/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse animation-delay-1000"></div>
          <div className="relative z-10 flex justify-center">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary to-primary-foreground overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
              <img src="/images/profile.jpeg" alt="展春燕" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
