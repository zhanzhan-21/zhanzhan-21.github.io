"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { Marquee } from "./ui/marquee";
import { MessageCard } from "./MessageCard";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
};

// GitHub仓库配置
const REPO_OWNER = 'zhanzhan-21';
const REPO_NAME = 'zhanzhan-21.github.io';
const ISSUE_NUMBER = 1;
const GITHUB_ISSUE_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_NUMBER}`;
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`;

// GitHub API返回类型
interface GitHubComment {
  id: number;
  body: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredMessages, setFeaturedMessages] = useState<{
    row1: Message[], 
    row2: Message[]
  }>({
    row1: [],
    row2: []
  });

  // 获取留言列表
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('正在从GitHub获取留言...');
      
      // 直接从GitHub API获取留言数据
      const res = await fetch(GITHUB_API_URL, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error(`GitHub API错误: ${res.status} ${res.statusText}`);
      }
      
      const comments: GitHubComment[] = await res.json();
      console.log('收到GitHub评论数据:', comments.length);
      
      // 解析GitHub评论为留言格式
      const parsedMessages = comments
        .map((comment: GitHubComment) => {
          try {
            // 尝试解析评论内容为JSON
            const messageData = JSON.parse(comment.body);
            return {
              _id: comment.id.toString(),
              name: messageData.name,
              email: messageData.email || "",
              content: messageData.content,
              createdAt: comment.created_at,
              isPublic: true // 直接使用true作为固定值
            } as Message;
          } catch (e) {
            console.log('评论不是JSON格式或字段缺失，作为普通文本处理:', comment.body);
            // 如果不是JSON格式，则直接把评论作为普通文本处理
            return {
              _id: comment.id.toString(),
              name: comment.user?.login || '匿名用户',
              email: '',
              content: comment.body,
              createdAt: comment.created_at,
              isPublic: true
            } as Message;
          }
        })
        .filter((message: Message | null): message is Message => {
          if (message === null || !message.content) return false;
          return typeof message.content === 'string' && message.content.length > 0;
        })  
        .sort((a: Message, b: Message) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // 按时间倒序
        
      setMessages(parsedMessages);
    } catch (err) {
      console.error('获取留言时出错:', err);
      setError(err instanceof Error ? err.message : '获取留言时出错');
    } finally {
      setIsLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 获取随机头像颜色
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-indigo-600",
      "bg-gradient-to-br from-emerald-400 to-teal-600",
      "bg-gradient-to-br from-amber-300 to-orange-500",
      "bg-gradient-to-br from-rose-400 to-red-600",
      "bg-gradient-to-br from-violet-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-fuchsia-600"
    ];
    // 使用名字的首字母作为颜色选择的依据
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  // 生成头像内容
  const getAvatarContent = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // 组件加载时获取留言
  useEffect(() => {
    fetchMessages();
  }, []);

  // 处理精选留言
  useEffect(() => {
    if (messages.length > 0) {
      // 将留言随机分配到两行
      const shuffled = [...messages].sort(() => 0.5 - Math.random());
      
      // 确保至少有8条留言用于轮播效果
      const ensureEnough = (arr: Message[]) => {
        if (arr.length < 4) {
          return [...arr, ...arr, ...arr].slice(0, 4);
        }
        return arr.slice(0, Math.min(8, arr.length));
      };
      
      const half = Math.ceil(shuffled.length / 2);
      setFeaturedMessages({
        row1: ensureEnough(shuffled.slice(0, half)),
        row2: ensureEnough(shuffled.slice(half))
      });
    }
  }, [messages]);

  // 根据用户名确定颜色变体，确保同一用户一致的颜色
  const getRandomColorVariant = (name: string) => {
    const variants = ['blue', 'green', 'yellow', 'red', 'purple', 'pink'] as const;
    // 使用名字的首字母作为颜色选择的依据
    const index = name.charCodeAt(0) % variants.length;
    return variants[index];
  };

  // 处理留言卡片点击
  const handleMessageCardClick = (messageId: string) => {
    // 找到对应元素并滚动到视图
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      // 平滑滚动到元素位置
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
      
      // 添加高亮效果然后淡出 - 使用内联样式而非类，以提高兼容性
      // 保存原始背景色
      const originalBackground = element.style.backgroundColor;
      const originalTransition = element.style.transition;
      
      // 设置高亮和过渡
      element.style.backgroundColor = 'rgba(219, 234, 254, 1)'; // bg-blue-100 equivalent
      element.style.transition = 'background-color 2s ease';
      
      // 2秒后恢复原状
      setTimeout(() => {
        element.style.backgroundColor = originalBackground;
        element.style.transition = originalTransition;
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* 留言说明部分 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="p-6 md:p-8 border-2 border-blue-100 shadow-lg w-full bg-gradient-to-br from-white to-blue-50">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            留言板
          </h2>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" className="flex-shrink-0 mt-0.5 text-blue-600" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>
            <div>
              <p className="text-blue-700 font-medium mb-1">留言存储升级公告</p>
              <p className="text-blue-600">所有留言现在将存储在GitHub Issues中，访问 
                <Link 
                  href={GITHUB_ISSUE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline font-medium hover:text-blue-800 mx-1"
                >
                  留言板数据存储 #1
                </Link>
                可查看所有留言。此升级使博客可以完全部署到GitHub Pages静态网站上。
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <Link 
              href={GITHUB_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              前往GitHub留言
            </Link>
            <p className="text-center text-sm text-gray-500 mt-4">
              由于静态站点限制，留言需要在GitHub上进行<br/>
              GitHub账号登录后即可直接留言
            </p>
          </div>
        </Card>
      </motion.div>
      
      {/* 公开留言轮播展示 - 始终显示这个部分 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <Card className="p-6 md:p-8 border-2 border-blue-100 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
              公开留言
            </h2>
            <Button 
              onClick={fetchMessages} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-sm border-blue-200 hover:bg-blue-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              刷新
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">正在从GitHub加载留言...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-red-100 rounded-lg bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-red-600 font-medium mb-2">留言加载失败</p>
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              <div className="flex gap-4">
                <button 
                  onClick={fetchMessages}
                  className="flex items-center gap-2 text-sm bg-white hover:bg-red-50 py-2 px-4 rounded-md transition-colors border border-red-200 text-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  重新加载
                </button>
                <Link 
                  href={GITHUB_ISSUE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 py-2 px-4 rounded-md transition-colors border border-gray-200 text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  前往GitHub留言
                </Link>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <p className="text-gray-500 mb-2">暂无留言</p>
              <p className="text-gray-400 text-sm mb-4">成为第一个留言的人吧！</p>
              <Link 
                href={GITHUB_ISSUE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-blue-50 py-2 px-4 rounded-md transition-colors border border-gray-200 hover:border-blue-200 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                前往GitHub留言
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-3 rounded-md flex items-center gap-2 text-blue-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                </svg>
                <span>
                  所有留言均存储在 GitHub Issues 中，已公开显示
                </span>
              </div>
              
              {/* 轮播留言区 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  精选留言
                </h3>
                <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 blur-xl"></div>
                  <Marquee className="py-2" pauseOnHover duration={80}>
                    {featuredMessages.row1.map((message, idx) => (
                      <MessageCard 
                        key={`${message._id}-${idx}`}
                        name={message.name}
                        content={message.content}
                        email={message.email}
                        colorVariant={getRandomColorVariant(message.name)}
                        onClick={() => handleMessageCardClick(message._id)}
                      />
                    ))}
                  </Marquee>
                </div>
                
                <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-1 mt-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 blur-xl"></div>
                  <Marquee className="py-2" reverse pauseOnHover duration={100}>
                    {featuredMessages.row2.map((message, idx) => (
                      <MessageCard 
                        key={`${message._id}-${idx}`}
                        name={message.name}
                        content={message.content}
                        email={message.email}
                        colorVariant={getRandomColorVariant(message.name)}
                        onClick={() => handleMessageCardClick(message._id)}
                      />
                    ))}
                  </Marquee>
                </div>
              </div>
              
              {/* 详细留言展示 */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  所有留言 ({messages.length})
                </h3>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message._id} 
                      id={`message-${message._id}`}
                      className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white ${getAvatarColor(message.name)}`}>
                          {getAvatarContent(message.name)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 tracking-tight">{message.name}</h4>
                              {message.email === '' && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full">
                                  GitHub评论
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* 底部操作按钮 */}
          <div className="flex justify-center mt-8 gap-4">
            <Link 
              href={GITHUB_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 py-2 px-4 rounded-md transition-colors border border-gray-200 hover:border-blue-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              在GitHub查看/添加留言
            </Link>
            
            <Button 
              onClick={fetchMessages} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 text-sm border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              刷新留言
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}