// 八卦数据
// 二进制表示：阳爻=1，阴爻=0
// 从下到上排列：第1个爻在最下面

window.DivinationData = window.DivinationData || {}

DivinationData.trigrams = {
  // 111 - 乾 (7)
  7: {
    name: "乾",
    symbol: "☰",
    nature: "天",
    attribute: "刚健",
    description: "天行健，君子以自强不息"
  },
  // 110 - 兑 (6)
  6: {
    name: "兑",
    symbol: "☱",
    nature: "泽",
    attribute: "喜悦",
    description: "泽润万物，以和悦待人"
  },
  // 101 - 离 (5)
  5: {
    name: "离",
    symbol: "☲",
    nature: "火",
    attribute: "光明",
    description: "离为火，明照四方"
  },
  // 100 - 震 (4)
  4: {
    name: "震",
    symbol: "☳",
    nature: "雷",
    attribute: "动",
    description: "震为雷，惊动万物"
  },
  // 011 - 巽 (3)
  3: {
    name: "巽",
    symbol: "☴",
    nature: "风",
    attribute: "入",
    description: "风行地上，无所不入"
  },
  // 010 - 坎 (2)
  2: {
    name: "坎",
    symbol: "☵",
    nature: "水",
    attribute: "险",
    description: "水流不息，以险行险"
  },
  // 001 - 艮 (1)
  1: {
    name: "艮",
    symbol: "☶",
    nature: "山",
    attribute: "止",
    description: "山止于地，当止则止"
  },
  // 000 - 坤 (0)
  0: {
    name: "坤",
    symbol: "☷",
    nature: "地",
    attribute: "柔顺",
    description: "地势坤，君子以厚德载物"
  }
}

// 根据三个爻计算八卦索引
// yao1是最下面的爻，yao3是最上面的爻
// 阳爻=1，阴爻=0
DivinationData.calculateTrigramIndex = function(yao1, yao2, yao3) {
  return yao1 * 1 + yao2 * 2 + yao3 * 4
}

// 获取八卦信息
DivinationData.getTrigram = function(index) {
  return DivinationData.trigrams[index] || DivinationData.trigrams[0]
}
