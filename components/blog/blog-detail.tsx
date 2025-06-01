"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Eye, ThumbsUp, Share2, Bookmark, ArrowUp, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
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

interface BlogDetailProps {
  post: BlogPost
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(post.likes)
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

  const handleLike = () => {
    if (liked) {
      setCurrentLikes(prev => prev - 1)
    } else {
      setCurrentLikes(prev => prev + 1)
    }
    setLiked(!liked)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        })
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href)
        // 这里可以添加一个提示消息
        alert("链接已复制到剪贴板")
      }
    } catch (error) {
      console.error("分享失败:", error)
    }
  }

  // 简单的markdown转HTML函数
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```/g, '').trim()
        return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">${code}</code></pre>`
      })
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="ghost" size="icon" className="rounded-full" title="返回博客列表">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" className="gap-2" onClick={handleBackToHome}>
                <Home className="h-5 w-5" />
                返回主页
              </Button>
            </div>
          </motion.div>

          {/* 文章内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                {/* 文章头部 */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    {post.featured && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        精选
                      </Badge>
                    )}
                    <Badge variant="outline">{post.category}</Badge>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {post.title}
                  </h1>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {post.summary}
                  </p>

                  {/* 文章元信息 */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
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
                      <span>{post.views} 次浏览</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{currentLikes} 个赞</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-4 mb-8">
                    <Button
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {liked ? "已点赞" : "点赞"}
                    </Button>
                    <Button
                      variant={bookmarked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookmarked(!bookmarked)}
                      className="gap-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      {bookmarked ? "已收藏" : "收藏"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      分享
                    </Button>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 分割线 */}
                <div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>

                {/* 文章正文 */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: `<p class="mb-4">${formatContent(post.content)}</p>` 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 底部返回按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Link href="/blog">
                    <Button variant="default" size="icon" className="rounded-full" title="返回博客列表">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="gap-2" onClick={handleBackToHome}>
                    <Home className="h-5 w-5" />
                    返回主页
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 相关文章推荐 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">你可能还喜欢</h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  更多精彩文章正在准备中...
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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
        
        {/* 快速返回按钮 */}
        <div className="flex flex-col gap-2">
          <Link href="/blog">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              title="返回博客列表"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
            title="返回主页"
            onClick={handleBackToHome}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 