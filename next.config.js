/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 添加输出配置
  output: 'export',
  // 禁用图片优化以允许静态导出
  images: {
    unoptimized: true,
  },
  // 配置静态资源基础路径，如果部署到子目录则需要设置
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  // 禁用X-Powered-By头
  poweredByHeader: false,
}

module.exports = nextConfig 