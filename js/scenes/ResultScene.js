// 结果场景 - 显示卦象和解读（神秘版）
var ResultScene = new Phaser.Class({
  Extends: Phaser.Scene,

  // 定义字体常量
  FONTS: {
    title: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    body: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    accent: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif'
  },

  initialize: function ResultScene() {
    Phaser.Scene.call(this, { key: 'ResultScene' })
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
    this.choices = data.choices || [true, true, true, true, true, true]
    this.divination = DivinationUtils.calculateDivination(this.choices)
    this.hexagramDesc = DivinationUtils.getHexagramDescription(this.divination)
    this.readingData = null
  },

  create: function() {
    var self = this
    var width = this.cameras.main.width
    var height = this.cameras.main.height

    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0d1a)
    this.createMysticalBackground(width, height)

    DivinationUtils.getReadingFromFile(this.divination, this.category, function(reading) {
      if (reading) {
        self.readingData = reading
      } else {
        var defaultReading = DivinationUtils.getCategoryReading(self.divination, self.category)
        self.readingData = {
          currentState: defaultReading,
          futureTrend: '顺其自然，静待天时。未来可期，保持积极心态。',
          suggestion: '保持当前状态，适时调整策略。',
          summary: '天机已现，把握当下'
        }
      }
      self.createContent(width, height)
    })
  },

  getCategoryName: function() {
    var names = {
      career: '工作运势', love: '感情运势', wealth: '财富运势', health: '健康运势',
      study: '学业运势', social: '人际关系', travel: '出行运势', general: '诸事运势'
    }
    return names[this.category] || '运势'
  },

  getCategoryColor: function() {
    var colors = {
      career: 0x3182ce, love: 0xd53f8c, wealth: 0xd69e2e, health: 0x38a169,
      study: 0x6b46c1, social: 0x00b5d8, travel: 0x319795, general: 0x805ad5
    }
    return colors[this.category] || 0x3182ce
  },

  createMysticalBackground: function(width, height) {
    var self = this
    var symbols = ['☯', '✧', '✦', '◇', '○']
    for (var i = 0; i < 8; i++) {
      var x = Math.random() * width
      var y = Math.random() * height
      var symbol = symbols[Math.floor(Math.random() * symbols.length)]
      var size = 24 + Math.random() * 32

      var mystSymbol = this.add.text(x, y, symbol, {
        fontSize: this.fontSize(size),
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0.08 + Math.random() * 0.1)

      this.tweens.add({
        targets: mystSymbol,
        y: y - self.sz(25),
        alpha: 0.04,
        duration: 3000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }

    var glow = this.add.circle(width / 2, height * 0.16, this.sz(75), this.getCategoryColor(), 0.15)
    this.tweens.add({
      targets: glow,
      alpha: 0.28,
      scale: 1.2,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  },

  createContent: function(width, height) {
    var adBannerHeight = this.sz(60)
    var contentBottom = height - adBannerHeight
    var currentY = this.sz(30)
    currentY = this.createHeader(width, currentY)
    currentY = this.createMysticalDisplay(width, currentY)
    this.createScrollableContent(width, currentY, contentBottom)
  },

  createHeader: function(width, startY) {
    var self = this

    var backBtn = this.add.text(this.sz(24), startY + this.sz(14), '‹ 返回', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.body,
      color: '#9aa5b5',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5)

    backBtn.setInteractive({ useHandCursor: true })
    backBtn.on('pointerover', function() { backBtn.setColor('#ffffff') })
    backBtn.on('pointerout', function() { backBtn.setColor('#9aa5b5') })
    backBtn.on('pointerdown', function() { self.scene.start('StartScene') })

    this.add.text(width / 2, startY + this.sz(14), '天机已现', {
      fontSize: this.fontSize(26),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    return startY + this.sz(45)
  },

  createMysticalDisplay: function(width, startY) {
    var categoryColor = this.getCategoryColor()
    var colorHex = '#' + categoryColor.toString(16).padStart(6, '0')

    var hexBg = this.add.rectangle(width / 2, startY + this.sz(80), width - this.sz(40), this.sz(140), 0x16213e, 0.6)
    hexBg.setStrokeStyle(this.sz(2), categoryColor)

    var taiji = this.add.text(width / 2, startY + this.sz(42), '☯', {
      fontSize: this.fontSize(48),
      color: '#ffd700'
    }).setOrigin(0.5).setAlpha(0.7)

    this.tweens.add({
      targets: taiji,
      angle: 360,
      duration: 10000,
      repeat: -1,
      ease: 'Linear'
    })

    var hexName = this.add.text(width / 2, startY + this.sz(95), this.divination.hexagram.name, {
      fontSize: this.fontSize(34),
      fontFamily: this.FONTS.title,
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: hexName,
      alpha: 1,
      duration: 1000,
      delay: 300,
      ease: 'Power2'
    })

    var categoryLabel = this.add.text(width / 2, startY + this.sz(135), this.getCategoryName(), {
      fontSize: this.fontSize(16),
      fontFamily: this.FONTS.body,
      color: '#ffffff',
      backgroundColor: colorHex,
      padding: { x: this.sz(14), y: this.sz(5) }
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: categoryLabel,
      alpha: 1,
      duration: 600,
      delay: 600
    })

    return startY + this.sz(165)
  },

  createScrollableContent: function(width, startY, contentBottom) {
    var self = this
    var scrollAreaHeight = contentBottom - startY - this.sz(80)
    var scrollAreaTop = startY + this.sz(10)

    var scrollContainer = this.add.container(0, 0)
    var contentY = 0
    var sectionGap = this.sz(20)

    // 当前状态
    contentY += this.sz(18)
    var stateTitle = this.add.text(width / 2, contentY, '◈ 当前状态 ◈', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    scrollContainer.add(stateTitle)
    contentY += this.sz(35)

    var stateBg = this.add.rectangle(width / 2, contentY + this.sz(55), width - this.sz(40), this.sz(110), 0x16213e, 0.5)
    stateBg.setStrokeStyle(this.sz(1), 0x4a5568)
    scrollContainer.add(stateBg)

    var stateText = this.add.text(width / 2, contentY + this.sz(55), this.readingData.currentState, {
      fontSize: this.fontSize(17),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'left',
      wordWrap: { width: width - this.sz(75), useAdvancedWrap: true },
      lineSpacing: this.sz(10)
    }).setOrigin(0.5)
    scrollContainer.add(stateText)

    var stateTextHeight = stateText.height + this.sz(28)
    stateBg.setSize(width - this.sz(40), Math.max(stateTextHeight, this.sz(90)))
    contentY += Math.max(stateTextHeight, this.sz(90)) + sectionGap

    // 未来趋势
    contentY += this.sz(10)
    var trendTitle = this.add.text(width / 2, contentY, '◈ 未来趋势 ◈', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    scrollContainer.add(trendTitle)
    contentY += this.sz(35)

    var trendBg = this.add.rectangle(width / 2, contentY + this.sz(50), width - this.sz(40), this.sz(100), 0x16213e, 0.5)
    trendBg.setStrokeStyle(this.sz(1), 0x4a5568)
    scrollContainer.add(trendBg)

    var trendText = this.add.text(width / 2, contentY + this.sz(50), this.readingData.futureTrend, {
      fontSize: this.fontSize(17),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'left',
      wordWrap: { width: width - this.sz(75), useAdvancedWrap: true },
      lineSpacing: this.sz(10)
    }).setOrigin(0.5)
    scrollContainer.add(trendText)

    var trendTextHeight = trendText.height + this.sz(28)
    trendBg.setSize(width - this.sz(40), Math.max(trendTextHeight, this.sz(80)))
    contentY += Math.max(trendTextHeight, this.sz(80)) + sectionGap

    // 建议行动
    contentY += this.sz(10)
    var suggestTitle = this.add.text(width / 2, contentY, '◈ 建议行动 ◈', {
      fontSize: this.fontSize(20),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    scrollContainer.add(suggestTitle)
    contentY += this.sz(35)

    var suggestBg = this.add.rectangle(width / 2, contentY + this.sz(35), width - this.sz(40), this.sz(70), 0x16213e, 0.5)
    suggestBg.setStrokeStyle(this.sz(1), 0x4a5568)
    scrollContainer.add(suggestBg)

    var suggestText = this.add.text(width / 2, contentY + this.sz(35), this.readingData.suggestion, {
      fontSize: this.fontSize(17),
      fontFamily: this.FONTS.body,
      color: '#e8ecf0',
      align: 'left',
      wordWrap: { width: width - this.sz(75), useAdvancedWrap: true },
      lineSpacing: this.sz(10)
    }).setOrigin(0.5)
    scrollContainer.add(suggestText)

    var suggestTextHeight = suggestText.height + this.sz(24)
    suggestBg.setSize(width - this.sz(40), Math.max(suggestTextHeight, this.sz(60)))
    contentY += Math.max(suggestTextHeight, this.sz(60)) + this.sz(30)

    var totalContentHeight = contentY

    var maskGraphics = this.make.graphics()
    maskGraphics.fillStyle(0xffffff)
    maskGraphics.fillRect(0, scrollAreaTop, width, scrollAreaHeight)
    var mask = maskGraphics.createGeometryMask()
    scrollContainer.setMask(mask)
    scrollContainer.setPosition(0, scrollAreaTop)

    var minY = scrollAreaTop - (totalContentHeight - scrollAreaHeight)
    var maxY = scrollAreaTop

    if (totalContentHeight > scrollAreaHeight) {
      var scrollIndicator = this.add.text(width - this.sz(20), scrollAreaTop + scrollAreaHeight - this.sz(20), '↓', {
        fontSize: this.fontSize(18),
        fontFamily: this.FONTS.body,
        color: '#9aa5b5'
      }).setOrigin(0.5).setAlpha(0.8)

      this.tweens.add({
        targets: scrollIndicator,
        y: scrollIndicator.y - this.sz(8),
        alpha: 0.4,
        duration: 800,
        yoyo: true,
        repeat: -1
      })

      var lastPointerY = 0
      var isDragging = false

      this.input.on('pointerdown', function(pointer) {
        isDragging = true
        lastPointerY = pointer.y
      })

      this.input.on('pointermove', function(pointer) {
        if (isDragging && pointer.isDown) {
          var deltaY = pointer.y - lastPointerY
          lastPointerY = pointer.y
          var newY = scrollContainer.y + deltaY
          if (newY > maxY) newY = maxY
          if (newY < minY) newY = minY
          scrollContainer.y = newY
          scrollIndicator.setText(newY <= minY + 10 ? '↑' : '↓')
        }
      })

      this.input.on('pointerup', function() { isDragging = false })

      this.input.on('wheel', function(pointer, gameObjects, deltaX, deltaY) {
        var newY = scrollContainer.y - deltaY * 0.5
        if (newY > maxY) newY = maxY
        if (newY < minY) newY = minY
        scrollContainer.y = newY
      })
    }

    scrollContainer.setAlpha(0)
    this.tweens.add({
      targets: scrollContainer,
      alpha: 1,
      duration: 800,
      delay: 800
    })

    // 一句话总结
    var summaryY = contentBottom - this.sz(62)
    var summaryText = this.add.text(width / 2, summaryY, '— ' + this.readingData.summary + ' —', {
      fontSize: this.fontSize(18),
      fontFamily: this.FONTS.accent,
      color: '#ffd700',
      align: 'center',
      wordWrap: { width: width - this.sz(50) }
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: summaryText,
      alpha: 1,
      duration: 800,
      delay: 1200
    })

    this.createActionButtons(width, contentBottom)
  },

  createActionButtons: function(width, contentBottom) {
    var self = this
    var buttonY = contentBottom - this.sz(28)

    var btn1 = this.createButton(width / 2 - this.sz(90), buttonY, this.sz(160), this.sz(48), '再探天机', 0x4a5568, function() {
      self.scene.start('QuestionScene', { category: self.category })
    })
    btn1.setAlpha(0)

    var btn2 = this.createButton(width / 2 + this.sz(90), buttonY, this.sz(160), this.sz(48), '换个方向', this.getCategoryColor(), function() {
      self.scene.start('StartScene')
    })
    btn2.setAlpha(0)

    this.tweens.add({
      targets: [btn1, btn2],
      alpha: 1,
      duration: 600,
      delay: 1500
    })
  },

  createButton: function(x, y, w, h, text, color, callback) {
    var self = this
    var container = this.add.container(x, y)

    var bg = this.add.rectangle(0, 0, w, h, color, 0.3)
    bg.setStrokeStyle(this.sz(2), color)

    var label = this.add.text(0, 0, text, {
      fontSize: this.fontSize(18),
      fontFamily: this.FONTS.body,
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    container.add([bg, label])
    bg.setInteractive({ useHandCursor: true })

    bg.on('pointerover', function() {
      bg.setFillStyle(color, 0.5)
      self.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 100 })
    })

    bg.on('pointerout', function() {
      bg.setFillStyle(color, 0.3)
      self.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 })
    })

    bg.on('pointerdown', function() {
      self.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback
      })
    })

    return container
  }
})
