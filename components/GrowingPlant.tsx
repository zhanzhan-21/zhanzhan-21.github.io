'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from "next-themes";

const GrowingPlant: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const wasScrollingRef = useRef(false);
  const lastScrollY = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  
  // 使用防抖函数来避免过多的重渲染
  const debounce = (fn: Function, ms = 100) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), ms);
    };
  };

  useEffect(() => {
    // 更新滚动进度的函数
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // 防止除以零
      if (documentHeight <= windowHeight) {
        setScrollProgress(0);
        return;
      }
      
      // 计算滚动进度，范围从0到1
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(Math.min(Math.max(0, progress), 1));
      
      // 标记正在滚动
      wasScrollingRef.current = true;
      lastScrollY.current = scrollTop;
      
      // 如果存在先前的动画帧请求，则取消它
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // 设置新的动画帧，确保UI更新是平滑的
      animationRef.current = requestAnimationFrame(() => {
        animationRef.current = null;
      });
    };
    
    // 滚动停止检测
    const scrollStopDetection = debounce(() => {
      wasScrollingRef.current = false;
    }, 150);

    // 添加滚动事件监听器
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('scroll', scrollStopDetection, { passive: true });
    
    // 初始化时计算一次
    updateScrollProgress();
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('scroll', scrollStopDetection);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 植物各部分显示的计算 - 增加茎的高度
  const stemHeight = Math.max(0, scrollProgress * 70); // 增加茎的最大高度
  const leafOpacity1 = scrollProgress > 0.3 ? Math.min(1, (scrollProgress - 0.3) * 5) : 0; // 第一片叶子提前出现
  const leafOpacity2 = scrollProgress > 0.45 ? Math.min(1, (scrollProgress - 0.45) * 5) : 0; // 第二片叶子稍后出现
  const leafOpacity3 = scrollProgress > 0.6 ? Math.min(1, (scrollProgress - 0.6) * 5) : 0; // 第三片叶子再后出现
  const flowerOpacity = scrollProgress > 0.75 ? Math.min(1, (scrollProgress - 0.75) * 5) : 0; // 花朵最后出现
  
  const leafScale1 = scrollProgress > 0.3 ? Math.min(1, (scrollProgress - 0.3) * 5) : 0;
  const leafScale2 = scrollProgress > 0.45 ? Math.min(1, (scrollProgress - 0.45) * 5) : 0;
  const leafScale3 = scrollProgress > 0.6 ? Math.min(1, (scrollProgress - 0.6) * 5) : 0;
  const flowerScale = scrollProgress > 0.75 ? Math.min(1, (scrollProgress - 0.75) * 5) : 0; // 花朵比例保持不变
  
  // 旋转角度计算 - 随着滚动轻微旋转
  const flowerRotation = scrollProgress > 0.75 ? (scrollProgress - 0.75) * 15 : 0; // 最大旋转15度
  
  // 花朵呼吸动画
  const flowerBreathing = scrollProgress > 0.75 ? Math.sin(Date.now() * 0.003) * 0.05 + 1 : 1;

  // 根据主题设置颜色
  const stemColor = theme === 'dark' ? '#5CCD80' : '#7ADF9C';
  const potColor = theme === 'dark' ? '#EF5A45' : '#F56E59';
  const potDarkColor = theme === 'dark' ? '#D9362A' : '#E04E3D'; // 花盆阴影色
  const potLightColor = theme === 'dark' ? '#FF6B5B' : '#FF8373'; // 花盆高光色
  const potPatternColor = theme === 'dark' ? '#FFD0C9' : '#FFE5E1'; // 花盆装饰色
  
  // 更丰富的花朵颜色
  const petalColor = theme === 'dark' ? '#FF8FB1' : '#FF9EC4'; // 主花瓣颜色
  const petalInnerColor = theme === 'dark' ? '#FFAEC9' : '#FFD0E0'; // 内层花瓣颜色
  const petalOuterColor = theme === 'dark' ? '#FF6B9D' : '#FF8FB1'; // 外层花瓣颜色
  const petalTipColor = theme === 'dark' ? '#FF1493' : '#FF69B4'; // 花瓣尖端颜色
  
  const centerColor = theme === 'dark' ? '#473366' : '#5D4481'; // 花朵中心颜色 
  const centerBrightColor = theme === 'dark' ? '#B7A6ED' : '#D6C9FF'; // 花朵中心亮色部分
  const centerGlowColor = theme === 'dark' ? '#E6D7FF' : '#F0E6FF'; // 中心光晕颜色
  
  const soilColor = theme === 'dark' ? '#6A351F' : '#8B4513';
  const soilLightColor = theme === 'dark' ? '#8B5D40' : '#A0692C'; // 土壤高光色
  const leafColor = theme === 'dark' ? '#4CAF50' : '#6ECF73';
  const leafDarkColor = theme === 'dark' ? '#388E3C' : '#4CAF50';
  const leafLightColor = theme === 'dark' ? '#81C784' : '#A5D6A7'; // 叶子亮色部分

  return (
    <div className="fixed right-5 bottom-0 z-[9999] hidden md:block pointer-events-none">
      <div className="relative w-40 h-[65vh]"> {/* 增加容器高度 */}
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 224 240" // 增加视图高度
          width="224" 
          height="240" // 增加SVG高度
          className="absolute bottom-0 right-0"
          style={{
            transition: 'transform 0.3s ease-out',
            transform: scrollProgress > 0 ? `rotate(${scrollProgress * 2}deg)` : 'none',
          }}
        >
          <defs>
            {/* 花瓣渐变 - 更丰富的层次 */}
            <radialGradient id="petalGradient" cx="0.5" cy="0.5" r="0.5" spreadMethod="pad">
              <stop offset="0%" stopColor={petalInnerColor} />
              <stop offset="40%" stopColor={petalColor} />
              <stop offset="80%" stopColor={petalOuterColor} />
              <stop offset="100%" stopColor={petalTipColor} />
            </radialGradient>
            
            {/* 花瓣内层渐变 */}
            <radialGradient id="petalInnerGradient" cx="0.5" cy="0.5" r="0.5" spreadMethod="pad">
              <stop offset="0%" stopColor="#FFE5F0" />
              <stop offset="60%" stopColor={petalInnerColor} />
              <stop offset="100%" stopColor={petalColor} />
            </radialGradient>
            
            {/* 花瓣外层渐变 */}
            <radialGradient id="petalOuterGradient" cx="0.5" cy="0.5" r="0.5" spreadMethod="pad">
              <stop offset="0%" stopColor={petalColor} />
              <stop offset="70%" stopColor={petalOuterColor} />
              <stop offset="100%" stopColor={petalTipColor} />
            </radialGradient>
            
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={leafLightColor} />
              <stop offset="100%" stopColor={leafColor} />
            </linearGradient>
            
            <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={potLightColor} />
              <stop offset="70%" stopColor={potColor} />
              <stop offset="100%" stopColor={potDarkColor} />
            </linearGradient>
            
            <radialGradient id="soilGradient" cx="0.5" cy="0.5" r="0.6" spreadMethod="pad">
              <stop offset="0%" stopColor={soilLightColor} />
              <stop offset="100%" stopColor={soilColor} />
            </radialGradient>
            
            {/* 花朵中心光晕 */}
            <radialGradient id="centerGlowGradient" cx="0.5" cy="0.5" r="0.5" spreadMethod="pad">
              <stop offset="0%" stopColor={centerGlowColor} />
              <stop offset="50%" stopColor={centerBrightColor} />
              <stop offset="100%" stopColor={centerColor} />
            </radialGradient>
          </defs>
          
          <g className="flower" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeMiterlimit="10">
            {/* 花盆 - 更大更美观的设计 */}
            <g className="flower__pot">
              {/* 花盆底部 */}
              <path 
                fill="url(#potGradient)" 
                stroke={potDarkColor} 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
                d="M100 198h41v14c0 11-9.2 19-20.5 19h0c-11.3 0-20.5-8-20.5-19v-14z" 
              />
              
              {/* 花盆顶部边缘 */}
              <path 
                fill="url(#potGradient)" 
                stroke={potDarkColor} 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
                d="M98 193h45v5h-45z" 
              />
              
              {/* 添加土壤 - 更自然的形状 */}
              <path 
                fill="url(#soilGradient)"
                stroke={soilColor}
                strokeWidth="0.8" 
                d="M104 198h33v3c0 0-4 4-8 5c-4 1-9 1-14 0c-5-1-9-5-9-5v-3z" 
              />
            </g>

            {/* 茎 - 使用计算好的高度 */}
            <path 
              stroke={stemColor}
              strokeLinecap="round"
              strokeWidth="2"
              d={`M121 193 L121 ${193 - stemHeight}`} 
              style={{
                transition: 'all 0.3s ease',
              }}
            />

            {/* 叶子1 - 最底部的叶子对 */}
            <g style={{ 
              opacity: leafOpacity1, 
              transform: `scale(${leafScale1})`,
              transformOrigin: '121px 170px',
              transition: 'all 0.4s ease-out',
            }}>
              {/* 右侧叶子 */}
              <path
                d="M121 170 C128 162 142 165 144 175 C146 184 136 188 121 175 Z"
                fill="url(#leafGradient)"
                stroke={leafDarkColor}
                strokeWidth="0.5"
                transform="rotate(20, 121, 170)"
              />
              {/* 左侧叶子 */}
              <path
                d="M121 170 C114 162 100 165 98 175 C96 184 106 188 121 175 Z"
                fill="url(#leafGradient)"
                stroke={leafDarkColor}
                strokeWidth="0.5"
                transform="rotate(-20, 121, 170)"
              />
              {/* 细节纹理 - 叶脉 */}
              <path 
                d="M121 170 L133 165 M121 170 L138 170 M121 170 L133 175" 
                stroke={leafDarkColor} 
                strokeWidth="0.3" 
                opacity="0.6"
                transform="rotate(20, 121, 170)"
              />
              <path 
                d="M121 170 L109 165 M121 170 L104 170 M121 170 L109 175" 
                stroke={leafDarkColor} 
                strokeWidth="0.3" 
                opacity="0.6"
                transform="rotate(-20, 121, 170)"
              />
            </g>

            {/* 叶子2 - 中间位置的单叶 */}
            <g style={{ 
              opacity: leafOpacity2,
              transform: `scale(${leafScale2})`,
              transformOrigin: '121px 140px',
              transition: 'all 0.4s ease-out',
            }}>
              <path
                d="M121 140 C130 132 145 136 147 145 C149 156 138 160 121 145 Z"
                fill="url(#leafGradient)"
                stroke={leafDarkColor}
                strokeWidth="0.5"
                transform="rotate(-10, 121, 140)"
              />
              {/* 叶脉 */}
              <path 
                d="M121 140 L133 135 M121 140 L138 140 M121 140 L133 145" 
                stroke={leafDarkColor} 
                strokeWidth="0.3" 
                opacity="0.6"
                transform="rotate(-10, 121, 140)"
              />
            </g>

            {/* 叶子3 - 靠近花朵的叶子 */}
            <g style={{ 
              opacity: leafOpacity3,
              transform: `scale(${leafScale3})`,
              transformOrigin: '121px 115px',
              transition: 'all 0.4s ease-out',
            }}>
              {/* 左侧小叶 */}
              <path
                d="M121 115 C115 107 104 110 102 117 C100 125 109 128 121 118 Z"
                fill="url(#leafGradient)"
                stroke={leafDarkColor}
                strokeWidth="0.5"
                transform="rotate(-25, 121, 115)"
              />
              {/* 叶脉 */}
              <path 
                d="M121 115 L112 112 M121 115 L109 115 M121 115 L112 118" 
                stroke={leafDarkColor} 
                strokeWidth="0.3" 
                opacity="0.6"
                transform="rotate(-25, 121, 115)"
              />
            </g>

            {/* 优化后的花朵 */}
            <g style={{ 
              opacity: flowerOpacity,
              transform: `scale(${flowerScale * flowerBreathing}) rotate(${flowerRotation}deg)`,
              transformOrigin: '121px 90px',
              transition: 'all 0.5s ease-out',
            }}>
              {/* 外层花瓣 - 更大更舒展 */}
              <g>
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(0, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(22.5, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(45, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(67.5, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(90, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(112.5, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(135, 121, 90)" />
                <ellipse cx="121" cy="90" rx="28" ry="9" fill="url(#petalOuterGradient)" transform="rotate(157.5, 121, 90)" />
              </g>
              
              {/* 中层花瓣 */}
              <g>
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(11.25, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(33.75, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(56.25, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(78.75, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(101.25, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(123.75, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(146.25, 121, 90)" />
                <ellipse cx="121" cy="90" rx="25" ry="8" fill="url(#petalGradient)" transform="rotate(168.75, 121, 90)" />
              </g>
              
              {/* 内层花瓣 - 更精致 */}
              <g>
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(0, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(45, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(90, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(135, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(180, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(225, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(270, 121, 90)" />
                <ellipse cx="121" cy="90" rx="22" ry="7" fill="url(#petalInnerGradient)" transform="rotate(315, 121, 90)" />
              </g>
              
              {/* 花朵中心 - 带光晕效果 */}
              <circle cx="121" cy="90" r="12" fill="url(#centerGlowGradient)" />
              <circle cx="121" cy="90" r="9" fill={centerColor} />
              
              {/* 花朵中心的纹理 - 更丰富的细节 */}
              <g>
                <circle cx="121" cy="90" r="2.5" fill={centerBrightColor} />
                <circle cx="125" cy="86" r="2" fill={centerBrightColor} />
                <circle cx="125" cy="94" r="2" fill={centerBrightColor} />
                <circle cx="117" cy="94" r="2" fill={centerBrightColor} />
                <circle cx="117" cy="86" r="2" fill={centerBrightColor} />
                
                <circle cx="121" cy="83" r="1.8" fill={centerBrightColor} />
                <circle cx="121" cy="97" r="1.8" fill={centerBrightColor} />
                <circle cx="115" cy="90" r="1.8" fill={centerBrightColor} />
                <circle cx="127" cy="90" r="1.8" fill={centerBrightColor} />
                
                <circle cx="127" cy="83" r="1.5" fill={centerBrightColor} />
                <circle cx="127" cy="97" r="1.5" fill={centerBrightColor} />
                <circle cx="115" cy="83" r="1.5" fill={centerBrightColor} />
                <circle cx="115" cy="97" r="1.5" fill={centerBrightColor} />
                
                <circle cx="129" cy="90" r="1.2" fill={centerBrightColor} />
                <circle cx="113" cy="90" r="1.2" fill={centerBrightColor} />
                <circle cx="121" cy="80" r="1.2" fill={centerBrightColor} />
                <circle cx="121" cy="100" r="1.2" fill={centerBrightColor} />
              </g>
              
              {/* 花瓣边缘装饰 - 增加精致感 */}
              <g opacity="0.6">
                <circle cx="149" cy="90" r="1" fill={petalTipColor} />
                <circle cx="93" cy="90" r="1" fill={petalTipColor} />
                <circle cx="121" cy="61" r="1" fill={petalTipColor} />
                <circle cx="121" cy="119" r="1" fill={petalTipColor} />
                <circle cx="135" cy="66" r="0.8" fill={petalTipColor} />
                <circle cx="107" cy="66" r="0.8" fill={petalTipColor} />
                <circle cx="135" cy="114" r="0.8" fill={petalTipColor} />
                <circle cx="107" cy="114" r="0.8" fill={petalTipColor} />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GrowingPlant;