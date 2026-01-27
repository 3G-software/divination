// 算卦核心逻辑
window.DivinationUtils = window.DivinationUtils || {}

// 八卦拼音映射
DivinationUtils.trigramPinyin = {
  '乾': 'qian', '坤': 'kun', '震': 'zhen', '巽': 'xun',
  '坎': 'kan', '离': 'li', '艮': 'gen', '兑': 'dui'
}

// 方向映射（中文到英文）
DivinationUtils.categoryMapping = {
  'love': '感情', 'wealth': '财运', 'career': '工作', 'health': '健康',
  'study': '学业', 'social': '人际关系', 'travel': '出行', 'general': '诸事'
}

// 缓存已加载的JSON数据
DivinationUtils.readingsCache = {}

/**
 * 获取卦象对应的JSON文件名
 * @param {String} lowerTrigramName - 下卦名
 * @param {String} upperTrigramName - 上卦名
 * @returns {String} 文件名
 */
DivinationUtils.getReadingFileName = function(lowerTrigramName, upperTrigramName) {
  var lowerPinyin = this.trigramPinyin[lowerTrigramName] || 'qian'
  var upperPinyin = this.trigramPinyin[upperTrigramName] || 'qian'
  return lowerPinyin + '_' + upperPinyin + '.json'
}

/**
 * 从JSON文件加载解读内容
 * @param {String} fileName - JSON文件名
 * @param {Function} callback - 回调函数(data)
 */
DivinationUtils.loadReadingFromFile = function(fileName, callback) {
  var self = this

  // 检查缓存
  if (this.readingsCache[fileName]) {
    callback(this.readingsCache[fileName])
    return
  }

  // 构建文件路径
  var filePath = 'text/' + fileName

  // 使用XMLHttpRequest加载JSON
  var xhr = new XMLHttpRequest()
  xhr.open('GET', filePath, true)
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText)
          self.readingsCache[fileName] = data
          callback(data)
        } catch (e) {
          console.warn('解析JSON文件失败:', fileName, e)
          callback(null)
        }
      } else {
        console.warn('加载JSON文件失败:', fileName)
        callback(null)
      }
    }
  }
  xhr.send()
}

/**
 * 获取指定方向的解读内容（从JSON文件）
 * @param {Object} divination - calculateDivination的返回结果
 * @param {String} category - 测算方向
 * @param {Function} callback - 回调函数(reading)
 */
DivinationUtils.getReadingFromFile = function(divination, category, callback) {
  var self = this
  var fileName = this.getReadingFileName(divination.lowerTrigram.name, divination.upperTrigram.name)
  var categoryName = this.categoryMapping[category] || '诸事'

  this.loadReadingFromFile(fileName, function(data) {
    if (data && data[categoryName]) {
      var reading = data[categoryName]

      // 处理解读内容
      var result = {
        // 当前状态：层1-层3各取一句拼成段落
        currentState: self.pickOneFromEachLayer(reading.核心状态),
        // 未来趋势：层1-层2各取一句拼成
        futureTrend: self.pickOneFromEachLayerTrend(reading.变化趋势),
        // 建议行动：随机选一个
        suggestion: self.pickRandom(reading.建议行动),
        // 一句话总结：随机选一个
        summary: self.pickRandom(reading.一句话总结),
        // 原始数据
        raw: reading
      }
      callback(result)
    } else {
      // 文件不存在或格式错误，使用默认生成
      callback(null)
    }
  })
}

/**
 * 从核心状态每层随机取一句
 */
DivinationUtils.pickOneFromEachLayer = function(coreStates) {
  if (!coreStates) return ''
  var sentences = []
  if (coreStates.层1 && coreStates.层1.length > 0) {
    sentences.push(this.pickRandom(coreStates.层1))
  }
  if (coreStates.层2 && coreStates.层2.length > 0) {
    sentences.push(this.pickRandom(coreStates.层2))
  }
  if (coreStates.层3 && coreStates.层3.length > 0) {
    sentences.push(this.pickRandom(coreStates.层3))
  }
  return sentences.join('')
}

/**
 * 从变化趋势每层随机取一句
 */
DivinationUtils.pickOneFromEachLayerTrend = function(trends) {
  if (!trends) return ''
  var sentences = []
  if (trends.层1 && trends.层1.length > 0) {
    sentences.push(this.pickRandom(trends.层1))
  }
  if (trends.层2 && trends.层2.length > 0) {
    sentences.push(this.pickRandom(trends.层2))
  }
  return sentences.join('')
}

