"use client"

import { useEffect } from 'react';

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
          
          // 计算目标位置
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop;
          
          // 设置偏移量
          const offset = 80;
          
          // 重新启用平滑滚动并滚动到目标位置
          setTimeout(() => {
            document.body.style.scrollBehavior = 'smooth';
            window.scrollTo({
              top: targetPosition - offset,
              behavior: 'smooth'
            });
          }, 100);
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
      // 等待所有内容加载完成
      if (document.readyState === 'complete') {
        smoothScrollToHash();
      } else {
        window.addEventListener('load', smoothScrollToHash);
      }
    }

    // 监听哈希变更事件
    window.addEventListener('hashchange', handleHashChange);

    // 清理函数
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('load', smoothScrollToHash);
    };
  }, []);

  return null;
}

export default SmoothScrollFix; 