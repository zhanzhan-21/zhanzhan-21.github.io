"use client"

import { useEffect, useRef } from "react"

interface GooeyTextEffectProps {
  text?: string;
  width?: number;
  height?: number;
  className?: string;
  textColor?: string;
  particleColor?: string;
  backgroundColor?: string;
  cursorColor?: string;
  showCursor?: boolean;
  fontSize?: number;
}

export function GooeyTextEffect({
  text = "Summer",
  width = 100,
  height = 100,
  className = "",
  textColor = "#ff6a1a",
  particleColor = "#0DF2cc",
  backgroundColor = "#ffc9a2",
  cursorColor = "#0DF2cc",
  showCursor = false,
  fontSize
}: GooeyTextEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    diff: 0
  });
  const headRef = useRef({
    x: 0,
    y: 0
  });
  const particlesRef = useRef<any[]>([]);
  const viewportRef = useRef({
    width: 0,
    height: 0
  });
  // 将showCursor选项放入ref中处理，避免引起useEffect重新执行
  const showCursorRef = useRef(showCursor);
  // 保持showCursorRef最新
  showCursorRef.current = showCursor;

  // 初始化和动画循环
  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;
    if (showCursorRef.current && !cursorRef.current) return;

    viewportRef.current = {
      width,
      height
    };

    // 鼠标移动处理
    const onMouseMove = (e: MouseEvent) => {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      // 计算相对于SVG元素的坐标
      mouseRef.current.x = e.clientX - svgRect.left;
      mouseRef.current.y = e.clientY - svgRect.top;
    };

    // 添加鼠标移动事件监听
    svgRef.current.addEventListener('mousemove', onMouseMove);

    // 动画渲染函数
    const render = (time: number) => {
      // 平滑鼠标移动
      mouseRef.current.smoothX += (mouseRef.current.x - mouseRef.current.smoothX) * 0.1;
      mouseRef.current.smoothY += (mouseRef.current.y - mouseRef.current.smoothY) * 0.1;
      
      mouseRef.current.diff = Math.hypot(
        mouseRef.current.x - mouseRef.current.smoothX, 
        mouseRef.current.y - mouseRef.current.smoothY
      );
      
      emitParticle();
      
      // 只有在显示光标时才更新光标位置
      if (showCursorRef.current && cursorRef.current) {
        cursorRef.current.style.setProperty('--x', `${mouseRef.current.smoothX}px`);
        cursorRef.current.style.setProperty('--y', `${mouseRef.current.smoothY}px`);
      }
      
      // 移动头部位置
      headRef.current.x = viewportRef.current.width * 0.5 + viewportRef.current.width * 0.375 * Math.cos(time * 0.0006);
      headRef.current.y = viewportRef.current.height * 0.5 + viewportRef.current.width * 0.05 * Math.cos(time * 0.0011);
      
      // 请求下一帧动画
      requestAnimationFrame(render);
    };

    // 开始动画循环
    requestAnimationFrame(render);

    // 清理函数
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [width, height]);

  // 发射粒子函数
  const emitParticle = () => {
    if (!wrapperRef.current) return;
    
    let x = 0;
    let y = 0;
    let size = 0;
    
    if (mouseRef.current.diff > 0.01) {
      x = mouseRef.current.smoothX;
      y = mouseRef.current.smoothY;
      size = mouseRef.current.diff;
    } else {
      x = headRef.current.x;
      y = headRef.current.y;
      size = Math.random() * 100;
    }

    // 创建粒子对象
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    // 设置初始属性
    particle.setAttribute('cx', x.toString());
    particle.setAttribute('cy', y.toString());
    particle.setAttribute('r', '20');
    
    // 生成随机颜色
    const hue = Math.floor(Math.random() * 11) + 165;
    const saturation = Math.floor(Math.random() * 21) + 80;
    const lightness = Math.floor(Math.random() * 11) + 45;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    particle.setAttribute('fill', color);
    
    // 添加到wrapper
    wrapperRef.current.prepend(particle);
    
    // 记录粒子
    const particleObj = {
      el: particle,
      x,
      y,
      r: 20,
      size: Math.sqrt(size) * 4 * (0.5 + Math.random() * 0.5) * (viewportRef.current.width / 1920),
      vy: 0,
      seed: Math.random() * 1000,
      freq: (0.5 + Math.random() * 1) * 0.01,
      amplitude: (1 - Math.random() * 2) * 0.5
    };
    
    particlesRef.current.push(particleObj);
    
    // 粒子动画
    let startTime = performance.now();
    
    const animateParticle = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / 1250); // 1250ms 总动画时间
      
      // 前250ms是生长阶段，后1000ms是收缩阶段
      let radius;
      if (progress < 0.2) { // 0-0.2是生长阶段 (250ms)
        radius = 20 + (particleObj.size - 20) * (progress / 0.2);
      } else { // 0.2-1是收缩阶段 (1000ms)
        const shrinkProgress = (progress - 0.2) / 0.8;
        radius = particleObj.size * (1 - shrinkProgress);
      }
      
      // 更新粒子位置
      particleObj.x += Math.cos((elapsed + particleObj.seed) * particleObj.freq) * particleObj.amplitude;
      particleObj.y += Math.sin((elapsed + particleObj.seed) * particleObj.freq) * particleObj.amplitude + particleObj.vy;
      particleObj.vy += 0.2;
      
      // 更新元素属性
      particleObj.el.setAttribute('cx', particleObj.x.toString());
      particleObj.el.setAttribute('cy', particleObj.y.toString());
      particleObj.el.setAttribute('r', radius.toString());
      
      // 动画完成后移除粒子
      if (progress >= 1) {
        wrapperRef.current?.removeChild(particleObj.el);
        particlesRef.current = particlesRef.current.filter(p => p !== particleObj);
      } else {
        requestAnimationFrame(animateParticle);
      }
    };
    
    requestAnimationFrame(animateParticle);
  };

  return (
    <div className={`relative ${className}`} style={{ 
      width: `${width}px`, 
      height: `${height}px`, 
      overflow: 'hidden',
      border: 'none',
      outline: 'none',
      boxShadow: 'none'
    }}>
      <svg 
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="none" 
        width={width} 
        height={height}
        className="relative z-10 gooey-text-svg"
        style={{ 
          background: backgroundColor, 
          outline: 'none', 
          border: 'none',
          stroke: 'none',
          padding: '0'
        }}
      >
        <defs>
          <mask id={`text-mask-${text}`}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text 
              x="50%" 
              y="95%" 
              fill="#fff" 
              dominantBaseline="alphabetic" 
              textAnchor="middle"
              style={{ 
                fontSize: fontSize ? `${fontSize}px` : `${width * 0.15}px`,
                fontFamily: 'sans-serif',
                fontWeight: "bold",
                lineHeight: 0.9,
                letterSpacing: '-0.03em'
              }}
            >
              {text}
            </text>
          </mask>

          <filter id={`gooey-filter-${text}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -10" 
              result="goo" 
            />
          </filter>
        </defs>

        <rect x="0" y="0" width="100%" height="100%" mask={`url(#text-mask-${text})`} fill={textColor} style={{stroke: 'none'}} />
        <g ref={wrapperRef} filter={`url(#gooey-filter-${text})`} mask={`url(#text-mask-${text})`}></g>
      </svg>
      
      {/* 只在showCursor为true时渲染光标元素 */}
      {showCursor && (
        <div 
          ref={cursorRef}
          className="absolute"
          style={{ 
            top: '-0.8vw',
            left: '-0.8vw',
            zIndex: 20,
            width: '1.6vw',
            height: '1.6vw',
            background: cursorColor,
            borderRadius: '50%',
            transform: 'translate3d(var(--x), var(--y), 0)',
            pointerEvents: 'none'
          }}
        ></div>
      )}
    </div>
  )
} 