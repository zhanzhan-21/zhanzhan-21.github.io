"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, Tag, Eye, ThumbsUp, ArrowUp, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  date: string
  readTime: string
  tags: string[]
  category: string
  views: number
  likes: number
  featured: boolean
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "从零开始撸一个Spring Boot项目：我是如何被配置文件折磨的",
    summary: "第一次用Spring Boot的时候，我以为这玩意儿真的是开箱即用。结果发现配置比想象中复杂多了...",
    content: "详细内容...",
    date: "2024-12-15",
    readTime: "8分钟",
    tags: ["Spring Boot", "配置管理", "Java", "后端开发"],
    category: "后端开发",
    views: 1250,
    likes: 89,
    featured: true,
    slug: "springboot-configuration-hell"
  },
  {
    id: "2",
    title: "MySQL索引优化：从慢查询到毫秒响应的血泪史",
    summary: "在做课程设计的时候，遇到了一个查询特别慢的问题。从几十秒优化到毫秒级响应，我学会了MySQL索引的精髓...",
    content: "详细内容...",
    date: "2024-12-12",
    readTime: "12分钟",
    tags: ["MySQL", "索引优化", "性能调优", "数据库"],
    category: "数据库",
    views: 1150,
    likes: 95,
    featured: true,
    slug: "mysql-index-optimization-story"
  },
  {
    id: "3",
    title: "Redis缓存雪崩，我是如何在凌晨3点拯救系统的",
    summary: "在做毕业设计项目时，突然发现系统变得特别慢，查了半天才发现是缓存出了问题。这次经历让我深刻理解了缓存的重要性...",
    content: "详细内容...",
    date: "2024-12-10",
    readTime: "15分钟",
    tags: ["Redis", "缓存雪崩", "系统故障", "应急处理"],
    category: "后端开发",
    views: 980,
    likes: 87,
    featured: true,
    slug: "redis-avalanche-rescue"
  },
  {
    id: "4",
    title: "Docker踩坑指南：从菜鸟到老鸟的容器化之路",
    summary: "第一次用Docker的时候，我觉得这玩意儿就是个虚拟机。结果发现我想得太简单了...",
    content: "详细内容...",
    date: "2024-12-08",
    readTime: "12分钟",
    tags: ["Docker", "容器化", "DevOps", "微服务"],
    category: "运维部署",
    views: 890,
    likes: 72,
    featured: false,
    slug: "docker-learning-journey"
  },
  {
    id: "5",
    title: "ElasticSearch搜索引擎：从入门到差点放弃",
    summary: "数据库课程的期末作业要求我们实现一个图书检索系统，老师建议有兴趣的同学可以尝试用ElasticSearch。我当时心想：不就是个搜索嘛，比SQL查询能难到哪去？",
    content: "详细内容...",
    date: "2024-12-05",
    readTime: "15分钟",
    tags: ["ElasticSearch", "搜索引擎", "大数据", "Java"],
    category: "后端开发",
    views: 756,
    likes: 68,
    featured: false,
    slug: "elasticsearch-learning-journey"
  },
  {
    id: "6",
    title: "消息队列RabbitMQ：异步处理的艺术",
    summary: "用了RabbitMQ之后，我终于理解了什么叫'解耦'。以前一个接口卡死，整个系统跟着完蛋...",
    content: "详细内容...",
    date: "2024-12-03",
    readTime: "18分钟",
    tags: ["RabbitMQ", "消息队列", "异步处理", "微服务"],
    category: "后端开发",
    views: 934,
    likes: 81,
    featured: true,
    slug: "rabbitmq-async-processing"
  },
  {
    id: "7",
    title: "Nginx反向代理：从小白到运维老司机",
    summary: "第一次接触Nginx时，我以为就是个Web服务器。后来才发现这玩意儿简直是神器，负载均衡、反向代理、静态资源...无所不能！",
    content: "详细内容...",
    date: "2024-12-01",
    readTime: "16分钟",
    tags: ["Nginx", "反向代理", "负载均衡", "运维"],
    category: "运维部署",
    views: 612,
    likes: 58,
    featured: false,
    slug: "nginx-reverse-proxy-guide"
  },
  {
    id: "8",
    title: "Git版本控制：从删库跑路到版本管理大师",
    summary: "还记得第一次用Git时，我把整个项目搞丢了。那一刻我差点想删库跑路。现在回想起来，那些踩过的坑都是成长的印记...",
    content: "详细内容...",
    date: "2024-11-28",
    readTime: "14分钟",
    tags: ["Git", "版本控制", "团队协作", "开发工具"],
    category: "开发工具",
    views: 703,
    likes: 64,
    featured: false,
    slug: "git-version-control-journey"
  },
  {
    id: "9",
    title: "Maven依赖管理：从依赖地狱到井井有条",
    summary: "Maven依赖冲突曾经让我抓狂，NoClassDefFoundError满天飞。现在我已经是解决依赖冲突的老手了...",
    content: "详细内容...",
    date: "2024-11-25",
    readTime: "13分钟",
    tags: ["Maven", "依赖管理", "构建工具", "Java"],
    category: "开发工具",
    views: 589,
    likes: 52,
    featured: false,
    slug: "maven-dependency-management"
  },
  {
    id: "10",
    title: "JVM调优实战：让你的Java应用飞起来",
    summary: "学习JVM原理的时候，老师总是说\"理论要结合实践\"。直到我的课程项目频繁卡顿，我才真正体会到JVM调优的重要性...",
    content: "详细内容...",
    date: "2024-11-22",
    readTime: "20分钟",
    tags: ["JVM", "性能调优", "垃圾回收", "Java"],
    category: "后端开发",
    views: 823,
    likes: 76,
    featured: true,
    slug: "jvm-tuning-practice"
  },
  {
    id: "11",
    title: "Spring Cloud微服务：从单体地狱到分布式天堂",
    summary: "把一个巨大的单体应用拆分成微服务，这个过程就像做外科手术一样，稍有不慎就会血溅三尺...",
    content: "详细内容...",
    date: "2024-11-20",
    readTime: "22分钟",
    tags: ["Spring Cloud", "微服务", "架构设计", "分布式"],
    category: "后端开发",
    views: 945,
    likes: 89,
    featured: true,
    slug: "spring-cloud-microservices"
  },
  {
    id: "12",
    title: "设计模式实战：23种模式的血泪应用史",
    summary: "学设计模式的时候觉得很牛逼，一个个都记得滚瓜烂熟。真到项目里用的时候才发现：过度设计比没有设计更可怕...",
    content: "详细内容...",
    date: "2024-11-18",
    readTime: "18分钟",
    tags: ["设计模式", "面向对象", "架构设计", "Java"],
    category: "后端开发",
    views: 678,
    likes: 71,
    featured: false,
    slug: "design-patterns-in-practice"
  },
  {
    id: "13",
    title: "MongoDB踩坑记：从关系型到文档型的思维转变",
    summary: "第一次用MongoDB时，我还在想着JOIN和外键。后来发现这种思维简直是自找麻烦...",
    content: "详细内容...",
    date: "2024-11-15",
    readTime: "16分钟",
    tags: ["MongoDB", "文档数据库", "NoSQL", "数据库设计"],
    category: "数据库",
    views: 567,
    likes: 63,
    featured: false,
    slug: "mongodb-learning-curve"
  },
  {
    id: "14",
    title: "RESTful API设计：从混乱到优雅的接口进化论",
    summary: "刚开始设计API的时候，我的接口URL长这样：/getUserByIdAndName。现在想想，那时候的我真是太naive了...",
    content: "详细内容...",
    date: "2024-11-12",
    readTime: "14分钟",
    tags: ["RESTful", "API设计", "后端开发", "接口规范"],
    category: "后端开发",
    views: 892,
    likes: 78,
    featured: true,
    slug: "restful-api-design-evolution"
  },
  {
    id: "15",
    title: "分布式锁：从数据库到Redis的进化之路",
    summary: "第一次遇到并发问题时，我用synchronized解决。后来发现分布式环境下synchronized就是个摆设...",
    content: "详细内容...",
    date: "2024-11-10",
    readTime: "17分钟",
    tags: ["分布式锁", "Redis", "并发控制", "分布式系统"],
    category: "后端开发",
    views: 723,
    likes: 68,
    featured: false,
    slug: "distributed-lock-evolution"
  },
  {
    id: "16",
    title: "Spring Security：从明文密码到OAuth2的安全进化",
    summary: "最开始做登录时，密码直接存数据库。现在想想那时候的我真是初生牛犊不怕虎...",
    content: "详细内容...",
    date: "2024-11-08",
    readTime: "19分钟",
    tags: ["Spring Security", "身份认证", "OAuth2", "安全"],
    category: "后端开发",
    views: 834,
    likes: 82,
    featured: true,
    slug: "spring-security-evolution"
  },
  {
    id: "17",
    title: "线程池调优：从OOM到高效并发的血泪史",
    summary: "第一次用线程池时，我设置了1000个核心线程数。结果系统直接OOM，那一刻我才知道线程不是越多越好...",
    content: "详细内容...",
    date: "2024-11-05",
    readTime: "15分钟",
    tags: ["线程池", "并发编程", "性能调优", "Java"],
    category: "后端开发",
    views: 654,
    likes: 59,
    featured: false,
    slug: "thread-pool-optimization"
  },
  {
    id: "18",
    title: "Kubernetes容器编排：从Docker Compose到K8s的华丽转身",
    summary: "用Docker Compose管理几个容器还挺爽，直到容器数量上百，我才知道什么叫管理地狱...",
    content: "详细内容...",
    date: "2024-11-03",
    readTime: "20分钟",
    tags: ["Kubernetes", "容器编排", "Docker", "DevOps"],
    category: "运维部署",
    views: 789,
    likes: 71,
    featured: false,
    slug: "kubernetes-container-orchestration"
  },
  {
    id: "19",
    title: "CI/CD流水线：从手动部署到自动化发布的解放之路",
    summary: "还记得手动部署的日子，每次发布都要熬夜到凌晨，生怕出问题。现在有了CI/CD，我终于可以安心睡觉了...",
    content: "详细内容...",
    date: "2024-11-01",
    readTime: "16分钟",
    tags: ["CI/CD", "DevOps", "自动化部署", "Jenkins"],
    category: "运维部署",
    views: 598,
    likes: 65,
    featured: false,
    slug: "cicd-pipeline-evolution"
  },
  {
    id: "20",
    title: "Java面试葵花宝典：从菜鸟到Offer收割机的进阶之路",
    summary: "从第一次面试被问HashMap原理时的支支吾吾，到现在能从容回答技术问题，分享一下我的面试准备经验...",
    content: "详细内容...",
    date: "2024-10-28",
    readTime: "25分钟",
    tags: ["面试", "Java", "求职", "技术成长"],
    category: "职场发展",
    views: 1234,
    likes: 156,
    featured: true,
    slug: "java-interview-guide"
  }
]

