# 展春燕个人博客

这是一个使用 Next.js 和 Tailwind CSS 构建的现代个人博客网站，用于展示展春燕的个人信息、技能和项目经历。

## 项目概述

本项目是一个响应式的个人博客网站，包括以下主要功能和特点：

- 简洁现代的UI设计
- 响应式布局，适配各种设备尺寸
- 暗/亮模式切换
- 平滑的滚动和动画效果
- 模块化的组件结构
- **炫酷的3D效果和交互体验**

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) - React 框架
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **UI组件**: [Radix UI](https://www.radix-ui.com/) - 无样式的可访问性组件库
- **动画**: [Framer Motion](https://www.framer.com/motion/) - React 动画库
- **3D效果**: [Three.js](https://threejs.org/) 和 [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - WebGL 3D渲染
- **TypeScript**: 提供类型安全和更好的开发体验

## 项目结构

- `/app` - Next.js 应用程序目录
- `/components` - 可复用的 React 组件
- `/components/3d` - 3D效果组件
- `/public` - 静态资源文件
- `/public/icons` - 技能和功能图标
- `/styles` - 全局样式

## 主要功能

1. **首页(Hero)** - 展示个人简介和联系方式，带有3D粒子背景
2. **关于我(About)** - 详细的个人介绍和教育背景
3. **技能展示(Skills)** - 展示技术栈和专业技能，带有轨道式图标展示
4. **项目展示(Projects)** - 展示个人项目经历，带有3D翻转卡片效果
5. **获奖经历(Awards)** - 展示个人获奖情况
6. **联系方式(Footer)** - 提供联系信息和社交媒体链接

## 3D效果和交互特性

本项目添加了以下3D效果和交互特性，提升用户体验：

1. **Hero区域的3D粒子背景** - 动态的粒子效果作为背景，增强视觉吸引力
2. **技能展示的轨道图标** - 技能图标以轨道环绕方式展示，不同技能分布在三个轨道上，鼠标悬停在任意图标上可以查看详情，悬停时动画暂停，增强用户交互体验
3. **项目卡片的3D翻转效果** - 点击项目卡片可以看到卡片的3D翻转效果，展示更多详情
4. **鼠标跟随效果** - 鼠标指针周围有光晕效果，增强交互感

## 开发环境搭建

1. 克隆仓库

```bash
git clone <repository-url>
cd <repository-name>
```

2. 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

3. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建部署

1. 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

2. 启动生产服务器

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

## 自定义内容

您可以通过修改以下文件来自定义网站内容：

- `components/hero.tsx` - 更新个人简介和联系方式
- `components/about.tsx` - 更新教育背景和个人介绍
- `components/skills.tsx` - 更新技能信息
- `components/projects.tsx` - 更新项目展示
- `components/awards.tsx` - 更新获奖经历
- `components/footer.tsx` - 更新联系信息

## 3D效果自定义

您可以通过修改以下文件来自定义3D效果：

- `components/3d/HeroBackground.tsx` - 修改Hero区域的粒子背景效果
- `components/3d/SkillOrbit.tsx` - 修改技能展示的轨道环绕效果
- `components/3d/FlipCard.tsx` - 修改项目卡片的3D翻转效果
- `components/3d/MouseFollower.tsx` - 修改鼠标跟随效果 