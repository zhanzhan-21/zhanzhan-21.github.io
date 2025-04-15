const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// 确保数据目录存在
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`创建数据目录: ${DATA_DIR}`);
    } catch (error) {
      console.error('创建数据目录失败:', error);
      throw error;
    }
  }
}

// 读取消息数据
function readMessages() {
  ensureDataDirectory();
  
  try {
    // 如果文件不存在，返回空数组
    if (!fs.existsSync(MESSAGES_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取消息文件失败:', error);
    // 文件损坏或解析错误时，返回空数组
    return [];
  }
}

// 写入消息数据
function writeMessages(messages) {
  ensureDataDirectory();
  
  try {
    const data = JSON.stringify(messages, null, 2);
    fs.writeFileSync(MESSAGES_FILE, data, 'utf8');
    return true;
  } catch (error) {
    console.error('写入消息文件失败:', error);
    throw error;
  }
}

// 添加新消息
function addMessage(message) {
  const messages = readMessages();
  messages.push(message);
  writeMessages(messages);
  return message;
}

// 获取所有消息
function getAllMessages() {
  return readMessages();
}

// 获取单个消息
function getMessage(id) {
  const messages = readMessages();
  return messages.find(message => message._id === id);
}

// 删除消息
function deleteMessage(id) {
  const messages = readMessages();
  const index = messages.findIndex(message => message._id === id);
  
  if (index === -1) {
    return null;
  }
  
  const deletedMessage = messages.splice(index, 1)[0];
  writeMessages(messages);
  return deletedMessage;
}

module.exports = {
  readMessages,
  writeMessages,
  addMessage,
  getAllMessages,
  getMessage,
  deleteMessage
}; 