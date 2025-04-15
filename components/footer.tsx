import { Mail, Phone, Github, Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">展春燕</h3>
            <p className="mb-4 text-gray-300 max-w-md">Java工程师 | 后端开发工程师</p>
            <div className="flex flex-col space-y-2 text-gray-300">
              <div className="flex items-center">
                <Phone className="h-6 w-6 mr-3 text-primary" />
                <span>17852327512</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                <span>17852327512@163.com</span>
              </div>
              <div className="flex items-center">
                <img src="/展.svg" className="h-6 w-6 mr-3 text-primary" />
                <a href="https://zhanzhan-21.github.io" className="hover:text-primary transition-colors">
                  zhanzhan-21.github.io
                </a>
              </div>
              <div className="flex items-center">
                <Github className="h-6 w-6 mr-3 text-primary" />
                <a href="https://github.com/zhanzhan-21" className="hover:text-primary transition-colors">
                  github.com/zhanzhan-21
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">联系我</h3>
            <p className="text-gray-300 mb-4">如果您对我的经历和技能感兴趣，欢迎随时联系我，我期待与您的交流！</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} 展春燕. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

