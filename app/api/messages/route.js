import { NextResponse } from 'next/server';
import { getAllMessages, addMessage } from '../../../lib/githubIssueStorage';

// 配置此路由为完全动态，允许在静态导出中使用
export const dynamic = 'force-dynamic';

/**
 * 获取所有公开留言
 */
export async function GET(request) {
  try {
    console.log('开始获取留言...');
    
    const messages = await getAllMessages();
    
    // 筛选公开留言并按时间倒序排列
    const publicMessages = messages
      .filter(message => message.isPublic)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`查询成功，共找到 ${publicMessages.length} 条公开留言`);
    
    // 在响应中显式设置内容类型
    return new NextResponse(
      JSON.stringify({ success: true, data: publicMessages }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('获取留言失败，详细错误:', error);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: '获取留言失败', 
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

/**
 * 提交新留言
 */
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('收到新留言:', body);
    
    // 基本验证
    if (!body.name || !body.email || !body.content) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: '表单验证失败', 
          errors: {
            name: !body.name ? '请输入姓名' : undefined,
            email: !body.email ? '请输入邮箱' : undefined,
            content: !body.content ? '请输入留言内容' : undefined
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // 创建新留言
    const newMessage = {
      _id: Date.now().toString(), // 这个ID会在保存到GitHub后被替换
      name: body.name,
      email: body.email,
      content: body.content,
      createdAt: new Date().toISOString(),
      isPublic: body.isPublic === true
    };
    
    // 添加新留言
    try {
      const savedMessage = await addMessage(newMessage);
      console.log('新留言已保存到GitHub Issue');
      
      return new NextResponse(
        JSON.stringify({ success: true, data: savedMessage }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      throw new Error(`保存留言失败: ${error.message}`);
    }
  } catch (error) {
    console.error('提交留言失败:', error);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    return new NextResponse(
      JSON.stringify({ success: false, message: '提交留言失败', error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 