import { NextResponse } from 'next/server';
import { getMessage, deleteMessage } from '../../../../lib/jsonStorage';

// 配置此路由为完全动态，允许在静态导出中使用
export const dynamic = 'force-dynamic';

/**
 * 获取单个留言
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`尝试获取ID为${id}的留言`);

    // 使用jsonStorage模块获取留言
    const message = getMessage(id);
    
    if (!message) {
      console.log(`未找到ID为${id}的留言`);
      return new NextResponse(
        JSON.stringify({ success: false, message: '留言不存在' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    console.log(`成功找到ID为${id}的留言`);
    return new NextResponse(
      JSON.stringify({ success: true, data: message }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('获取留言详情失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: '获取留言详情失败',
        error: error.message
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
 * 删除留言
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`尝试删除ID为${id}的留言`);
    
    // 使用jsonStorage模块删除留言
    const deletedMessage = deleteMessage(id);
    
    if (!deletedMessage) {
      console.log(`未找到ID为${id}的留言`);
      return new NextResponse(
        JSON.stringify({ success: false, message: '留言不存在' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    console.log(`成功删除ID为${id}的留言`);
    
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: '留言已成功删除',
        data: deletedMessage
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('删除留言失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: '删除留言失败',
        error: error.message 
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