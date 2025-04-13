"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type VideoButtonProps = {
  videoUrl: string
  className?: string
}

export function VideoButton({ videoUrl, className }: VideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={cn("relative", className)}>
      <motion.div
        layout
        initial={false}
        animate={{ 
          width: isOpen ? '100%' : 'auto',
          height: isOpen ? 'auto' : 'auto',
          borderRadius: isOpen ? '12px' : '100px'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30, 
          duration: 0.3 
        }}
        className={cn(
          "overflow-hidden bg-black text-white shadow-lg relative z-20",
          isOpen ? "w-full" : "w-auto"
        )}
      >
        {/* 按钮部分 */}
        <div 
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            isOpen ? "justify-between p-4" : "px-5 py-3"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div className="font-semibold text-2xl">
            video
          </motion.div>
          <motion.div
            className={cn(
              "rounded-full px-4 py-1 text-sm font-medium",
              isOpen ? "bg-gray-700 hover:bg-gray-600" : "bg-white text-black hover:bg-gray-100"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? "close" : "open"}
          </motion.div>
        </div>
        
        {/* 视频内容部分 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full relative aspect-video"
            >
              <iframe
                src={videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 