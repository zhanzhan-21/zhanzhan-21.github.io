# 个人博客网站

这是一个使用 Next.js 和 Tailwind CSS 构建的现代个人博客网站，用于展示个人信息、技能和项目经历。

## 项目结构

```
├── app/                # Next.js 应用目录
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 布局组件
│   ├── page.tsx        # 主页面
│   └── api/            # API路由
├── components/         # React组件
│   ├── ui/             # 基础UI组件
│   ├── 3d/             # 3D效果组件
│   ├── navbar.tsx      # 导航栏
│   ├── hero.tsx        # 首页英雄区
│   └── ...其他组件
├── lib/                # 工具函数
│   ├── dbConnect.js    # 数据库连接工具
│   ├── models/         # MongoDB数据模型
│   └── utils.ts        # 通用工具函数
├── public/             # 静态资源
│   ├── images/         # 图片资源
│   ├── icons/          # 图标资源
│   └── fonts/          # 字体资源
├── styles/             # 额外样式
├── next.config.mjs     # Next.js配置
├── tailwind.config.ts  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── package.json        # 项目依赖
```

## 最近更新



- **2025-4-15**: 修复手机端卡片居中显示问题：
  - 优化"关于我"页面卡片在手机端的居中显示
  - 修复教育背景和个人简介卡片在展开前未居中的问题
  - 重构卡片布局，确保内容在各设备上都能保持良好的居中对齐
  - 优化兴趣爱好区域的刮刮卡组件，使其在小屏幕设备上自适应宽度
- **2025-4-15**: 优化iPad竖屏模式排版：
  - 添加屏幕方向检测功能，专门识别竖屏模式
  - 重新设计竖屏模式下的内容布局，从双列改为单列流式布局
  - 调整竖屏模式下标题、副标题和个人信息的字体大小和间距
  - 优化联系信息布局为两列网格，提高空间利用率
  - 设置头像和装饰元素的大小，使其与竖屏模式更协调
- **2025-4-15**: 优化iPad设备上首页文字排版：
  - 添加针对平板设备(768px-1024px)的特定断点适配
  - 改进首页Hero区域的标题、副标题及个人信息的显示样式
  - 优化联系信息在平板设备上的布局和显示方式
  - 调整文字和图标尺寸，为平板设备提供更合适的视觉体验
- **2025-4-14**: 修复TypeScript类型导入问题：
  - 解决了React类型声明找不到的问题
  - 修复了pnpm和npm混用导致的类型路径错误
  - 优化了项目依赖管理方式
- **2025-4-14**: 优化项目卡片展开效果，改进居中显示方式：
  - 保留卡片在页面中央优雅展示的特性
  - 调整卡片容器的定位和内边距，确保内容不被导航栏遮挡
  - 优化展开内容的最大高度计算，确保在各种屏幕尺寸下都能完整显示
  - 简化卡片展开/收起的交互逻辑，提升用户体验
- **2025-4-13**: 重构项目卡片展开方式，彻底解决内容遮挡问题：
  - 放弃使用固定定位和z-index策略，改为使用相对定位
  - 重新设计卡片展开逻辑，确保在各种屏幕尺寸下都能正确显示
  - 添加智能滚动位置管理，展开卡片时自动定位到最佳视图位置
  - 优化背景遮罩层实现，提供更加一致的用户体验
- **2025-4-13**: 修复项目卡片展开时的遮罩层覆盖导航栏问题：
  - 调整遮罩层的z-index和位置，确保导航栏在卡片展开时仍然可见
  - 优化卡片展开与收起的视觉体验，使其不干扰主要导航功能
  - 重组层级结构，保证良好的用户体验和界面可用性
- **2025-4-13**: 优化项目展示布局：
  - 重新设计项目卡片为简洁紧凑的折叠式卡片
  - 添加垂直时间线和时间点标记，提升视觉连贯性
  - 优化项目卡片默认状态，减少占用空间并提升浏览体验
  - 保持展开后的详细信息展示，确保内容完整性
- **2025-4-13**: 改进项目展示部分：
  - 将项目卡片从3D翻转式改为点击展开式，提升交互体验
  - 添加更详细的项目描述和关键特性展示
  - 优化项目技术栈标签展示方式
  - 采用与整体设计风格一致的颜色方案
- **2025-4-13**: 优化导航栏设计：
  - 为顶部导航栏添加了图标和悬浮动画效果
  - 鼠标经过时导航项平滑放大并显示动态下划线
  - 添加响应式移动端下拉菜单，优化移动端用户体验
