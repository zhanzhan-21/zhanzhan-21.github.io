# 个人技术博客网站

这是一个基于 Next.js 14 + TypeScript + Tailwind CSS 构建的现代化个人技术博客网站，专注于展示技术经验和分享编程知识。

## 🚀 主要功能

### 1. 关于我页面
- **个人简介**：展示个人技能和职业发展方向
- **教育背景**：可展开的教育经历卡片，支持详细信息展示
- **兴趣爱好**：创新的刮刮卡交互效果
- **三列响应式布局**：完美适配各种屏幕尺寸

### 2. 技术博客系统
- **博客列表页面**：
  - 精选文章展示区域
  - 智能搜索功能（支持标题、摘要、标签搜索）
  - 分类筛选（后端开发、机器学习、运维部署、数据库、前端开发）
  - 文章统计信息（浏览量、点赞数、阅读时间）
  - 响应式卡片布局

- **博客详情页面**：
  - Markdown 内容渲染
  - 代码高亮显示
  - 文章元信息展示
  - 互动功能（点赞、收藏、分享）
  - 社交分享支持
  - 相关文章推荐

### 3. 用户体验优化
- **动画效果**：使用 Framer Motion 实现流畅的页面动画
- **深色模式**：完整的暗色主题支持
- **响应式设计**：移动设备友好的界面
- **加载优化**：图片懒加载和页面优化

## 🛠️ 技术栈

### 前端框架
- **Next.js 14**：React 全栈框架，支持 SSR/SSG
- **TypeScript**：类型安全的 JavaScript
- **Tailwind CSS**：现代化的 CSS 框架

### UI 组件
- **Radix UI**：无障碍的 UI 基础组件
- **Shadcn/ui**：优雅的组件库
- **Lucide React**：现代化图标库
- **Framer Motion**：流畅的动画效果

### 博客功能
- **Markdown 支持**：文章内容使用 Markdown 格式
- **代码高亮**：支持多种编程语言的语法高亮
- **响应式布局**：自适应各种设备屏幕

## 📁 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── blog/              # 博客路由
│   │   ├── page.tsx       # 博客列表页
│   │   └── [slug]/        # 动态路由
│   │       └── page.tsx   # 博客详情页
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── blog/             # 博客相关组件
│   │   ├── blog-list.tsx # 博客列表组件
│   │   └── blog-detail.tsx # 博客详情组件
│   ├── ui/               # UI 基础组件
│   └── about.tsx         # 关于我页面组件
├── public/               # 静态资源
├── styles/               # 样式文件
└── lib/                  # 工具函数
```

## 🚦 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📝 使用指南

### 添加新博客文章

1. 在 `components/blog/blog-list.tsx` 中的 `blogPosts` 数组中添加新文章：

```typescript
{
  id: "新文章ID",
  title: "文章标题",
  summary: "文章摘要",
  content: `
# 文章内容（Markdown格式）

这里是文章的详细内容...
  `,
  date: "2024-12-15",
  readTime: "10分钟",
  tags: ["标签1", "标签2"],
  category: "分类",
  views: 0,
  likes: 0,
  featured: false,
  slug: "article-slug"
}
```

2. 同时在 `app/blog/[slug]/page.tsx` 中的 `blogPosts` 数组中添加相同的文章数据。

### 自定义主题

修改 `tailwind.config.ts` 中的颜色配置：

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(你的主色调)",
    foreground: "hsl(文字颜色)",
  },
  // 其他颜色配置...
}
```

### 修改个人信息

在 `components/about.tsx` 中更新：
- 个人简介内容
- 教育背景信息
- 兴趣爱好展示
- 精选博客列表

## 🎨 特色功能

### 1. 可展开教育卡片
使用自定义的 `ExpandableEducationCard` 组件，支持：
- 学校信息展示
- 成绩和排名显示
- 详细介绍的展开/收起
- 标签分类

### 2. 刮刮卡兴趣展示
创新的 `ScratchCard` 组件：
- 用户刮开表面查看兴趣爱好
- 动画效果和交互反馈
- 响应式尺寸适配

### 3. 博客搜索和筛选
强大的搜索和筛选功能：
- 实时搜索文章标题、摘要、标签
- 按分类筛选文章
- 精选文章特殊展示

## 🔧 开发说明

### 添加新的 UI 组件
1. 在 `components/ui/` 目录下创建新组件
2. 遵循 shadcn/ui 的设计规范
3. 添加 TypeScript 类型定义

### 扩展博客功能
- 可以集成评论系统（如 Giscus）
- 添加标签页面和搜索结果页
- 实现文章阅读进度条
- 添加文章目录导航

## 📱 响应式设计

网站完全支持响应式设计：
- **移动设备** (< 768px)：单列布局，优化触摸交互
- **平板设备** (768px - 1024px)：两列布局
- **桌面设备** (> 1024px)：三列布局，最佳阅读体验

## 🚀 部署

### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署和 CDN 加速

### 其他部署选项
- **Netlify**：静态站点托管
- **服务器部署**：使用 `npm run build` 构建生产版本

## 📈 性能优化

- **图片优化**：使用 Next.js Image 组件
- **代码分割**：自动的路由级代码分割
- **缓存策略**：静态资源缓存优化
- **SEO 优化**：元数据和结构化数据

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**作者**: 一名专注于Java后端开发的工程师  
**联系方式**: [在此添加您的联系方式]  
**博客地址**: [在此添加您的博客地址]