/**
 * 从数组中随机选一个
 */
DivinationUtils.pickRandom = function(arr) {
  if (!arr || arr.length === 0) return ''
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 根据6个选择计算卦象
 * @param {Array} choices - 6个选择结果，true=阳爻，false=阴爻
 * @returns {Object} 包含上下卦和64卦的完整信息
 */
DivinationUtils.calculateDivination = function(choices) {
  // 验证输入
  if (!choices || choices.length !== 6) {
    throw new Error('需要6个选择来计算卦象')
  }

  // 将选择转换为数字：阳=1，阴=0
  var yaoValues = choices.map(function(choice) { return choice ? 1 : 0 })

  // 前3个选择构成下卦（当前状态）
  var lowerYao1 = yaoValues[0]
  var lowerYao2 = yaoValues[1]
  var lowerYao3 = yaoValues[2]
  var lowerTrigramIndex = DivinationData.calculateTrigramIndex(lowerYao1, lowerYao2, lowerYao3)
  var lowerTrigram = DivinationData.getTrigram(lowerTrigramIndex)

  // 后3个选择构成上卦（变化趋势）
  var upperYao1 = yaoValues[3]
  var upperYao2 = yaoValues[4]
  var upperYao3 = yaoValues[5]
  var upperTrigramIndex = DivinationData.calculateTrigramIndex(upperYao1, upperYao2, upperYao3)
  var upperTrigram = DivinationData.getTrigram(upperTrigramIndex)

  // 获取64卦
  var hexagram = DivinationData.getHexagram(upperTrigramIndex, lowerTrigramIndex)

  return {
    choices: choices,
    yaoValues: yaoValues,
    lowerTrigram: Object.assign({ index: lowerTrigramIndex }, lowerTrigram),
    upperTrigram: Object.assign({ index: upperTrigramIndex }, upperTrigram),
    hexagram: hexagram
  }
}

/**
 * 获取指定方向的解读
 * @param {Object} divination - calculateDivination的返回结果
 * @param {String} category - 测算方向：career/love/wealth/health
 * @returns {String} 解读文本
 */
DivinationUtils.getCategoryReading = function(divination, category) {
  return DivinationData.getReading(divination.hexagram, category)
}

/**
 * 生成爻象显示数据
 * @param {Array} yaoValues - 6个爻的值数组
 * @returns {Array} 从下到上的爻象显示数据
 */
DivinationUtils.generateYaoDisplay = function(yaoValues) {
  var display = []
  for (var i = 0; i < 6; i++) {
    display.push({
      index: i,
      isYang: yaoValues[i] === 1,
      symbol: yaoValues[i] === 1 ? '━━━━━' : '━━ ━━',
      position: i < 3 ? 'lower' : 'upper'
    })
  }
  return display
}

/**
 * 获取卦象的整体描述
 * @param {Object} divination - calculateDivination的返回结果
 * @returns {Object} 卦象描述
 */
DivinationUtils.getHexagramDescription = function(divination) {
  return {
    name: divination.hexagram.name,
    symbol: divination.hexagram.symbol,
    upperDescription: '上卦' + divination.upperTrigram.name + '（' + divination.upperTrigram.nature + '）：' + divination.upperTrigram.description,
    lowerDescription: '下卦' + divination.lowerTrigram.name + '（' + divination.lowerTrigram.nature + '）：' + divination.lowerTrigram.description,
    composition: divination.upperTrigram.symbol + ' ' + divination.upperTrigram.name + divination.upperTrigram.nature + ' + ' + divination.lowerTrigram.symbol + ' ' + divination.lowerTrigram.name + divination.lowerTrigram.nature
  }
}

/**
 * 获取结构化的解读结果（新格式）
 * @param {Object} divination - calculateDivination的返回结果
 * @param {String} category - 测算方向
 * @returns {Object} 结构化解读
 */
DivinationUtils.getStructuredReading = function(divination, category) {
  var categoryNames = {
    love: '感情', wealth: '财运', career: '工作', health: '健康',
    study: '学业', social: '人际关系', travel: '出行', general: '诸事'
  }

  var hexagram = divination.hexagram
  var upper = divination.upperTrigram
  var lower = divination.lowerTrigram

  // 获取基础解读文本
  var baseReading = DivinationData.getReading(hexagram, category)

  // 生成核心状态
  var coreStates = DivinationUtils.generateCoreStates(hexagram, upper, lower, category)

  // 生成变化趋势
  var trends = DivinationUtils.generateTrends(hexagram, upper, lower, category)

  // 生成建议行动
  var suggestions = DivinationUtils.generateSuggestions(hexagram, upper, lower, category)

  // 生成一句话总结
  var summaries = DivinationUtils.generateSummaries(hexagram, upper, lower, category)

  return {
    本卦: lower.name,
    变卦: upper.name,
    方向: categoryNames[category] || category,
    卦名: hexagram.name,
    核心状态: coreStates,
    变化趋势: trends,
    建议行动: suggestions,
    一句话总结: summaries,
    baseReading: baseReading
  }
}

/**
 * 生成核心状态描述
 */
DivinationUtils.generateCoreStates = function(hexagram, upper, lower, category) {
  var templates = DivinationUtils.getTemplates(category)
  var attrs = DivinationUtils.getTrigramAttributes(lower, upper)

  return {
    层1: templates.core1.map(function(t) {
      return DivinationUtils.fillTemplate(t, attrs)
    }),
    层2: templates.core2.map(function(t) {
      return DivinationUtils.fillTemplate(t, attrs)
    })
  }
}

/**
 * 生成变化趋势描述
 */
DivinationUtils.generateTrends = function(hexagram, upper, lower, category) {
  var templates = DivinationUtils.getTemplates(category)
  var attrs = DivinationUtils.getTrigramAttributes(lower, upper)

  return {
    层1: templates.trend1.map(function(t) {
      return DivinationUtils.fillTemplate(t, attrs)
    }),
    层2: templates.trend2.map(function(t) {
      return DivinationUtils.fillTemplate(t, attrs)
    })
  }
}

/**
 * 生成建议行动
 */
DivinationUtils.generateSuggestions = function(hexagram, upper, lower, category) {
  var templates = DivinationUtils.getTemplates(category)
  var attrs = DivinationUtils.getTrigramAttributes(lower, upper)

  return templates.suggestions.map(function(t) {
    return DivinationUtils.fillTemplate(t, attrs)
  })
}

/**
 * 生成一句话总结
 */
DivinationUtils.generateSummaries = function(hexagram, upper, lower, category) {
  var templates = DivinationUtils.getTemplates(category)
  var attrs = DivinationUtils.getTrigramAttributes(lower, upper)

  return templates.summaries.map(function(t) {
    return DivinationUtils.fillTemplate(t, attrs)
  })
}

/**
 * 获取八卦属性
 */
DivinationUtils.getTrigramAttributes = function(lower, upper) {
  var natureMap = {
    '天': { positive: '刚健进取', negative: '过于强势', advice: '守正不骄' },
    '地': { positive: '厚德载物', negative: '过于被动', advice: '稳中求进' },
    '雷': { positive: '果断行动', negative: '过于急躁', advice: '三思后行' },
    '风': { positive: '灵活变通', negative: '不够坚定', advice: '顺势而为' },
    '水': { positive: '智慧深沉', negative: '过于谨慎', advice: '以柔克刚' },
    '火': { positive: '光明热情', negative: '过于张扬', advice: '内敛修身' },
    '山': { positive: '稳重踏实', negative: '过于保守', advice: '静待时机' },
    '泽': { positive: '和悦喜乐', negative: '过于随和', advice: '把握分寸' }
  }

  var lowerAttr = natureMap[lower.nature] || natureMap['天']
  var upperAttr = natureMap[upper.nature] || natureMap['天']

  return {
    lowerName: lower.name,
    upperName: upper.name,
    lowerNature: lower.nature,
    upperNature: upper.nature,
    lowerPositive: lowerAttr.positive,
    lowerNegative: lowerAttr.negative,
    lowerAdvice: lowerAttr.advice,
    upperPositive: upperAttr.positive,
    upperNegative: upperAttr.negative,
    upperAdvice: upperAttr.advice
  }
}

/**
 * 填充模板
 */
DivinationUtils.fillTemplate = function(template, attrs) {
  var result = template
  for (var key in attrs) {
    result = result.replace(new RegExp('\\{' + key + '\\}', 'g'), attrs[key])
  }
  return result
}

/**
 * 获取分类模板
 */
DivinationUtils.getTemplates = function(category) {
  var templates = {
    love: {
      core1: [
        '近期你在感情中展现出{lowerPositive}的特质，内心有明确的方向。',
        '你对感情充满期待，愿意主动表达心意，展现真诚与用心。',
        '面对感情中的小波折，你能够坦然面对，不轻易放弃。'
      ],
      core2: [
        '你在感情中{lowerPositive}，不过有时需要注意{lowerNegative}的倾向。',
        '你愿意为感情付出时间精力，这份用心能让彼此距离慢慢拉近。',
        '面对感情的不确定性，保持{lowerAdvice}的心态会更好。'
      ],
      trend1: [
        '未来几天，感情会朝着{upperPositive}的方向发展。',
        '之前的小矛盾会逐渐化解，彼此的理解会更深。',
        '你会找到与对方相处的最佳模式，感情更加稳定。'
      ],
      trend2: [
        '感情发展整体向好，{upperAdvice}是关键。',
        '虽然可能有小的波动，但只要保持真诚，都能顺利度过。'
      ],
      suggestions: [
        '保持真诚的同时多倾听对方想法，{lowerAdvice}。',
        '给对方适当的空间，不要{lowerNegative}。',
        '珍惜当下的相处时光，用心感受彼此的情绪。'
      ],
      summaries: [
        '{lowerNature}卦守正，{lowerPositive}，感情顺遂。',
        '以真心换真心，{upperAdvice}，爱意绵长。'
      ]
    },
    wealth: {
      core1: [
        '近期你的财运展现出{lowerPositive}的特质，有明确的理财思路。',
        '你对财富有清晰的规划，愿意付出努力寻找机会。',
        '面对财务决策，你能够{lowerPositive}地分析判断。'
      ],
      core2: [
        '你的理财风格{lowerPositive}，不过需注意{lowerNegative}的倾向。',
        '你善于把握机会，这份眼光能带来不错的收益。',
        '{lowerAdvice}是当前理财的关键。'
      ],
      trend1: [
        '未来几天，财运会朝着{upperPositive}的方向发展。',
        '之前的投资布局会逐渐见到成效。',
        '新的理财机会可能出现，保持敏锐的洞察力。'
      ],
      trend2: [
        '财运整体向好，{upperAdvice}是关键。',
        '虽然可能有小波动，但整体趋势向上。'
      ],
      suggestions: [
        '保持{lowerPositive}的同时注意风险控制。',
        '避免{lowerNegative}，理性决策。',
        '{upperAdvice}，稳健理财。'
      ],
      summaries: [
        '{lowerNature}卦行运，{lowerPositive}，财源广进。',
        '{upperAdvice}，稳中求财，收益可期。'
      ]
    },
    career: {
      core1: [
        '近期你在工作中展现出{lowerPositive}的特质，目标清晰。',
        '你对自己的工作能力有信心，敢于接受挑战。',
        '面对工作中的困难，你能够{lowerPositive}地应对。'
      ],
      core2: [
        '你的工作风格{lowerPositive}，不过需注意{lowerNegative}。',
        '你善于规划和执行，这份能力让你脱颖而出。',
        '{lowerAdvice}是职场发展的关键。'
      ],
      trend1: [
        '未来几天，工作会朝着{upperPositive}的方向发展。',
        '之前的努力会逐渐得到认可。',
        '可能出现新的发展机会，保持积极的态度。'
      ],
      trend2: [
        '工作发展整体向好，{upperAdvice}是关键。',
        '虽然可能有挑战，但都能顺利克服。'
      ],
      suggestions: [
        '保持{lowerPositive}的同时注重团队协作。',
        '避免{lowerNegative}，多听取建议。',
        '{upperAdvice}，稳步前进。'
      ],
      summaries: [
        '{lowerNature}卦进取，{lowerPositive}，事业顺遂。',
        '{upperAdvice}，脚踏实地，前途光明。'
      ]
    },
    health: {
      core1: [
        '近期你的身体状态整体{lowerPositive}，精力充沛。',
        '你有较强的健康意识，注重生活规律。',
        '面对身体的小信号，你能够及时调整。'
      ],
      core2: [
        '你的生活方式{lowerPositive}，不过需注意{lowerNegative}。',
        '保持规律作息是健康的基础。',
        '{lowerAdvice}有助于身心平衡。'
      ],
      trend1: [
        '未来几天，身体状态会继续保持{upperPositive}。',
        '之前的不适会逐渐缓解。',
        '精力和体能都会有所提升。'
      ],
      trend2: [
        '健康状态整体向好，{upperAdvice}是关键。',
        '保持良好的生活习惯，健康自然而来。'
      ],
      suggestions: [
        '保持{lowerPositive}的生活态度。',
        '避免{lowerNegative}，劳逸结合。',
        '{upperAdvice}，身心皆宜。'
      ],
      summaries: [
        '{lowerNature}卦守健，{lowerPositive}，身心康泰。',
        '{upperAdvice}，作息有度，健康长久。'
      ]
    },
    study: {
      core1: [
        '近期你在学业上展现出{lowerPositive}的特质，目标明确。',
        '你对学习充满热情，愿意钻研难题。',
        '面对学习中的困难，你能够{lowerPositive}地克服。'
      ],
      core2: [
        '你的学习风格{lowerPositive}，不过需注意{lowerNegative}。',
        '扎实的基础是学业进步的关键。',
        '{lowerAdvice}能让学习更高效。'
      ],
      trend1: [
        '未来几天，学习效率会{upperPositive}地提升。',
        '之前的知识积累会逐渐显现效果。',
        '可能在某个难点上有所突破。'
      ],
      trend2: [
        '学业发展整体向好，{upperAdvice}是关键。',
        '保持学习的热情，成绩自然提升。'
      ],
      suggestions: [
        '保持{lowerPositive}的学习态度。',
        '避免{lowerNegative}，注重基础。',
        '{upperAdvice}，循序渐进。'
      ],
      summaries: [
        '{lowerNature}卦励学，{lowerPositive}，学业精进。',
        '{upperAdvice}，勤学不辍，终有所成。'
      ]
    },
    social: {
      core1: [
        '近期你在人际交往中展现出{lowerPositive}的特质。',
        '你善于与人沟通，能够建立良好的关系。',
        '面对人际矛盾，你能够{lowerPositive}地化解。'
      ],
      core2: [
        '你的社交风格{lowerPositive}，不过需注意{lowerNegative}。',
        '真诚待人是人际关系的基础。',
        '{lowerAdvice}能让人缘更好。'
      ],
      trend1: [
        '未来几天，人际关系会朝着{upperPositive}的方向发展。',
        '可能结交到志同道合的朋友。',
        '之前的误解会逐渐消除。'
      ],
      trend2: [
        '人际关系整体向好，{upperAdvice}是关键。',
        '保持真诚，友谊自然长久。'
      ],
      suggestions: [
        '保持{lowerPositive}的同时多倾听他人。',
        '避免{lowerNegative}，真诚待人。',
        '{upperAdvice}，和气生财。'
      ],
      summaries: [
        '{lowerNature}卦交游，{lowerPositive}，人缘广阔。',
        '{upperAdvice}，以诚相待，友谊长存。'
      ]
    },
    travel: {
      core1: [
        '近期你对出行有{lowerPositive}的规划和准备。',
        '你善于安排行程，能够应对各种情况。',
        '面对旅途中的变化，你能够{lowerPositive}地调整。'
      ],
      core2: [
        '你的出行风格{lowerPositive}，不过需注意{lowerNegative}。',
        '充分的准备是顺利出行的基础。',
        '{lowerAdvice}能让旅途更愉快。'
      ],
      trend1: [
        '未来几天，出行会朝着{upperPositive}的方向发展。',
        '旅途中可能有意外的惊喜。',
        '整体行程会比较顺利。'
      ],
      trend2: [
        '出行运势整体向好，{upperAdvice}是关键。',
        '保持灵活的心态，享受旅途。'
      ],
      suggestions: [
        '保持{lowerPositive}的准备态度。',
        '避免{lowerNegative}，随遇而安。',
        '{upperAdvice}，一路顺风。'
      ],
      summaries: [
        '{lowerNature}卦出行，{lowerPositive}，旅途顺遂。',
        '{upperAdvice}，心向远方，平安归来。'
      ]
    },
    general: {
      core1: [
        '近期你的整体运势展现出{lowerPositive}的特质。',
        '你对生活充满信心，能够把握机遇。',
        '面对各种事务，你能够{lowerPositive}地处理。'
      ],
      core2: [
        '你的生活态度{lowerPositive}，不过需注意{lowerNegative}。',
        '积极的心态是好运的基础。',
        '{lowerAdvice}能让诸事更顺。'
      ],
      trend1: [
        '未来几天，整体运势会朝着{upperPositive}的方向发展。',
        '之前的努力会逐渐有所回报。',
        '可能出现新的机遇。'
      ],
      trend2: [
        '整体运势向好，{upperAdvice}是关键。',
        '保持积极的心态，好运自来。'
      ],
      suggestions: [
        '保持{lowerPositive}的生活态度。',
        '避免{lowerNegative}，把握当下。',
        '{upperAdvice}，诸事顺遂。'
      ],
      summaries: [
        '{lowerNature}卦行运，{lowerPositive}，万事顺遂。',
        '{upperAdvice}，守正待时，福运绑身。'
      ]
    }
  }

  return templates[category] || templates.general
}
