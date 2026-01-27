// 问题场景 - 回答6道题目（神秘版）
var QuestionScene = new Phaser.Class({
  Extends: Phaser.Scene,

  // 字体配置
  FONTS: {
    title: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    body: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    accent: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif'
  },

  initialize: function QuestionScene() {
    Phaser.Scene.call(this, { key: 'QuestionScene' })
  },

  // 获取DPR缩放后的字体大小
  fontSize: function(size) {
    var dpr = this.game.dpr || 1
    return Math.round(size * dpr) + 'px'
  },

  // 获取DPR缩放后的数值
  sz: function(value) {
    var dpr = this.game.dpr || 1
    return Math.round(value * dpr)
  },

  init: function(data) {
    this.category = data.category || 'career'
    this.questions = DivinationData.getQuestionsByCategory(this.category)
    this.currentQuestionIndex = 0
    this.choices = []
    this.isTransitioning = false // 防止连续点击
  },

  create: function() {
    var width = this.cameras.main.width
    var height = this.cameras.main.height

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // 创建神秘背景
    this.createMysticalBackground(width, height)

    // 创建UI元素
    this.createHeader(width)
    this.createProgressBar(width)
    this.createQuestionArea(width, height)
    this.createMysteryIndicator(width, height)

    // 显示第一道题
    this.showQuestion()
  },

  getCategoryName: function() {
    var names = {
      career: '事业运势',
      love: '感情姻缘',
      wealth: '财富运势',
      health: '健康运势'
    }
    return names[this.category] || '运势'
  },

  createMysticalBackground: function(width, height) {
    var self = this
    // 添加神秘符号背景
    var symbols = ['✧', '✦', '◇', '○', '·']
    for (var i = 0; i < 8; i++) {
      var x = Math.random() * width
      var y = Math.random() * height
      var symbol = symbols[Math.floor(Math.random() * symbols.length)]

      var mystSymbol = this.add.text(x, y, symbol, {
        fontSize: this.fontSize(12 + Math.random() * 16),
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0.05 + Math.random() * 0.08)

      this.tweens.add({
        targets: mystSymbol,
        alpha: 0.02,
        y: y - self.sz(15),
        duration: 2000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  },

  createHeader: function(width) {
    var self = this

    // 返回按钮
    var backBtn = this.add.text(this.sz(20), this.sz(40), '‹ 返回', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.body,
      color: '#9aa5b5',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5)

    backBtn.setInteractive({ useHandCursor: true })
    backBtn.on('pointerover', function() { backBtn.setColor('#ffffff') })
    backBtn.on('pointerout', function() { backBtn.setColor('#9aa5b5') })
    backBtn.on('pointerdown', function() {
      self.scene.start('StartScene')
    })

    // 标题
    this.add.text(width / 2, this.sz(40), this.getCategoryName(), {
      fontSize: this.fontSize(26),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // 题号
    this.questionNumber = this.add.text(width - this.sz(20), this.sz(40), '第 1 问', {
      fontSize: this.fontSize(18),
      fontFamily: this.FONTS.body,
      color: '#a8b4c0'
    }).setOrigin(1, 0.5)
  },

  createProgressBar: function(width) {
    var y = this.sz(75)
    var barWidth = width - this.sz(40)
    var barHeight = this.sz(6)

    // 背景条
    this.progressBg = this.add.rectangle(width / 2, y, barWidth, barHeight, 0x2d3748)

    // 进度条
    this.progressBar = this.add.rectangle(this.sz(20), y, 0, barHeight, 0xffd700)
    this.progressBar.setOrigin(0, 0.5)
  },

  createQuestionArea: function(width, height) {
    // 问题区域背景
    var questionBg = this.add.rectangle(width / 2, height * 0.26, width - this.sz(40), this.sz(110), 0x16213e)
    questionBg.setStrokeStyle(this.sz(1), 0x4a5568)

    // 问题文字
    this.questionText = this.add.text(width / 2, height * 0.26, '', {
      fontSize: this.fontSize(22),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'center',
      wordWrap: { width: width - this.sz(80) },
      lineSpacing: this.sz(12)
    }).setOrigin(0.5)

    // 选项按钮
    this.createOptionButtons(width, height)
  },

  createOptionButtons: function(width, height) {
    var self = this
    var optionY = height * 0.44
    var optionHeight = this.sz(90)
    var optionWidth = width - this.sz(60)
    var spacing = this.sz(16)

    // 选项A容器
    this.optionAContainer = this.add.container(width / 2, optionY)
    var optionABg = this.add.rectangle(0, 0, optionWidth, optionHeight, 0x3182ce, 0.2)
    optionABg.setStrokeStyle(this.sz(2), 0x3182ce)

    this.optionAText = this.add.text(0, 0, '', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'center',
      wordWrap: { width: optionWidth - this.sz(40) },
      lineSpacing: this.sz(10)
    }).setOrigin(0.5)

    this.optionAContainer.add([optionABg, this.optionAText])

    // 选项B容器
    this.optionBContainer = this.add.container(width / 2, optionY + optionHeight + spacing)
    var optionBBg = this.add.rectangle(0, 0, optionWidth, optionHeight, 0x805ad5, 0.2)
    optionBBg.setStrokeStyle(this.sz(2), 0x805ad5)

    this.optionBText = this.add.text(0, 0, '', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'center',
      wordWrap: { width: optionWidth - this.sz(40) },
      lineSpacing: this.sz(10)
    }).setOrigin(0.5)

    this.optionBContainer.add([optionBBg, this.optionBText])

    // 交互设置
    this.setupOptionInteraction(optionABg, this.optionAContainer, 0x3182ce, true)
    this.setupOptionInteraction(optionBBg, this.optionBContainer, 0x805ad5, false)
  },

  setupOptionInteraction: function(bg, container, color, isYang) {
    var self = this
    bg.setInteractive({ useHandCursor: true })

    bg.on('pointerover', function() {
      bg.setFillStyle(color, 0.4)
      self.tweens.add({
        targets: container,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 100
      })
    })

    bg.on('pointerout', function() {
      bg.setFillStyle(color, 0.2)
      self.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      })
    })

    bg.on('pointerdown', function() {
      self.selectOption(isYang, container)
    })
  },

  createMysteryIndicator: function(width, height) {
    // 预留底部广告位高度
    var adBannerHeight = this.sz(60)
    var contentBottom = height - adBannerHeight
    var indicatorY = contentBottom - this.sz(100)

    // 神秘提示文字
    this.mysteryText = this.add.text(width / 2, indicatorY - this.sz(20), '天机正在凝聚...', {
      fontSize: this.fontSize(17),
      fontFamily: this.FONTS.accent,
      color: '#9aa5b5'
    }).setOrigin(0.5)

    // 旋转的八卦符号
    this.taijiSymbol = this.add.text(width / 2, indicatorY + this.sz(30), '☯', {
      fontSize: this.fontSize(40),
      color: '#ffd700'
    }).setOrigin(0.5).setAlpha(0.4)

    this.tweens.add({
      targets: this.taijiSymbol,
      angle: 360,
      duration: 8000,
      repeat: -1,
      ease: 'Linear'
    })

    // 进度点指示器
    this.progressDots = []
    var dotSpacing = this.sz(25)
    var startX = width / 2 - (dotSpacing * 2.5)

    for (var i = 0; i < 6; i++) {
      var dot = this.add.circle(startX + i * dotSpacing, indicatorY + this.sz(75), this.sz(6), 0x4a5568)
      this.progressDots.push(dot)
    }
  },

  showQuestion: function() {
    var self = this
    var question = this.questions[this.currentQuestionIndex]

    // 更新题号
    this.questionNumber.setText('第 ' + (this.currentQuestionIndex + 1) + ' 问')

    // 更新进度条
    var progress = this.currentQuestionIndex / 6
    var width = this.cameras.main.width
    this.tweens.add({
      targets: this.progressBar,
      width: (width - this.sz(40)) * progress,
      duration: 300
    })

    // 更新神秘提示
    var hints = [
      '天机正在凝聚...',
      '命运的轮廓渐显...',
      '阴阳正在交汇...',
      '卦象若隐若现...',
      '天意即将显现...',
      '最后一问，静心作答...'
    ]
    this.mysteryText.setText(hints[this.currentQuestionIndex])

    // 淡出旧内容
    this.tweens.add({
      targets: [this.questionText, this.optionAContainer, this.optionBContainer],
      alpha: 0,
      duration: 150,
      onComplete: function() {
        // 更新内容
        self.questionText.setText(question.question)
        self.optionAText.setText(question.optionA)
        self.optionBText.setText(question.optionB)

        // 淡入新内容
        self.tweens.add({
          targets: [self.questionText, self.optionAContainer, self.optionBContainer],
          alpha: 1,
          duration: 200
        })
      }
    })
  },

  selectOption: function(isYang, container) {
    var self = this

    // 防止连续点击
    if (this.isTransitioning) {
      return
    }
    this.isTransitioning = true

    // 点击动画
    this.tweens.add({
      targets: container,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      yoyo: true
    })

    // 记录选择
    this.choices.push(isYang)

    // 更新进度点
    var dotIndex = this.currentQuestionIndex
    this.tweens.add({
      targets: this.progressDots[dotIndex],
      fillColor: 0xffd700,
      scale: 1.3,
      duration: 200,
      onComplete: function() {
        self.tweens.add({
          targets: self.progressDots[dotIndex],
          scale: 1,
          duration: 150
        })
      }
    })

    // 八卦符号闪烁效果
    this.tweens.add({
      targets: this.taijiSymbol,
      alpha: 0.8,
      scale: 1.2,
      duration: 200,
      yoyo: true,
      onComplete: function() {
        self.taijiSymbol.setAlpha(0.4)
        self.taijiSymbol.setScale(1)
      }
    })

    // 进入下一题或显示结果
    this.currentQuestionIndex++

    if (this.currentQuestionIndex < 6) {
      this.time.delayedCall(400, function() {
        self.isTransitioning = false // 重置，允许下次点击
        self.showQuestion()
      })
    } else {
      // 完成所有题目，进入结果页面
      this.time.delayedCall(600, function() {
        self.showCompletionAnimation()
      })
    }
  },

  showCompletionAnimation: function() {
    var self = this
    var width = this.cameras.main.width
    var height = this.cameras.main.height

    // 完成进度条
    this.tweens.add({
      targets: this.progressBar,
      width: width - this.sz(40),
      duration: 300
    })

    // 隐藏问题区域
    this.tweens.add({
      targets: [this.questionText, this.optionAContainer, this.optionBContainer],
      alpha: 0,
      duration: 300
    })

    // 更新神秘提示
    this.mysteryText.setText('卦象已成，天机将现...')
    this.tweens.add({
      targets: this.mysteryText,
      alpha: 1,
      duration: 500
    })

    // 八卦符号放大并移动到中心
    this.tweens.add({
      targets: this.taijiSymbol,
      y: height * 0.45,
      scale: 2,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    })

    // 显示完成提示
    var completeText = this.add.text(width / 2, height * 0.3, '天机已现', {
      fontSize: this.fontSize(34),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: completeText,
      alpha: 1,
      duration: 600,
      delay: 600,
      onComplete: function() {
        // 跳转到结果页面
        self.time.delayedCall(1200, function() {
          self.scene.start('ResultScene', {
            category: self.category,
            choices: self.choices
          })
        })
      }
    })
  }
})
