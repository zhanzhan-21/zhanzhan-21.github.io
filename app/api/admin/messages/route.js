import { NextResponse } from 'next/server';
import { getAllMessages } from '../../../../lib/jsonStorage';

// 配置此路由为完全动态，允许在静态导出中使用
export const dynamic = 'force-dynamic';

/**
 * 获取所有留言（包括非公开的）
 * 注意：实际项目中应添加认证和授权检查
 */
export async function GET(request) {
  try {
    console.log('开始获取全部留言（管理员接口）...');
    
    // 此处应添加认证检查代码
    // TODO: 添加管理员认证逻辑
    
    const messages = getAllMessages();
    
    // 按时间倒序排列所有留言（包括非公开的）
    const allMessages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`查询成功，共找到 ${allMessages.length} 条留言`);
    
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        data: allMessages,
        publicCount: allMessages.filter(msg => msg.isPublic).length,
        privateCount: allMessages.filter(msg => !msg.isPublic).length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('获取管理员留言列表失败:', error);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: '获取管理员留言列表失败', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 