const categories = ["全部", "后端开发", "数据库", "运维部署", "开发工具", "职场发展"]

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const router = useRouter()

  // 监听滚动，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToHome = () => {
    router.push('/')
    // 使用与导航栏相同的偏移量常量
    const SCROLL_OFFSET = 80
    
    // 延迟一下确保页面已经加载，并且尝试多次直到成功
    const scrollToAbout = (attempts = 0) => {
      const aboutElement = document.getElementById('about')
      if (aboutElement) {
        // 获取当前滚动位置
        const currentScrollPosition = window.scrollY
        // 计算目标元素的绝对位置
        const targetPosition = aboutElement.getBoundingClientRect().top + currentScrollPosition
        
        // 使用相同的偏移量逻辑
        window.scrollTo({
          top: targetPosition - SCROLL_OFFSET,
          behavior: 'smooth'
        })
      } else if (attempts < 10) {
        // 如果还没找到元素，再等一下重试
        setTimeout(() => scrollToAbout(attempts + 1), 200)
      }
    }
    
    setTimeout(() => scrollToAbout(), 200)
  }

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "全部" || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <>
      <div className="space-y-8">
        {/* 搜索和筛选区域 */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索博客文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* 精选文章 */}
        {featuredPosts.length > 0 && selectedCategory === "全部" && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">精选文章</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {featuredPosts.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            精选
                          </Badge>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {post.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 所有文章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: featuredPosts.length > 0 ? 0.2 : 0 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {selectedCategory === "全部" ? "最新文章" : `${selectedCategory}相关文章`}
            <span className="text-lg font-normal text-gray-500 ml-2">
              ({filteredPosts.length} 篇)
            </span>
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                暂无符合条件的文章
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {post.featured && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              精选
                            </Badge>
                          )}
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {post.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 浮动按钮组 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0.8 
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      >
        {/* 回到顶部按钮 */}
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          title="回到顶部"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        {/* 返回主页按钮 */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
          title="返回主页"
          onClick={handleBackToHome}
        >
          <Home className="h-5 w-5" />
        </Button>
      </motion.div>
    </>
  )
} 