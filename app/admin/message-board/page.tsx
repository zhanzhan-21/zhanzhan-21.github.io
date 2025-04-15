"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { toast } from "sonner";
import { Switch } from "../../../components/ui/switch";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
};

export default function AdminMessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    private: 0,
  });

  // 获取所有留言
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      
      // 检查响应类型
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('API返回了非JSON响应:', text);
        toast.error('API返回格式错误，请检查控制台');
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.data);
        setStats({
          total: data.data.length,
          public: data.publicCount,
          private: data.privateCount
        });
      } else {
        console.error('获取留言失败:', data.message);
        console.error('错误详情:', data.error);
        if (data.stack) console.error('错误堆栈:', data.stack);
        toast.error(`获取留言失败: ${data.message || '未知错误'}`);
      }
    } catch (error: any) {
      console.error('获取留言出错:', error);
      console.error('错误消息:', error.message);
      if (error.stack) console.error('错误堆栈:', error.stack);
      toast.error(`获取留言失败: ${error.message || '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除留言
  const deleteMessage = async (id: string) => {
    if (confirm('确定要删除这条留言吗？此操作不可撤销。')) {
      try {
        const res = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (data.success) {
          toast.success('留言已成功删除');
          // 更新状态，移除已删除的留言
          setMessages(messages.filter(msg => msg._id !== id));
          // 更新统计信息
          setStats(prev => ({
            total: prev.total - 1,
            public: data.data.isPublic ? prev.public - 1 : prev.public,
            private: !data.data.isPublic ? prev.private - 1 : prev.private
          }));
        } else {
          toast.error(`删除失败: ${data.message}`);
        }
      } catch (error: any) {
        console.error('删除留言失败:', error);
        toast.error(`删除失败: ${error.message || '未知错误'}`);
      }
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

  // 组件加载时获取留言
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* 返回按钮和标题 */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            返回主页
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center">留言管理</h1>
        <div className="w-[105px]"></div> {/* 占位元素，保持标题居中 */}
      </div>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-blue-50">
          <h3 className="text-lg font-medium">总留言数</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <h3 className="text-lg font-medium">公开留言</h3>
          <p className="text-3xl font-bold">{stats.public}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <h3 className="text-lg font-medium">非公开留言</h3>
          <p className="text-3xl font-bold">{stats.private}</p>
        </Card>
      </div>
      
      {/* 留言列表 */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">留言列表</h2>
          <Button onClick={fetchMessages} disabled={isLoading}>
            {isLoading ? '加载中...' : '刷新'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无留言</div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message._id} className={`p-4 rounded-lg ${message.isPublic ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{message.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${message.isPublic ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {message.isPublic ? '公开' : '非公开'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={() => deleteMessage(message._id)}>
                        删除
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">邮箱：{message.email}</p>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{message.content}</p>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
} 