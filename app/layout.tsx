import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MouseFollower from "@/components/3d/MouseFollower"
import SmoothScrollFix from "@/components/smooth-scroll-fix"
import GrowingPlant from "@/components/GrowingPlant"
import type { ReactNode } from 'react'

export const metadata = {
  title: "展春燕 - 个人主页",
  description: "展春燕个人主页",
  generator: '展春燕',
  icons: {
    icon: '/展.svg',
    shortcut: '/展.svg',
    apple: '/展.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            scroll-behavior: smooth;
            scroll-padding-top: 80px; /* 与SCROLL_OFFSET常量相同的值 */
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SmoothScrollFix />
          <MouseFollower />
          <GrowingPlant />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}