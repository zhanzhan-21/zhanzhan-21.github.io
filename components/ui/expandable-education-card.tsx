"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"

// 关闭图标组件
const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}

export type EducationCardType = {
  school: string
  logo: string
  degree: string
  major: string
  period: string
  gpa?: string
  rank?: string
  publication?: string | {
    text: string
    url: string
  }
  tags: {
    label: string
    color: "blue" | "green" | "purple" | "red" | "yellow"
  }[]
  achievements?: string[]
  description?: string
  content: React.ReactNode
}

interface ExpandableEducationCardProps {
  schools: EducationCardType[]
}

export function ExpandableEducationCard({ schools }: ExpandableEducationCardProps) {
  const [active, setActive] = useState<EducationCardType | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
            onWheel={(e) => e.stopPropagation()}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div 
            className="fixed inset-0 grid place-items-center z-[100] mt-12"
            onWheel={(e) => e.stopPropagation()}
          >
            <motion.button
              key={`button-close-${active.school}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.school}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] max-h-[80vh] h-full md:h-fit md:max-h-[80vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              <motion.div layoutId={`image-${active.school}-${id}`} className="relative h-64">
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.logo}
                  alt={active.school}
                  className="w-full h-64 lg:h-64 sm:rounded-tr-lg sm:rounded-tl-lg object-contain p-8 bg-gray-50 dark:bg-gray-800"
                />
              </motion.div>

              <div className="flex flex-col overflow-auto" style={{ maxHeight: "calc(80vh - 64px - 12px)" }}>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.school}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.school}
                    </motion.h3>
                    <motion.p
                      layoutId={`degree-${active.degree}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.degree} · {active.major}
                    </motion.p>
                  </div>

                  <motion.p
                    layoutId={`period-${active.period}-${id}`}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    {active.period}
                  </motion.p>
                </div>
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {active.tags.map((tag) => (
                      <motion.span
                        key={`tag-${tag.label}`}
                        layoutId={`tag-${tag.label}-${active.school}-${id}`}
                        className={`inline-flex items-center rounded-md bg-${tag.color}-50 px-2 py-1 text-xs font-medium text-${tag.color}-700 ring-1 ring-inset ring-${tag.color}-700/10`}
                      >
                        {tag.label}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 relative px-4 flex-1 overflow-y-auto pb-8" onWheel={(e) => e.stopPropagation()}>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base flex flex-col items-start gap-4 dark:text-neutral-400"
                  >
                    {active.content}
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none"></div>
                  <div className="absolute right-4 bottom-2 text-xs text-primary animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="space-y-6 flex-grow">
        {schools.map((school) => (
          <motion.div
            layoutId={`card-${school.school}-${id}`}
            key={`card-${school.school}-${id}`}
            onClick={() => setActive(school)}
            className="border-l-2 border-primary pl-4 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg transition-colors group relative"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <motion.div layoutId={`image-${school.school}-${id}`}>
                  <Image 
                    src={school.logo} 
                    alt={`${school.school}logo`} 
                    width={64}
                    height={64}
                    className="w-16 h-16 mr-4" 
                  />
                </motion.div>
                <div>
                  <div className="flex items-center">
                    <motion.h4 layoutId={`title-${school.school}-${id}`} className="font-medium">
                      {school.school}
                    </motion.h4>
                    <span className="ml-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      点击查看详情
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    {school.tags.map((tag) => (
                      <motion.span
                        key={`tag-${tag.label}`}
                        layoutId={`tag-${tag.label}-${school.school}-${id}`}
                        className={`inline-flex items-center rounded-md bg-${tag.color}-50 px-2 py-1 text-xs font-medium text-${tag.color}-700 ring-1 ring-inset ring-${tag.color}-700/10`}
                      >
                        {tag.label}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <motion.span 
                layoutId={`period-${school.period}-${id}`}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {school.period}
              </motion.span>
            </div>
            <motion.p layoutId={`degree-${school.degree}-${id}`} className="text-gray-600 dark:text-gray-300 text-sm">
              {school.degree} {school.major}
            </motion.p>
            {school.gpa && <p className="text-gray-600 dark:text-gray-300 text-sm">平均绩点：{school.gpa}</p>}
            {school.rank && <p className="text-gray-600 dark:text-gray-300 text-sm">{school.rank}</p>}
            {school.publication && (
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {typeof school.publication === 'string' ? (
                  <p dangerouslySetInnerHTML={{ __html: school.publication }}></p>
                ) : (
                  <p>
                    <strong>一作</strong>发表SCI二区文章一篇：
                    <a 
                      href={school.publication.url} 
                      className="text-primary hover:text-primary/80" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      文章链接
                    </a>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </>
  )
} 