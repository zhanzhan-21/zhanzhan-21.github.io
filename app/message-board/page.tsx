import MessageBoard from "../../components/MessageBoard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: '留言板 - 个人博客',
  description: '欢迎在留言板上留下您的想法和建议',
};

export default function MessageBoardPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-full">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            返回主页
          </Link>
        </div>
        <MessageBoard />
      </div>
    </div>
  );
} 