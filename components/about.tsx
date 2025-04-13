"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Bike, Gamepad} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScratchCard } from "@/components/ui/scratch-card"
import { useState } from "react"
import { ExpandableEducationCard, type EducationCardType } from "@/components/ui/expandable-education-card"

export default function About() {
  const [isRevealed, setIsRevealed] = useState(false)
  
  const handleReveal = () => {
    setIsRevealed(true)
  }

  const schools: EducationCardType[] = [
    {
      school: "山东大学",
      logo: "/images/山东.svg",
      degree: "硕士",
      major: "控制工程",
      period: "2023.09 - 2026.06",
      gpa: "3.9",
      publication: {
        text: "一作发表SCI二区文章一篇",
        url: "https://www.sciencedirect.com/science/article/pii/S0263224125005731"
      },
      tags: [
        { label: "211", color: "blue" },
        { label: "985", color: "green" },
      ],
      content: (
        <div>
          <p>山东大学，简称"山大"，是中国历史最悠久的高等学府之一，其前身为1901年创办的山东大学堂。</p>
          <p className="mt-2">作为一所综合性研究型大学，山东大学在多个学科领域处于国内领先水平。</p>
          <p className="mt-2"><strong>研究方向</strong>：智能控制系统、深度强化学习算法研究</p>
          <p className="mt-2"><strong>核心课程</strong>：现代控制理论、深度学习、强化学习、机器视觉</p>
          <p className="mt-4"><strong>科研成果</strong>：</p>
          <ul className="list-disc list-inside pl-2 mt-1">
            <li><strong>一作</strong>发表SCI二区文章一篇：<a href="https://www.sciencedirect.com/science/article/pii/S0263224125005731" className="text-primary hover:text-primary/80" target="_blank" rel="noopener noreferrer">文章链接</a></li>
            <li>参与国家级科研项目2项</li>
            <li>获得研究生学业奖学金</li>
          </ul>
        </div>
      ),
    },
    {
      school: "青岛大学",
      logo: "/images/青岛.svg",
      degree: "本科",
      major: "自动化",
      period: "2019.09 - 2023.06",
      rank: "排名：2/100 保研",
      tags: [
        { label: "一本", color: "purple" },
      ],
      content: (
        <div>
          <p>青岛大学是山东省属重点综合大学，坐落于美丽的海滨城市青岛。</p>
          <p className="mt-2">学校以工科为主，同时注重多学科交叉培养，提供了良好的学习和科研环境。</p>
          <p className="mt-2"><strong>研究方向</strong>：自动控制系统、机器人控制与应用</p>
          <p className="mt-2"><strong>核心课程</strong>：自动控制原理、单片机原理、传感器技术、PLC编程技术</p>
          <p className="mt-4"><strong>主要成就</strong>：</p>
          <ul className="list-disc list-inside pl-2 mt-1">
            <li>连续三年获得校级一等奖学金</li>
            <li>获得全国大学生电子设计大赛省级一等奖</li>
            <li>主持校级科研创新项目：《基于深度学习的工业设备预测性维护系统》</li>
            <li>以优异成绩获保研资格，推免至山东大学</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section id="about" className="pt-10 pb-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">关于我</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            专注于构建高性能、可扩展的企业级应用，热衷于技术创新与工程实践。致力于打造优质的用户体验和可靠的系统架构。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">教育背景</h3>
                </div>
                <ExpandableEducationCard schools={schools} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">个人简介</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    我是一名专注于Java后端开发的工程师，拥有扎实的计算机科学基础和丰富的项目经验。
                    在学习和工作中，我不断探索新技术，提升自己的技术能力和解决问题的能力。
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    我热爱编程，善于团队协作，能够快速适应新环境和新技术。
                    我的目标是成为一名优秀的后端架构师，为用户提供高效、稳定的系统解决方案。
                  </p>
                  </div>

                  <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">兴趣爱好</h4>
                  
                  <ScratchCard
                    width={300}
                    height={120}
                    brushSize={50}
                    revealPercent={90}
                    onReveal={handleReveal}
                  >
                    <div className="flex flex-wrap gap-6 justify-center items-center p-3 bg-transparent w-full h-full">
                      <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-200">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 shadow-md">
                          <svg className="text-primary" viewBox="0 0 1024 1024" width="24" height="24">
                            <path
                              d="M687.37219 130.56a30.47619 30.47619 0 0 1 32.646096 24.478476l0.438857 3.096381 14.506667 157.842286c0.731429 7.94819-1.706667 15.823238-6.656 21.942857l-2.267429 2.535619L254.147048 806.741333a30.47619 30.47619 0 0 1-50.858667-29.574095l0.219429-0.682667-2.852572 0.487619a30.305524 30.305524 0 0 1-15.555048-2.462476l-2.950095-1.511619a30.47619 30.47619 0 0 1-12.507428-38.716952l1.511619-2.974476L504.05181 159.939048a30.47619 30.47619 0 0 1 20.382476-14.531048l3.218285-0.487619 159.719619-14.336z m-24.84419 63.414857l-113.737143 10.215619L238.884571 736.134095 672.938667 307.2l-10.410667-113.225143z"
                              fill="currentColor"
                            />
                            <path
                              d="M478.354286 17.505524a30.47619 30.47619 0 0 1 43.763809 15.555047l0.950857 2.974477 35.449905 132.754285a30.47619 30.47619 0 0 1-57.929143 18.67581l-0.975238-2.950095-25.185524-94.329905-85.699047 49.615238-176.542476 580.608 130.803809 141.482667a30.47619 30.47619 0 0 1 0.633905 40.71619l-2.316191 2.364952a30.47619 30.47619 0 0 1-40.691809 0.633905l-2.389333-2.31619-142.628572-154.331429a30.47619 30.47619 0 0 1-7.606857-26.063238l0.828952-3.462095 185.07581-608.841143c1.950476-6.339048 5.851429-11.824762 11.142095-15.701333l2.755048-1.804191 130.56-75.580952z"
                              fill="currentColor"
                            />
                            <path
                              d="M711.143619 286.622476l152.380952 14.506667a30.47619 30.47619 0 0 1 27.599239 29.866667l-0.121905 3.09638-13.824 159.695239a30.47619 30.47619 0 0 1-11.946667 21.674666l-2.681905 1.804191L310.759619 850.16381a30.47619 30.47619 0 0 1-34.255238-50.322286l2.755048-1.852953 538.502095-324.900571 9.898666-114.151619-122.294857-11.654095a30.47619 30.47619 0 0 1-27.599238-30.110476l0.146286-3.096381a30.47619 30.47619 0 0 1 30.110476-27.599239l3.120762 0.146286z"
                              fill="currentColor"
                            />
                            <path
                              d="M821.199238 483.693714a30.47619 30.47619 0 0 1 34.962286-21.113904l3.023238 0.731428 127.292952 38.4a30.47619 30.47619 0 0 1 19.675429 40.057905l-1.365333 3.023238-72.460191 141.385143a30.47619 30.47619 0 0 1-14.116571 13.653333l-3.120762 1.26781-576.707048 198.046476-60.367238 63.049143a30.47619 30.47619 0 0 1-40.569905 3.096381l-2.535619-2.194286a30.47619 30.47619 0 0 1-3.096381-40.545524l2.194286-2.535619 65.487238-68.388571a30.47619 30.47619 0 0 1 8.752762-6.339048l3.364571-1.389714 572.074667-196.461715 50.176-97.938285-92.281905-27.818667a30.47619 30.47619 0 0 1-21.138285-34.962286l0.755809-3.023238z"
                              fill="currentColor"
                            />
                            <path
                              d="M299.105524 928.060952l-186.075429-186.075428-40.496762 40.472381c-52.931048 52.931048-56.758857 137.045333-6.582857 187.245714l5.412572 5.412571c50.224762 50.200381 134.290286 46.34819 187.245714-6.582857l40.496762-40.472381z m-186.026667-99.84l99.718095 99.718096 2.706286-2.535619c-29.988571 29.988571-75.580952 32.085333-101.034667 6.607238l-5.412571-5.412572c-24.454095-24.454095-23.527619-67.462095 3.120762-97.401905l0.902095-0.975238zM277.552762 451.437714l312.07619 312.076191-43.105523 43.105524-312.076191-312.076191z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">羽毛球</span>
                      </div>
                      <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-200">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 shadow-md">
                          <svg className="text-primary" viewBox="0 0 1024 1024" width="24" height="24">
                            <path
                              d="M803.80586667 462.66595555m-85.9136 0a85.9136 85.9136 0 1 0 171.8272 0 85.9136 85.9136 0 1 0-171.8272 0Z"
                              fill="currentColor"
                            />
                            <path
                              d="M623.36568889 499.47306667c-14.10844445 0-27.59111111-8.10097778-33.792-21.8112l-41.2672-91.35217778-135.89617778-47.44533334c-19.31946667-6.72426667-29.52533333-27.86417778-22.76693333-47.18364444 6.7584-19.31946667 27.9552-29.57084445 47.18364444-22.76693333l150.90346667 52.67911111c9.60284445 3.35644445 17.39662222 10.46755555 21.56088889 19.72906666l47.83217777 105.84746667c8.41955555 18.64817778 0.12515555 40.57315555-18.52302222 49.01546667a37.06538667 37.06538667 0 0 1-15.23484444 3.28817778zM381.69031111 759.86488889c-16.62293333 0-32.71111111-2.12764445-48.24177778-6.39431111-36.88675555-10.12622222-62.54364445-30.06008889-83.17155555-46.06862223-22.41422222-17.39662222-34.95253333-26.46471111-52.84977778-26.70364445-23.10826667-0.02275555-49.20888889 14.98453333-76.34488889 45.52248889-13.60782222 15.29173333-37.00053333 16.66844445-52.31502222 3.06062222-15.29173333-13.60782222-16.66844445-37.02328889-3.06062222-52.31502222 41.54026667-46.6944 85.58364445-70.36017778 130.95822222-70.36017778h1.76355556c43.56551111 0.58026667 72.10097778 22.72142222 97.28 42.25706667 17.85173333 13.84675555 34.69084445 26.91982222 57.35537777 33.16622222 38.37724445 10.49031111 85.75431111-1.2288 140.93653333-34.85013333 17.46488889-10.68373333 40.25457778-5.14275555 50.91555556 12.32213333 10.66097778 17.46488889 5.14275555 40.27733333-12.32213333 50.91555556-53.95342222 32.90453333-104.51626667 49.44782222-150.88071112 49.44782222z"
                              fill="currentColor"
                            />
                            <path
                              d="M803.46453333 735.16373333c-16.64568889 0-32.75662222-2.12764445-48.26453333-6.39431111-36.88675555-10.12622222-62.54364445-30.06008889-83.17155555-46.06862222-22.41422222-17.39662222-34.95253333-26.46471111-52.84977778-26.70364445h-0.72817778c-23.32444445 0-48.77653333 15.29173333-75.61671111 45.5224889-13.60782222 15.26897778-37.00053333 16.66844445-52.31502223 3.06062222-15.29173333-13.60782222-16.66844445-37.02328889-3.06062222-52.31502222 41.54026667-46.6944 85.58364445-70.36017778 130.95822222-70.36017778h1.76355556c43.56551111 0.58026667 72.10097778 22.72142222 97.28 42.25706666 17.85173333 13.84675555 34.69084445 26.91982222 57.35537777 33.16622222 38.4 10.49031111 85.75431111-1.20604445 140.93653333-34.85013333 17.46488889-10.66097778 40.27733333-5.14275555 50.91555556 12.32213333 10.66097778 17.46488889 5.14275555 40.27733333-12.32213333 50.91555556-53.9648 32.92728889-104.52764445 49.44782222-150.88071112 49.44782222z"
                              fill="currentColor"
                            />
                            <path
                              d="M378.39075555 649.9328c1.17191111 3.53848889 2.99235555 6.63324445 5.14275556 9.44355555 31.36853333-0.22755555 67.43608889-12.47004445 107.73617778-36.4544 40.66417778-44.61226667 83.70631111-67.3792 128.03413333-67.3792h1.76355556c29.30915555 0.4096 51.73475555 10.61546667 70.99733333 23.16515556 11.60533333-8.10097778 17.14631111-23.02862222 12.44728889-37.14844444l-27.4432-82.57991112c-5.71164445-17.2032-24.29155555-26.51022222-41.49475555-20.79857777l-263.82791112 87.67715555c-17.2032 5.71164445-26.51022222 24.29155555-20.79857778 41.49475556l27.4432 82.57991111z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">游泳</span>
                      </div>
                      <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-200">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 shadow-md">
                          <Bike className="text-primary" />
                        </div>
                        <span className="text-sm font-medium">骑行</span>
                      </div>
                      <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-200">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 shadow-md">
                          <Gamepad className="text-primary" />
                        </div>
                        <span className="text-sm font-medium">Switch</span>
                      </div>
                    </div>
                  </ScratchCard>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
