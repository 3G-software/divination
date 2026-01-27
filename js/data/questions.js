// 题库数据
// 每道题的选项A代表阳爻，选项B代表阴爻

// 全局命名空间
window.DivinationData = window.DivinationData || {}

// 通用题目
DivinationData.commonQuestions = [
  {
    question: "面对困难时，你倾向于？",
    optionA: "主动出击，迎难而上",
    optionB: "静观其变，等待时机"
  },
  {
    question: "做决定时，你更依赖？",
    optionA: "理性分析和逻辑判断",
    optionB: "直觉感受和内心声音"
  },
  {
    question: "在团队中，你更喜欢？",
    optionA: "担任领导，指挥全局",
    optionB: "配合他人，默默支持"
  },
  {
    question: "对于改变，你的态度是？",
    optionA: "积极拥抱，主动求变",
    optionB: "谨慎对待，稳中求进"
  },
  {
    question: "处理问题时，你偏好？",
    optionA: "果断快速，立即行动",
    optionB: "深思熟虑，周全考虑"
  },
  {
    question: "面对未知，你感到？",
    optionA: "兴奋期待，跃跃欲试",
    optionB: "小心谨慎，稳步探索"
  }
]

// 事业方向题目
DivinationData.careerQuestions = [
  {
    question: "你对目前的工作状态感觉如何？",
    optionA: "充满干劲，想要突破",
    optionB: "按部就班，稳定为主"
  },
  {
    question: "面对升职机会，你会？",
    optionA: "积极争取，展现实力",
    optionB: "顺其自然，不强求"
  },
  {
    question: "遇到职场挑战时，你倾向于？",
    optionA: "正面迎战，证明自己",
    optionB: "迂回处理，避免冲突"
  },
  {
    question: "对于职业发展，你更看重？",
    optionA: "快速晋升，获得认可",
    optionB: "稳步成长，积累经验"
  },
  {
    question: "工作中遇到阻力，你会？",
    optionA: "坚持己见，据理力争",
    optionB: "适当妥协，寻求共识"
  },
  {
    question: "对于新的工作机会，你？",
    optionA: "勇于尝试，不惧风险",
    optionB: "权衡利弊，稳妥为先"
  },
  {
    question: "你理想的工作节奏是？",
    optionA: "高强度，追求效率",
    optionB: "有张有弛，劳逸结合"
  },
  {
    question: "面对竞争对手，你会？",
    optionA: "奋起直追，超越对方",
    optionB: "专注自我，不被干扰"
  },
  {
    question: "工作压力大时，你倾向于？",
    optionA: "迎难而上，化压力为动力",
    optionB: "调整心态，寻找平衡"
  },
  {
    question: "对于职场人际关系，你认为？",
    optionA: "主动经营，拓展人脉",
    optionB: "随缘而安，真诚待人"
  }
]

// 感情方向题目
DivinationData.loveQuestions = [
  {
    question: "在感情中，你更倾向于？",
    optionA: "主动追求，表达心意",
    optionB: "等待缘分，被动接受"
  },
  {
    question: "对于理想的另一半，你期望？",
    optionA: "热情奔放，充满活力",
    optionB: "温柔体贴，沉稳可靠"
  },
  {
    question: "感情遇到问题时，你会？",
    optionA: "直接沟通，解决问题",
    optionB: "冷静思考，给予空间"
  },
  {
    question: "对于感情的投入，你？",
    optionA: "全心全意，毫无保留",
    optionB: "理性对待，保持自我"
  },
  {
    question: "面对分手的可能，你会？",
    optionA: "努力挽回，不轻言放弃",
    optionB: "尊重选择，好聚好散"
  },
  {
    question: "在恋爱中，你更看重？",
    optionA: "激情与浪漫",
    optionB: "稳定与安全感"
  },
  {
    question: "对于另一半的缺点，你？",
    optionA: "希望对方改变成长",
    optionB: "包容接纳，顺其自然"
  },
  {
    question: "约会时，你更喜欢？",
    optionA: "新鲜刺激的活动",
    optionB: "温馨舒适的相处"
  },
  {
    question: "对于未来的规划，你？",
    optionA: "早做打算，共同目标",
    optionB: "活在当下，顺其自然"
  },
  {
    question: "感情中的安全感来源于？",
    optionA: "明确的承诺和行动",
    optionB: "日常的陪伴和理解"
  }
]

