"use client"

import { useEffect } from 'react';

// 定义一个统一的偏移量常量
const SCROLL_OFFSET = 80;

export function SmoothScrollFix() {
  useEffect(() => {
    // 函数用于平滑滚动到指定的哈希锚点
    const smoothScrollToHash = () => {
      // 如果URL中存在哈希
      if (window.location.hash) {
        // 获取目标元素
        const targetId = window.location.hash.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 防止浏览器的默认滚动行为
          if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
          }
          
          // 先取消所有正在进行的滚动动画
          document.body.style.scrollBehavior = 'auto';
          window.scrollTo(0, 0);
          
          // 计算目标位置 - 为了确保精确，多次检查元素位置
          const getTargetPosition = () => {
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return rect.top + scrollTop;
          };
          
          // 使用更可靠的延迟机制，确保页面元素完全加载和布局
          const attemptScroll = (retries = 0, maxRetries = 5) => {
            if (retries > maxRetries) return;
            
            const targetPosition = getTargetPosition();
            
            // 重新启用平滑滚动并滚动到目标位置
            document.body.style.scrollBehavior = 'smooth';
            window.scrollTo({
              top: targetPosition - SCROLL_OFFSET,
              behavior: 'smooth'
            });
            
            // 检查滚动是否准确，如果不准确则尝试再次滚动
            setTimeout(() => {
              const newPosition = getTargetPosition();
              const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
              const expectedPosition = currentScroll + SCROLL_OFFSET;
              
              // 如果位置相差超过5px，重试
              if (Math.abs(newPosition - expectedPosition) > 5) {
                attemptScroll(retries + 1);
              }
            }, 300);
          };
          
          // 尝试滚动，添加延迟以确保DOM完全加载
          setTimeout(() => {
            attemptScroll();
          }, 200);
        }
      }
    };

    // 处理哈希变更事件
    const handleHashChange = (e: HashChangeEvent) => {
      // 阻止默认行为
      e.preventDefault();
      smoothScrollToHash();
    };

    // 初始加载时处理哈希锚点
    if (window.location.hash) {
      // 确保内容完全加载
      if (document.readyState === 'complete') {
        // 使用RAF确保在渲染完成后执行
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            smoothScrollToHash();
          });
        });
      } else {
        // 当DOM内容加载完成后执行
        window.addEventListener('DOMContentLoaded', () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              smoothScrollToHash();
            });
          });
        });
        
        // 备份：如果DOMContentLoaded已错过，使用load事件
        window.addEventListener('load', () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              smoothScrollToHash();
            });
          });
        });
      }
    }

    // 监听哈希变更事件
    window.addEventListener('hashchange', handleHashChange);

    // 清理函数
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('DOMContentLoaded', smoothScrollToHash);
      window.removeEventListener('load', smoothScrollToHash);
    };
  }, []);

  return null;
}

export default SmoothScrollFix; 