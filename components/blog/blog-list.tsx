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
    title: "匠码社区项目中的消息队列实践",
    summary: "在匠码社区项目中，我负责实现了基于RabbitMQ的消息队列系统，用于处理用户评论、点赞、收藏等异步操作。本文分享在实际项目中应用消息队列的经验和遇到的问题。",
    content: "详细内容...",
    date: "2025-03-15",
    readTime: "12分钟",
    tags: ["RabbitMQ", "消息队列", "Java", "Spring Boot", "异步处理"],
    category: "后端开发",
    views: 1250,
    likes: 89,
    featured: true,
    slug: "rabbitmq-practice-in-paicoding"
  },
  {
    id: "2",
    title: "线上便利店项目中的缓存架构优化",
    summary: "在线上便利店项目中，我负责设计了多级缓存架构，解决了热门商品数据的高并发访问问题。本文分享缓存设计思路和实现细节。",
    content: "详细内容...",
    date: "2025-07-10",
    readTime: "15分钟",
    tags: ["Redis", "Caffeine", "缓存架构", "高并发", "Java"],
    category: "后端开发",
    views: 1150,
    likes: 95,
    featured: true,
    slug: "cache-architecture-optimization"
  },
  {
    id: "3",
    title: "基于ThreadLocal的线程隔离上下文设计",
    summary: "在技术派社区项目中，我使用ThreadLocal实现了线程隔离的用户上下文，减少了数据库查询次数，提升了系统性能。本文分享实现思路和注意事项。",
    content: "详细内容...",
    date: "2025-04-05",
    readTime: "10分钟",
    tags: ["ThreadLocal", "线程隔离", "用户上下文", "Java", "性能优化"],
    category: "后端开发",
    views: 980,
    likes: 87,
    featured: true,
    slug: "threadlocal-user-context"
  },
  {
    id: "4",
    title: "基于雪花算法的分布式ID生成方案设计与实现",
    summary: "在线上便利店项目中，我设计并实现了一套基于雪花算法的分布式ID生成方案，解决了分布式环境下的ID唯一性和可追溯性问题。本文分享设计思路和实现细节。",
    content: "详细内容...",
    date: "2025-06-28",
    readTime: "8分钟",
    tags: ["雪花算法", "分布式ID", "Java", "高并发", "系统设计"],
    category: "后端开发",
    views: 856,
    likes: 72,
    featured: false,
    slug: "snowflake-distributed-id-generation"
  },
  {
    id: "5",
    title: "基于EasyExcel的异步文件导出优化实践",
    summary: "在线上便利店项目中，我使用EasyExcel实现了异步文件导出功能，解决了大文件导出时的内存溢出和长时间等待问题。本文分享实现思路和性能优化方案。",
    content: "详细内容...",
    date: "2025-07-25",
    readTime: "10分钟",
    tags: ["EasyExcel", "异步处理", "文件导出", "性能优化", "Java"],
    category: "后端开发",
    views: 723,
    likes: 65,
    featured: false,
    slug: "easyexcel-async-export-optimization"
  },
  {
    id: "6",
    title: "Redis ZSet在用户活跃度排行中的应用实践",
    summary: "在技术派社区项目中，我使用Redis ZSet实现了用户活跃度排行功能，并通过先写MySQL再删除Redis的方案保证了高并发场景下的缓存一致性。本文分享实现思路和优化方案。",
    content: "详细内容...",
    date: "2025-05-20",
    readTime: "11分钟",
    tags: ["Redis", "ZSet", "排行榜", "缓存一致性", "高并发"],
    category: "后端开发",
    views: 892,
    likes: 78,
    featured: true,
    slug: "redis-zset-user-ranking-system"
  }
]

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [sortBy, setSortBy] = useState<"date" | "views" | "likes">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const router = useRouter()

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = ["全部", ...new Set(blogPosts.map(post => post.category))]
    return cats
  }, [])

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [])

  // 过滤和排序博客文章
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "全部" || post.category === selectedCategory
      const matchesFeatured = !showFeaturedOnly || post.featured
      
      return matchesSearch && matchesCategory && matchesFeatured
    })

    // 排序
    filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case "views":
          aValue = a.views
          bValue = b.views
          break
        case "likes":
          aValue = a.likes
          bValue = b.likes
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, sortOrder, showFeaturedOnly])

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("全部")
    setSortBy("date")
    setSortOrder("desc")
    setShowFeaturedOnly(false)
  }

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 监听滚动事件，显示/隐藏回到顶部按钮
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="space-y-8">
      {/* 搜索和筛选区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* 搜索框 */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索文章标题、内容或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 高级筛选 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* 排序 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "views" | "likes")}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value="date">发布时间</option>
              <option value="views">阅读量</option>
              <option value="likes">点赞数</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1"
            >
              <ArrowUp className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
            </Button>
          </div>
          
          {/* 精选文章 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm text-gray-600 dark:text-gray-400">
              仅显示精选文章
            </label>
          </div>
          
          {/* 重置按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="ml-auto"
          >
            重置筛选
          </Button>
        </div>
      </div>

      {/* 搜索结果统计 */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          找到 {filteredPosts.length} 篇文章
          {searchTerm && ` (搜索: "${searchTerm}")`}
        </p>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            返回主页
          </Button>
        </Link>
      </div>

      {/* 博客文章列表 */}
      <div className="grid gap-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => router.push(`/blog/${post.slug}`)}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* 文章信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.featured && (
                        <Badge variant="default" className="text-xs">
                          精选
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.summary}
                    </p>
                    
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* 文章元信息 */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 无搜索结果 */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            没有找到相关文章
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            尝试调整搜索条件或筛选条件
          </p>
          <Button onClick={resetFilters}>
            重置筛选条件
          </Button>
        </div>
      )}

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  )
} 