// 财运方向题目
DivinationData.wealthQuestions = [
  {
    question: "对于投资，你的态度是？",
    optionA: "积极进取，追求高收益",
    optionB: "稳健保守，安全第一"
  },
  {
    question: "面对赚钱机会，你会？",
    optionA: "果断出手，抓住机遇",
    optionB: "谨慎评估，避免风险"
  },
  {
    question: "你的理财方式偏向？",
    optionA: "多元投资，分散布局",
    optionB: "集中储蓄，稳扎稳打"
  },
  {
    question: "对于额外支出，你？",
    optionA: "该花就花，享受生活",
    optionB: "精打细算，量入为出"
  },
  {
    question: "面对财务困境，你会？",
    optionA: "积极开源，寻找机会",
    optionB: "节流为主，减少开支"
  },
  {
    question: "对于借贷，你的看法是？",
    optionA: "合理利用，加速发展",
    optionB: "尽量避免，无债一身轻"
  },
  {
    question: "你对金钱的态度是？",
    optionA: "努力赚取，追求财富",
    optionB: "够用就好，知足常乐"
  },
  {
    question: "面对涨薪谈判，你会？",
    optionA: "主动争取，据理力争",
    optionB: "等待机会，相信付出会有回报"
  },
  {
    question: "副业和兼职，你？",
    optionA: "积极尝试，增加收入来源",
    optionB: "专注主业，不分散精力"
  },
  {
    question: "对于财务自由，你认为？",
    optionA: "需要冒险和突破",
    optionB: "需要耐心和积累"
  }
]

// 健康方向题目
DivinationData.healthQuestions = [
  {
    question: "对于运动健身，你？",
    optionA: "热衷参与，积极锻炼",
    optionB: "顺其自然，不太在意"
  },
  {
    question: "面对身体不适，你会？",
    optionA: "立即就医，积极治疗",
    optionB: "先观察，自我调理"
  },
  {
    question: "你的作息习惯是？",
    optionA: "早睡早起，规律作息",
    optionB: "随性而为，灵活安排"
  },
  {
    question: "对于饮食，你更倾向？",
    optionA: "严格控制，注重营养",
    optionB: "随心所欲，享受美食"
  },
  {
    question: "压力大时，你会？",
    optionA: "积极释放，运动发泄",
    optionB: "内心消化，静默承受"
  },
  {
    question: "对于养生保健，你？",
    optionA: "主动学习，积极实践",
    optionB: "听之任之，顺其自然"
  },
  {
    question: "你更倾向于哪种生活方式？",
    optionA: "充实忙碌，不虚度光阴",
    optionB: "悠闲自在，享受慢生活"
  },
  {
    question: "面对健康检查，你？",
    optionA: "定期体检，防患未然",
    optionB: "身体没问题就不检查"
  },
  {
    question: "对于不良习惯，你？",
    optionA: "下定决心，立即改正",
    optionB: "慢慢来，不急于一时"
  },
  {
    question: "心理健康方面，你？",
    optionA: "主动调节，保持积极",
    optionB: "随遇而安，淡然处之"
  }
]

// 学业方向题目
DivinationData.studyQuestions = [
  {
    question: "面对学习任务，你倾向于？",
    optionA: "提前规划，积极完成",
    optionB: "顺其自然，临近再说"
  },
  {
    question: "遇到难题时，你会？",
    optionA: "迎难而上，钻研到底",
    optionB: "先放一放，寻求帮助"
  },
  {
    question: "对于考试，你的心态是？",
    optionA: "全力以赴，追求优异",
    optionB: "尽力而为，顺其自然"
  },
  {
    question: "学习新知识时，你？",
    optionA: "主动探索，深入研究",
    optionB: "循序渐进，稳扎稳打"
  },
  {
    question: "面对学业压力，你会？",
    optionA: "化压力为动力，更加努力",
    optionB: "调整心态，保持平衡"
  },
  {
    question: "对于课外学习，你？",
    optionA: "积极拓展，广泛涉猎",
    optionB: "专注本职，不贪多求"
  },
  {
    question: "学习方法上，你偏好？",
    optionA: "高强度集中学习",
    optionB: "细水长流，持续积累"
  },
  {
    question: "面对竞争，你的态度是？",
    optionA: "力争上游，不甘落后",
    optionB: "与己竞争，超越自我"
  },
  {
    question: "对于学习目标，你？",
    optionA: "志向远大，追求卓越",
    optionB: "脚踏实地，稳步前进"
  },
  {
    question: "遇到学习瓶颈，你会？",
    optionA: "突破舒适区，寻求改变",
    optionB: "耐心坚持，等待突破"
  }
]

// 人际关系方向题目
DivinationData.socialQuestions = [
  {
    question: "在社交场合，你更倾向于？",
    optionA: "主动出击，结交新友",
    optionB: "静待机缘，随遇而安"
  },
  {
    question: "与人交往时，你？",
    optionA: "热情开朗，善于表达",
    optionB: "内敛含蓄，真诚相待"
  },
  {
    question: "面对人际冲突，你会？",
    optionA: "直接沟通，解决问题",
    optionB: "冷静退让，化解矛盾"
  },
  {
    question: "对于朋友圈，你？",
    optionA: "广交朋友，拓展人脉",
    optionB: "精选知己，深交几人"
  },
  {
    question: "遇到需要帮助的人，你？",
    optionA: "主动伸援，热心助人",
    optionB: "量力而行，适度帮助"
  },
  {
    question: "社交活动中，你？",
    optionA: "活跃积极，乐于参与",
    optionB: "选择性参加，保持距离"
  },
  {
    question: "面对误解，你会？",
    optionA: "主动解释，澄清事实",
    optionB: "时间证明，不急于辩解"
  },
  {
    question: "与人合作时，你？",
    optionA: "主导方向，积极推进",
    optionB: "配合协作，支持他人"
  },
  {
    question: "对于人际边界，你？",
    optionA: "坦诚相待，不设防线",
    optionB: "保持距离，有所保留"
  },
  {
    question: "维护关系上，你？",
    optionA: "主动联络，保持热度",
    optionB: "顺其自然，淡如水"
  }
]

