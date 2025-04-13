"use client"

import React, { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

type SidePanelProps = {
  panelOpen: boolean
  handlePanelOpen: () => void
  children: ReactNode
  renderButton: (handleToggle: () => void) => ReactNode
  className?: string
}

export function SidePanel({
  panelOpen,
  handlePanelOpen,
  children,
  renderButton,
  className,
}: SidePanelProps) {
  return (
    <div className={cn("w-full relative", className)}>
      {/* 按钮区域 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">{renderButton(handlePanelOpen)}</div>
      </div>

      {/* 展开的内容 */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            className="overflow-hidden mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 