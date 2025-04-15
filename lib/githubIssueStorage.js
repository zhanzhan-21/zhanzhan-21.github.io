/**
 * GitHub Issues 存储模块 - 使用GitHub Issues作为数据库存储留言
 * 
 * 这个模块将替代原来的jsonStorage.js，改用GitHub Issues API存储留言数据
 * 每个留言会作为GitHub Issue的一个评论保存
 */

// 从环境变量获取配置
const REPO_OWNER = process.env.ISSUE_REPO_OWNER || 'zhanzhan-21';  // GitHub用户名
const REPO_NAME = process.env.ISSUE_REPO_NAME || 'zhanzhan-21.github.io';  // 仓库名
const ISSUE_NUMBER = process.env.ISSUE_NUMBER || 1;  // Issue编号

// GitHub API基础URL
const API_BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

/**
 * 获取GitHub API访问令牌
 * 可以从环境变量或存储的配置中获取
 */
function getGitHubToken() {
  // 从环境变量获取GitHub令牌
  return process.env.GITHUB_TOKEN;
}

/**
 * 从GitHub Issue评论中获取所有留言
 * @returns {Promise<Array>} 留言数组
 */
async function getAllMessages() {
  try {
    // 获取Issue的所有评论
    console.log(`正在从GitHub获取留言，API地址: ${API_BASE_URL}/issues/${ISSUE_NUMBER}/comments`);
    
    const response = await fetch(`${API_BASE_URL}/issues/${ISSUE_NUMBER}/comments?per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 如果是公开仓库的公开Issue，可以不提供token
        ...(getGitHubToken() ? { 'Authorization': `token ${getGitHubToken()}` } : {})
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API错误: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const comments = await response.json();
    console.log(`GitHub返回了${comments.length}条评论`);
    
    // 将GitHub评论转换为留言格式
    const messages = comments.map(comment => {
      try {
        // 评论内容应该是一个JSON字符串，包含留言信息
        const messageData = JSON.parse(comment.body);
        return {
          _id: comment.id.toString(),
          name: messageData.name,
          email: messageData.email,
          content: messageData.content,
          createdAt: comment.created_at,
          isPublic: messageData.isPublic
        };
      } catch (e) {
        console.error('解析评论失败:', e, '评论内容:', comment.body);
        return null;
      }
    }).filter(message => message !== null);

    console.log(`成功解析了${messages.length}条留言`);
    return messages;
  } catch (error) {
    console.error('获取留言失败:', error);
    return [];
  }
}

/**
 * 添加新留言
 * @param {Object} message 留言对象
 * @returns {Promise<Object>} 添加的留言
 */
async function addMessage(message) {
  if (!getGitHubToken()) {
    console.error('缺少GitHub访问令牌，无法添加留言');
    throw new Error('添加留言需要GitHub访问令牌，请在环境变量中设置GITHUB_TOKEN');
  }

  try {
    console.log(`正在添加留言到GitHub Issue #${ISSUE_NUMBER}`);
    
    // 创建Issue评论
    const response = await fetch(`${API_BASE_URL}/issues/${ISSUE_NUMBER}/comments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Authorization': `token ${getGitHubToken()}`
      },
      body: JSON.stringify({ 
        body: JSON.stringify(message) 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API错误: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const comment = await response.json();
    console.log(`留言成功添加，GitHub评论ID: ${comment.id}`);
    
    // 返回添加的留言，设置ID为GitHub评论ID
    return {
      ...message,
      _id: comment.id.toString()
    };
  } catch (error) {
    console.error('添加留言失败:', error);
    throw error;
  }
}

/**
 * 删除留言
 * @param {string} id 留言ID
 * @returns {Promise<boolean>} 是否删除成功
 */
async function deleteMessage(id) {
  if (!getGitHubToken()) {
    throw new Error('删除留言需要GitHub访问令牌');
  }

  try {
    // 删除Issue评论
    const response = await fetch(`${API_BASE_URL}/issues/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${getGitHubToken()}`
      }
    });

    return response.status === 204; // GitHub API 删除成功返回204
  } catch (error) {
    console.error('删除留言失败:', error);
    return false;
  }
}

/**
 * 获取单个留言
 * @param {string} id 留言ID
 * @returns {Promise<Object|null>} 留言对象
 */
async function getMessage(id) {
  try {
    // 获取单个评论
    const response = await fetch(`${API_BASE_URL}/issues/comments/${id}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(getGitHubToken() ? { 'Authorization': `token ${getGitHubToken()}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API错误: ${response.status} ${response.statusText}`);
    }

    const comment = await response.json();
    
    try {
      // 解析评论内容
      const messageData = JSON.parse(comment.body);
      return {
        _id: comment.id.toString(),
        name: messageData.name,
        email: messageData.email,
        content: messageData.content,
        createdAt: comment.created_at,
        isPublic: messageData.isPublic
      };
    } catch (e) {
      console.error('解析评论失败:', e);
      return null;
    }
  } catch (error) {
    console.error('获取留言失败:', error);
    return null;
  }
}

module.exports = {
  getAllMessages,
  addMessage,
  getMessage,
  deleteMessage
}; 