// 出行方向题目
DivinationData.travelQuestions = [
  {
    question: "对于出行，你的态度是？",
    optionA: "说走就走，随性而行",
    optionB: "周密计划，稳妥安排"
  },
  {
    question: "旅途中遇到意外，你会？",
    optionA: "随机应变，化险为夷",
    optionB: "谨慎处理，寻求帮助"
  },
  {
    question: "选择目的地时，你偏好？",
    optionA: "探索未知，挑战新鲜",
    optionB: "熟悉可靠，安全为先"
  },
  {
    question: "出行方式上，你更喜欢？",
    optionA: "自由自在，自驾探险",
    optionB: "省心省力，跟团出行"
  },
  {
    question: "面对行程变化，你？",
    optionA: "灵活调整，顺势而为",
    optionB: "坚持原计划，按部就班"
  },
  {
    question: "旅途中，你更享受？",
    optionA: "丰富多彩的活动体验",
    optionB: "悠闲放松的休息时光"
  },
  {
    question: "对于旅行准备，你？",
    optionA: "轻装简行，随遇而安",
    optionB: "准备充分，有备无患"
  },
  {
    question: "出门在外，你？",
    optionA: "积极社交，结识路友",
    optionB: "享受独处，自在旅行"
  },
  {
    question: "面对陌生环境，你？",
    optionA: "兴奋探索，主动适应",
    optionB: "谨慎观察，逐步熟悉"
  },
  {
    question: "旅行的意义对你来说是？",
    optionA: "突破自我，寻求改变",
    optionB: "放松身心，调整状态"
  }
]

// 诸事方向题目（通用运势）
DivinationData.generalQuestions = [
  {
    question: "对于近期的运势，你感觉？",
    optionA: "充满期待，积极乐观",
    optionB: "顺其自然，平常心对待"
  },
  {
    question: "面对生活中的选择，你？",
    optionA: "果断决定，勇于尝试",
    optionB: "深思熟虑，稳妥为先"
  },
  {
    question: "对于未来，你的态度是？",
    optionA: "主动创造，把握命运",
    optionB: "随遇而安，顺势而为"
  },
  {
    question: "遇到好机会，你会？",
    optionA: "立即行动，抓住机遇",
    optionB: "仔细评估，谨慎决定"
  },
  {
    question: "面对生活变化，你？",
    optionA: "积极适应，主动调整",
    optionB: "稳中求进，保持节奏"
  },
  {
    question: "对于当下的状态，你？",
    optionA: "想要突破，寻求改变",
    optionB: "珍惜现有，稳定发展"
  },
  {
    question: "做重要决定时，你依赖？",
    optionA: "直觉和勇气",
    optionB: "分析和经验"
  },
  {
    question: "对于风险，你的态度是？",
    optionA: "机遇与风险并存，值得一试",
    optionB: "稳妥第一，规避风险"
  },
  {
    question: "近期的心态，你更接近？",
    optionA: "积极进取，充满斗志",
    optionB: "平和淡定，从容面对"
  },
  {
    question: "对于命运，你相信？",
    optionA: "事在人为，命由我定",
    optionB: "顺其自然，随缘而行"
  }
]

// 根据方向获取题库
DivinationData.getQuestionsByCategory = function(category) {
  var specificQuestions
  switch (category) {
    case 'career':
      specificQuestions = DivinationData.careerQuestions
      break
    case 'love':
      specificQuestions = DivinationData.loveQuestions
      break
    case 'wealth':
      specificQuestions = DivinationData.wealthQuestions
      break
    case 'health':
      specificQuestions = DivinationData.healthQuestions
      break
    case 'study':
      specificQuestions = DivinationData.studyQuestions
      break
    case 'social':
      specificQuestions = DivinationData.socialQuestions
      break
    case 'travel':
      specificQuestions = DivinationData.travelQuestions
      break
    case 'general':
      specificQuestions = DivinationData.generalQuestions
      break
    default:
      specificQuestions = DivinationData.generalQuestions
  }

  // 从通用题库随机取3道，从专属题库随机取3道
  var shuffledCommon = DivinationData.commonQuestions.slice().sort(function() { return Math.random() - 0.5 })
  var shuffledSpecific = specificQuestions.slice().sort(function() { return Math.random() - 0.5 })

  var selectedQuestions = shuffledCommon.slice(0, 3).concat(shuffledSpecific.slice(0, 3))

  return selectedQuestions
}
