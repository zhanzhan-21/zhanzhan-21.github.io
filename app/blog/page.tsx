import BlogList from "@/components/blog/blog-list"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "技术博客 - 分享编程经验与技术见解",
  description: "专注于Java后端开发、微服务架构、深度学习等技术领域的原创博客文章",
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回主页
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              技术博客
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              分享我在软件开发、系统架构、算法研究等领域的经验与思考，
              致力于与技术社区共同成长。
            </p>
          </div>
          
          <BlogList />
        </div>
      </div>
    </main>
  )
} 