- **2025-4-13**: 添加浮动导航栏功能：
  - 在页面底部添加了美观的浮动导航组件
  - 鼠标悬停时图标会平滑放大并显示标题提示
  - 适配移动端和桌面端不同布局
- **2025-4-13**: 增加奖项卡片的3D效果和颜色区分：
  - 增强第一个卡片的倾斜角度至50度
  - 为不同级别的奖项(国家级/省级/校级)添加不同颜色区分
- **2025-4-13**: 添加教育背景可点击展开查看详细信息功能，增强交互体验
- **2025-4-12**: 添加奖项卡片的多彩背景效果，使每个奖项悬停时显示不同的颜色
- **2025-4-12**: 修复了HoverCardEffect组件的水合(hydration)错误，改善了服务器端渲染与客户端渲染的一致性

## 项目概述

本项目是一个响应式的个人博客网站，包括以下主要功能和特点：

## 主要功能

1. **首页(Hero)** - 展示个人简介和联系方式，带有3D粒子背景和互动特效
2. **关于我(About)** - 详细的个人介绍和教育背景，点击学校卡片可查看详细信息
3. **技能展示(Skills)** - 展示技术栈和专业技能，带有轨道式图标展示
4. **项目展示(Projects)** - 展示个人项目经历，带有3D翻转卡片效果
5. **获奖经历(Awards)** - 展示个人获奖情况，特殊奖项有3D悬浮效果
6. **留言板(Message Board)** - 访客可以留言并查看他人留言，使用GitHub Issues存储
7. **联系方式(Footer)** - 提供联系信息和社交媒体链接
8. **增强型导航** - 顶部导航栏带有图标和动画效果，支持响应式布局

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) - React 框架
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **UI组件**: [Radix UI](https://www.radix-ui.com/) - 无样式的可访问性组件库
- **动画**: [Framer Motion](https://www.framer.com/motion/) - React 动画库
- **3D效果**: [Three.js](https://threejs.org/) 和 [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - WebGL 3D渲染
- **自定义动画**: 纯CSS和React实现的动画效果
- **数据库**: [GitHub Issues](https://github.com/features/issues) - 代码托管平台
- **TypeScript**: 提供类型安全和更好的开发体验

## 3D效果和交互特性

本项目添加了以下3D效果和交互特性，提升用户体验：

1. **Hero区域的3D粒子背景** - 动态的粒子效果作为背景，增强视觉吸引力
2. **技能展示的轨道图标** - 技能图标以轨道环绕方式展示，鼠标悬停可查看详情
3. **项目卡片的3D翻转效果** - 点击项目卡片可以看到卡片的3D翻转效果
4. **鼠标跟随效果** - 鼠标指针周围有光晕效果，增强交互感
5. **爆炸式五彩纸屑交互效果** - 点击Hero区域中的"展春燕"三个字会触发炫酷动画
6. **奖项3D悬浮效果** - 为特别重要的奖项添加了3D悬浮和旋转效果
   - 最近增强了卡片的倾斜角度到50度，提供更明显的3D效果
   - 为不同级别的奖项(国家级/省级/校级)添加不同颜色区分，增强视觉辨识度
7. **教育背景卡片交互效果** - 点击教育背景卡片可以展开查看学校详细信息，带有流畅的动画过渡
8. **导航交互效果** - 顶部导航栏提供丰富的交互反馈：
   - 鼠标悬停时导航项平滑放大，显示动态下划线动画
   - 图标颜色随状态动态变化，提供直观的视觉反馈
   - 当前活跃页面有明显的指示标记
   - 移动端提供平滑过渡的下拉菜单，带有特殊的视觉标记

## 本地开发

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 pnpm 作为包管理器

### 安装依赖

项目同时支持npm和pnpm包管理器，推荐同时使用两者以确保类型定义正确解析。

```bash
# 使用npm安装
npm install --legacy-peer-deps

# 安装TypeScript类型定义
npm install --save-dev @types/react @types/react-dom @types/node --legacy-peer-deps

# 使用pnpm安装(确保类型路径正确)
pnpm install --no-frozen-lockfile
```

注意：由于项目使用了React 19和一些最新依赖，需要使用`--legacy-peer-deps`选项来解决依赖兼容性问题。

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

注意：由于在 next.config.mjs 中设置了 `output: 'export'`，构建命令会自动生成静态导出文件到 `out` 目录。

### 解决TypeScript类型问题

如果遇到React类型定义找不到的问题，请按照以下步骤解决：

1. 确保在`app/layout.tsx`等文件中正确导入React类型：
```typescript
import type { ReactNode } from 'react'
```

2. 清除TypeScript缓存：
```bash
rm -f tsconfig.tsbuildinfo
```

3. 重新安装依赖：
```bash
# 先用npm安装核心依赖
npm install --legacy-peer-deps
npm install --save-dev @types/react @types/react-dom @types/node --legacy-peer-deps

# 再用pnpm安装确保类型路径正确
pnpm install --no-frozen-lockfile
```

## 部署

项目已配置为可以部署到Vercel或GitHub Pages。

### GitHub Pages部署

1. 确保 `next.config.mjs` 中设置了正确的 `basePath`（当前设置为 `''`）
2. 运行构建命令生成静态文件:

```bash
npm run build
```

3. 将 `out` 目录的内容推送到GitHub Pages分支

## 在线访问

访问网站: [https://zhanzhan-21.github.io/](https://zhanzhan-21.github.io/)

## 贡献

欢迎提交问题和改进建议。

## 许可

MIT License

## 留言板功能使用说明

留言板功能允许访客在您的博客上留言，所有留言存储在项目的`data/messages.json`文件中。

### 功能特点

1. **表单验证** - 使用Zod进行客户端和服务器端的表单验证
2. **实时反馈** - 提交成功和失败都有清晰的视觉反馈
3. **优雅的UI设计** - 符合整站风格的卡片式布局
4. **响应式设计** - 在各种设备上都有良好的显示效果
5. **数据持久化** - 所有留言都保存在JSON文件中，便于备份和迁移
6. **管理后台** - 提供管理员页面查看所有留言，包括非公开留言

### 使用方法

1. **访客留言：**
   - 访问留言板页面：点击导航栏中的"留言板"链接或访问`/message-board`路径
   - 填写留言表单：
     - 输入您的姓名（必填）
     - 输入您的邮箱（必填，用于管理员回复）
     - 输入留言内容（必填）
     - 选择是否公开显示（默认公开）
   - 点击"提交留言"按钮提交
   - 在留言列表中查看已发布的留言

2. **管理员功能：**
   - 访问管理页面：`/admin/message-board`路径
   - 查看所有留言，包括非公开留言
   - 删除不需要的留言

### 技术实现

留言板功能的技术实现包括：

1. **数据存储** - 使用JSON文件存储留言数据
2. **集中式处理模块** - 封装的`jsonStorage.js`模块提供数据操作统一入口
3. **API端点** - 提供获取和提交留言的RESTful API
4. **表单处理** - 使用react-hook-form和zod处理表单验证
5. **错误处理** - 完善的前后端错误处理机制
6. **UI组件** - 使用shadcn/ui组件库构建界面

## 如何运行

### 本地开发环境

1. 克隆仓库

```bash
git clone https://github.com/zhanzhan-21/zhanzhan-21.github.io.git
cd zhanzhan-21.github.io
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量

复制`.env.example`文件为`.env.local`文件，并填写必要的环境变量：

```
# GitHub API令牌，用于留言板功能
GITHUB_TOKEN=your_github_token_here

# 留言板Issue配置
ISSUE_REPO_OWNER=zhanzhan-21
ISSUE_REPO_NAME=zhanzhan-21.github.io
ISSUE_NUMBER=1
```

4. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 部署到GitHub Pages

本项目可以直接部署到GitHub Pages，留言功能通过GitHub Issues API实现。

### 部署步骤

1. 在GitHub上创建仓库 `your-username.github.io`
2. 配置GitHub Actions工作流 (已包含在`.github/workflows/deploy.yml`)
3. 设置GitHub Secrets

在仓库设置中添加以下Secrets:
- `GITHUB_TOKEN`: 用于GitHub API的访问令牌 (需要repo权限)

### 留言功能配置

1. 在你的GitHub仓库中创建一个专门用于存储留言的Issue
2. 记下Issue的编号
3. 在环境变量或GitHub Secrets中设置:
   - `ISSUE_REPO_OWNER`: 你的GitHub用户名
   - `ISSUE_REPO_NAME`: 仓库名 (通常是 `your-username.github.io`)
   - `ISSUE_NUMBER`: 留言Issue的编号

## 自定义配置

### 修改留言存储方式

本项目默认使用GitHub Issues存储留言，如果你想使用其他存储方式，可以:

1. 修改 `lib/githubIssueStorage.js` 文件
2. 更新 `app/api/messages/route.js` 中的API处理逻辑

## 贡献

如果你想为这个项目做贡献，欢迎提交Pull Request或创建Issue。
