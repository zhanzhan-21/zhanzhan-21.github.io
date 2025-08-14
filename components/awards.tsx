"use client"

import { motion } from "framer-motion"
import { Award, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AwardsCarousel from "@/components/3d/AwardsCarousel"
import { CardPinEffect } from "@/components/3d/PinEffect"
import { useState, useEffect } from "react"
import { HoverCardEffect } from "@/components/ui/hover-card-effect"

export default function Awards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // 客户端挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 定义可用于奖项的颜色列表
  const colors = [
    "emerald", "blue", "yellow", "red", "purple", "teal", "orange", "pink"
  ] as const;
  
  type AwardColor = typeof colors[number];
  
  // 为边框颜色创建映射
  const borderColorMap: Record<AwardColor, string> = {
    emerald: 'border-emerald-400/30 dark:border-emerald-600/30',
    blue: 'border-blue-400/30 dark:border-blue-600/30',
    yellow: 'border-yellow-400/30 dark:border-yellow-600/30',
    red: 'border-red-400/30 dark:border-red-600/30',
    purple: 'border-purple-400/30 dark:border-purple-600/30',
    teal: 'border-teal-400/30 dark:border-teal-600/30',
    orange: 'border-orange-400/30 dark:border-orange-600/30',
    pink: 'border-pink-400/30 dark:border-pink-600/30',
  };
  
  // 为不同级别的奖项定义不同的徽章样式
  const getLevelBadgeStyle = (level: string) => {
    switch(level) {
      case '国家级':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      case '省级':
        return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case '校级':
      default:
        return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
    }
  };
  
  const awards = [
    {
      title: "第十五届山东大学学生五四青年科学奖",
      url: "https://control.sdu.edu.cn/info/1033/6944.htm",
      date: "2024",
      level: "校级",
      hasLink: true,
      image: "/images/第十五届山东大学学生五四青年科学奖（集体）.jpg", // 更新为实际证书图片
    },
    {
      title: "优秀共青团员",
      date: "2025",
      level: "校级",
      hasLink: false,
      image: "/images/优秀共青团员.jpg", 
    },
    {
      title: '"华为杯"中国研究生数学建模竞赛 三等奖',
      date: "2024", // 更新时间从2022改为2024
      level: "国家级",
      hasLink: false,
      image: "/images/数学建模三等奖.png",
    },
    {
      title: "山东大学创新创业活动先进个人",
      date: "2024", // 更新时间从2023改为2024
      level: "校级",
      hasLink: false,
      image: "/images/山东大学2024年度学生创新创业活动先进个人.jpg", // 更新为实际证书图片
    },
    {
      title: "山东大学2023年度优秀研究生",
      date: "2023",
      level: "校级",
      hasLink: false,
      image: "/images/award-placeholder5.svg",
    },
    {
      title: "山东大学2022年度硕士新生二等学业奖学金",
      date: "2022",
      level: "校级",
      hasLink: false,
      image: "/images/award-placeholder6.svg",
    },
    {
      title: "优秀毕业生",
      date: "2023",
      level: "校级",
      hasLink: false,
      image: "/images/award-placeholder7.svg",
    },
    {
      title: "青岛大学百名优秀学生", // 将"全国大学生数学建模竞赛西北赛区二等奖"替换为"青岛大学百名优秀学生"
      date: "2020", // 更新日期
      level: "校级", // 更新级别
      hasLink: false,
      image: "/images/青岛大学百名优秀学生.jpg", // 更新为实际证书图片
    },
  ]

  const renderAwardContent = (award: typeof awards[0], index: number, isHovered: boolean) => (
    <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 h-full transition-all duration-300 overflow-hidden">
      <Award className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
      <div>
        <div className="flex items-center gap-1 mb-2">
          <h3 className={`font-semibold ${isHovered ? "text-primary" : ""} transition-colors`}>{award.title}</h3>
          {award.hasLink && (
            <ExternalLink className={`h-4 w-4 ${isHovered ? "text-primary" : "text-muted-foreground"} transition-colors`} />
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{award.date}</span>
        </div>
        <Badge variant="outline" className={getLevelBadgeStyle(award.level)}>{award.level}</Badge>
      </div>
    </div>
  );

  // 创建HoverCardEffect所需的items数组
  const hoverCardItems = awards.map((award, index) => {
    // 为每个奖项选择一个颜色，使用取模运算保证索引在范围内
    const color = colors[index % colors.length] as AwardColor;
    const borderColor = borderColorMap[color];
    
    // 为每种颜色定义对应的阴影颜色
    const shadowColorMap: Record<AwardColor, string> = {
      emerald: 'hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20',
      blue: 'hover:shadow-blue-100 dark:hover:shadow-blue-900/20',
      yellow: 'hover:shadow-yellow-100 dark:hover:shadow-yellow-900/20',
      red: 'hover:shadow-red-100 dark:hover:shadow-red-900/20',
      purple: 'hover:shadow-purple-100 dark:hover:shadow-purple-900/20',
      teal: 'hover:shadow-teal-100 dark:hover:shadow-teal-900/20',
      orange: 'hover:shadow-orange-100 dark:hover:shadow-orange-900/20',
      pink: 'hover:shadow-pink-100 dark:hover:shadow-pink-900/20',
    };
    
    const shadowColor = shadowColorMap[color];
    
    return {
      title: award.title,
      description: `${award.date} | ${award.level}`,
      link: award.url || undefined,
      // 为第一个项目标记已有嵌套链接
      hasNestedLink: index === 0,
      content: (
        index === 0 ? (
          <div className="h-full relative" style={{ overflow: 'visible' }}>
            <CardPinEffect 
              isActive={hoveredIndex === 0}
              title="查看详情"
              href={award.url}
              color={color}
            >
              <div className={`p-6 bg-white dark:bg-zinc-900 rounded-xl border h-full transition-all duration-300 ${hoveredIndex === 0 ? borderColor : 'border-gray-200 dark:border-gray-800'}`}>
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      <h3 className="font-semibold text-primary transition-colors">{award.title}</h3>
                      {award.hasLink && (
                        <ExternalLink className="h-4 w-4 text-primary transition-colors ml-1" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{award.date}</span>
                      </div>
                      <Badge className={`ml-2 ${getLevelBadgeStyle(award.level)}`}>{award.level}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardPinEffect>
          </div>
        ) : (
          <Card className={`h-full shadow-md transition-all duration-300 ${shadowColor}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Award className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <h3 className="font-semibold text-primary transition-colors">{award.title}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{award.date}</span>
                    </div>
                    <Badge className={`ml-2 ${getLevelBadgeStyle(award.level)}`}>{award.level}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )
    };
  });

  return (
    <section id="awards" className="pt-10 pb-20 px-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* 添加装饰性背景元素 */}
      <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-emerald-100/30 dark:bg-emerald-900/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-emerald-50/40 dark:bg-emerald-800/10 blur-3xl -z-10"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">荣誉奖励</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-10">我在学术和专业领域获得的一些荣誉和奖项</p>
        </motion.div>
        
        {/* 添加奖项轮播展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <AwardsCarousel awards={awards} />
        </motion.div>

        {/* 移动端奖项统计展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:hidden"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">奖项统计</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {awards.filter(award => award.level === '国家级').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">国家级</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {awards.filter(award => award.level === '省级').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">省级</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {awards.filter(award => award.level === '校级').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">校级</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              共获得 {awards.length} 项荣誉奖项
            </div>
          </div>
        </motion.div>

        {/* 使用新的悬停效果卡片网格展示 - 仅在桌面端显示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 hidden md:block"
        >
          <h3 className="text-xl font-semibold inline-block border-b-2 border-primary pb-1">所有奖项列表</h3>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="hidden md:block"
        >
          <HoverCardEffect 
            items={hoverCardItems} 
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </motion.div>
      </div>
    </section>
  )
}
