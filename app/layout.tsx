import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MouseFollower from "@/components/3d/MouseFollower"
import SmoothScrollFix from "@/components/smooth-scroll-fix"


export const metadata = {
  title: "展春燕 - Java工程师",
  description: "Java工程师个人主页",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SmoothScrollFix />
          <MouseFollower />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}