// 开始场景 - 选择测算方向（循环球体版）
var StartScene = new Phaser.Class({
  Extends: Phaser.Scene,

  // 字体配置
  FONTS: {
    title: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    body: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif',
    accent: '"PingFang SC", "Heiti SC", "Microsoft YaHei", sans-serif'
  },

  initialize: function StartScene() {
    Phaser.Scene.call(this, { key: 'StartScene' })
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

  init: function() {
    // 可配置项
    this.config = {
      // 广告位高度
      adBannerHeight: 60,
      // 球体配置
      sphere: {
        radius: 58,              // 球体半径
        visibleCount: 3,         // 可见球体数量（建议奇数）
        spacing: 25,             // 球体间距
        glowAlpha: 0.25,         // 光晕透明度
        animationDuration: 2500, // 呼吸动画周期
        dragSensitivity: 1.2,    // 拖动灵敏度
        snapDuration: 280,       // 吸附动画时长
        minDragDistance: 30      // 最小拖动距离触发切换
      },
      // 类别配置（可自定义添加或删除，支持循环）
      categories: [
        { key: 'love', name: '感情', icon: '💕', color: 0xd53f8c },
        { key: 'wealth', name: '财运', icon: '💰', color: 0xd69e2e },
        { key: 'career', name: '工作', icon: '💼', color: 0x3182ce },
        { key: 'health', name: '健康', icon: '🍀', color: 0x38a169 },
        { key: 'study', name: '学业', icon: '📚', color: 0x6b46c1 },
        { key: 'social', name: '人际', icon: '🤝', color: 0x00b5d8 },
        { key: 'travel', name: '出行', icon: '✈️', color: 0x319795 },
        { key: 'general', name: '诸事', icon: '🔮', color: 0x805ad5 }
      ]
    }
  },

  create: function() {
    var width = this.cameras.main.width
    var height = this.cameras.main.height
    this.contentBottom = height - this.sz(this.config.adBannerHeight)

    // 背景
    this.createBackground(width, height)

    // 标题
    this.createTitle(width)

    // 说明文字
    this.createDescription(width)

    // 循环球体选择区
    this.createCircularSelector(width)

    // 底部按钮
    this.createFooter(width)
  },

  createBackground: function(width, height) {
    var self = this
    // 深色背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // 八卦符号
    var baguaSymbol = this.add.text(width / 2, height * 0.12, '☯', {
      fontSize: this.fontSize(65),
      color: '#ffd700'
    }).setOrigin(0.5).setAlpha(0.2)

    this.tweens.add({
      targets: baguaSymbol,
      angle: 360,
      duration: 25000,
      repeat: -1,
      ease: 'Linear'
    })

    // 神秘粒子
    for (var i = 0; i < 5; i++) {
      var x = Math.random() * width
      var y = Math.random() * height * 0.5
      var particle = this.add.text(x, y, '✧', {
        fontSize: this.fontSize(8 + Math.random() * 10),
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0.08 + Math.random() * 0.08)

      this.tweens.add({
        targets: particle,
        y: y - self.sz(15),
        alpha: 0.03,
        duration: 3500 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  },

  createTitle: function(width) {
    this.add.text(width / 2, this.sz(100), '易经八卦', {
      fontSize: this.fontSize(42),
      fontFamily: this.FONTS.title,
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(width / 2, this.sz(148), '命运指引', {
      fontSize: this.fontSize(26),
      fontFamily: this.FONTS.accent,
      color: '#e0e0e0'
    }).setOrigin(0.5)
  },

  createDescription: function(width) {
    var descY = this.sz(202)
    var descBg = this.add.rectangle(width / 2, descY, width - this.sz(50), this.sz(70), 0x16213e, 0.6)
    descBg.setStrokeStyle(this.sz(1), 0x4a5568)

    this.add.text(width / 2, descY, '古老的易经智慧，为您指点迷津\n◂ 左右滑动选择 ▸', {
      fontSize: this.fontSize(17),
      fontFamily: this.FONTS.body,
      color: '#a8b4c0',
      align: 'center',
      lineSpacing: this.sz(12)
    }).setOrigin(0.5)
  },

  createCircularSelector: function(width) {
    var self = this
    var categories = this.config.categories
    var sphereConfig = this.config.sphere
    var centerY = this.sz(355)

    // 当前选中索引（支持小数用于平滑动画）
    this.currentIndex = 0
    this.targetIndex = 0
    this.isDragging = false
    this.dragStartX = 0
    this.dragStartIndex = 0

    // 球体容器
    this.sphereContainer = this.add.container(width / 2, centerY)

    // 计算单个球体占用的宽度（按DPR缩放）
    this.sphereWidth = this.sz(sphereConfig.radius * 2 + sphereConfig.spacing)

    // 创建球体（多创建几个用于循环显示）
    this.spheres = []
    var totalSpheres = categories.length + 4 // 前后各多2个用于循环
    for (var i = 0; i < totalSpheres; i++) {
      var catIndex = ((i - 2) % categories.length + categories.length) % categories.length
      var sphere = this.createSphere(categories[catIndex], i - 2)
      this.spheres.push(sphere)
      this.sphereContainer.add(sphere)
    }

    // 更新球体位置
    this.updateSphereDisplay()

    // 设置拖动交互
    this.setupDragInteraction(width, centerY)

    // 指示点
    this.createIndicatorDots(width, centerY + this.sz(115), categories.length)
  },

  createSphere: function(category, virtualIndex) {
    var self = this
    var sphereConfig = this.config.sphere
    var container = this.add.container(0, 0)

    var scaledRadius = this.sz(sphereConfig.radius)

    // 外层光晕
    var glow = this.add.circle(0, 0, scaledRadius + this.sz(18), category.color, sphereConfig.glowAlpha)

    // 球体主体 - 渐变效果
    var sphere = this.add.circle(0, 0, scaledRadius, category.color, 0.85)
    sphere.setStrokeStyle(this.sz(2), 0xffffff, 0.25)

    // 球体高光
    var highlight = this.add.ellipse(0, -scaledRadius * 0.35, scaledRadius * 0.7, scaledRadius * 0.35, 0xffffff, 0.15)

    // 图标
    var icon = this.add.text(0, this.sz(-10), category.icon, {
      fontSize: this.fontSize(38)
    }).setOrigin(0.5)

    // 文字在球体内
    var nameText = this.add.text(0, this.sz(30), category.name, {
      fontSize: this.fontSize(19),
      fontFamily: self.FONTS.body,
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    container.add([glow, sphere, highlight, icon, nameText])

    // 保存数据
    container.sphereData = {
      glow: glow,
      sphere: sphere,
      highlight: highlight,
      icon: icon,
      nameText: nameText,
      category: category,
      virtualIndex: virtualIndex
    }

    // 呼吸动画
    this.tweens.add({
      targets: glow,
      alpha: sphereConfig.glowAlpha + 0.12,
      scale: 1.08,
      duration: sphereConfig.animationDuration + Math.random() * 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: Math.random() * 1000
    })

    return container
  },

  setupDragInteraction: function(width, centerY) {
    var self = this
    var categories = this.config.categories
    var sphereConfig = this.config.sphere

    // 交互区域
    var dragZone = this.add.rectangle(width / 2, centerY, width, this.sz(200), 0x000000, 0)
    dragZone.setInteractive({ useHandCursor: true })

    // 拖动开始
    dragZone.on('pointerdown', function(pointer) {
      self.isDragging = true
      self.dragStartX = pointer.x
      self.dragStartIndex = self.currentIndex

      // 停止正在进行的吸附动画
      if (self.snapTween) {
        self.snapTween.stop()
      }
    })

    // 拖动中
    dragZone.on('pointermove', function(pointer) {
      if (!self.isDragging) return

      var deltaX = (pointer.x - self.dragStartX) * sphereConfig.dragSensitivity
      var indexDelta = -deltaX / self.sphereWidth

      self.currentIndex = self.dragStartIndex + indexDelta
      self.updateSphereDisplay()
    })

    // 拖动结束
    var onDragEnd = function(pointer) {
      if (!self.isDragging) return
      self.isDragging = false

      var deltaX = pointer.x - self.dragStartX

      // 根据拖动距离和方向确定目标
      if (Math.abs(deltaX) > sphereConfig.minDragDistance) {
        if (deltaX > 0) {
          self.targetIndex = Math.floor(self.currentIndex)
        } else {
          self.targetIndex = Math.ceil(self.currentIndex)
        }
      } else {
        self.targetIndex = Math.round(self.currentIndex)
      }

      // 吸附到目标位置
      self.snapToTarget()
    }

    dragZone.on('pointerup', onDragEnd)
    dragZone.on('pointerout', function(pointer) {
      if (self.isDragging) {
        onDragEnd(pointer)
      }
    })

    // 点击球体
    this.input.on('pointerup', function(pointer) {
      if (Math.abs(pointer.x - self.dragStartX) < 10 && Math.abs(pointer.y - pointer.downY) < 10) {
        // 检测点击了哪个球体
        var clickX = pointer.x - width / 2
        var nearestIndex = Math.round(self.currentIndex - clickX / self.sphereWidth)
        if (nearestIndex !== Math.round(self.currentIndex)) {
          self.targetIndex = nearestIndex
          self.snapToTarget()
        }
      }
    })
  },

  snapToTarget: function() {
    var self = this
    var categories = this.config.categories
    var sphereConfig = this.config.sphere

    // 标准化目标索引到有效范围
    var normalizedTarget = ((this.targetIndex % categories.length) + categories.length) % categories.length

    // 计算最短路径
    var currentNormalized = ((Math.round(this.currentIndex) % categories.length) + categories.length) % categories.length
    var diff = normalizedTarget - currentNormalized

    // 选择最短的循环路径
    if (diff > categories.length / 2) {
      diff -= categories.length
    } else if (diff < -categories.length / 2) {
      diff += categories.length
    }

    this.targetIndex = Math.round(this.currentIndex) + diff

    // 平滑动画到目标
    this.snapTween = this.tweens.add({
      targets: this,
      currentIndex: this.targetIndex,
      duration: sphereConfig.snapDuration,
      ease: 'Back.easeOut',
      onUpdate: function() {
        self.updateSphereDisplay()
      },
      onComplete: function() {
        // 标准化当前索引
        self.currentIndex = ((self.currentIndex % categories.length) + categories.length) % categories.length
        self.targetIndex = self.currentIndex
        self.updateSphereDisplay()
        self.updateIndicatorDots(Math.round(self.currentIndex))
      }
    })
  },

  updateSphereDisplay: function() {
    var self = this
    var categories = this.config.categories
    var sphereConfig = this.config.sphere
    var width = this.cameras.main.width

    this.spheres.forEach(function(sphere, i) {
      var virtualIndex = i - 2 // 因为前面多了2个
      var relativeIndex = virtualIndex - self.currentIndex

      // 处理循环
      while (relativeIndex > categories.length / 2) relativeIndex -= categories.length
      while (relativeIndex < -categories.length / 2) relativeIndex += categories.length

      // 计算位置
      var x = relativeIndex * self.sphereWidth

      // 计算缩放和透明度（中心最大，两边渐小）
      var distanceFromCenter = Math.abs(relativeIndex)
      var scale = Math.max(0.5, 1 - distanceFromCenter * 0.25)
      var alpha = Math.max(0.3, 1 - distanceFromCenter * 0.4)

      // 计算深度（Y偏移，制造3D效果）
      var yOffset = distanceFromCenter * distanceFromCenter * self.sz(8)

      sphere.x = x
      sphere.y = yOffset
      sphere.scaleX = scale
      sphere.scaleY = scale
      sphere.alpha = alpha

      // 更新球体内部元素
      var data = sphere.sphereData
      if (distanceFromCenter < 0.5) {
        // 选中状态
        data.nameText.setAlpha(1)
        data.glow.setAlpha(sphereConfig.glowAlpha + 0.1)
      } else {
        data.nameText.setAlpha(0.7)
        data.glow.setAlpha(sphereConfig.glowAlpha * scale)
      }

      // 设置深度排序（中间的在最前）
      sphere.setDepth(100 - Math.floor(distanceFromCenter * 10))
    })

    // 更新选中的类别信息
    var selectedIndex = ((Math.round(this.currentIndex) % categories.length) + categories.length) % categories.length
    this.updateSelectedInfo(categories[selectedIndex])
  },

  updateSelectedInfo: function(category) {
    // 可以在这里更新其他UI元素
  },

  createIndicatorDots: function(width, y, count) {
    this.indicatorDots = []
    var dotSpacing = this.sz(16)
    var startX = width / 2 - (dotSpacing * (count - 1)) / 2

    for (var i = 0; i < count; i++) {
      var dot = this.add.circle(startX + i * dotSpacing, y, this.sz(4), i === 0 ? 0xffd700 : 0x4a5568)
      this.indicatorDots.push(dot)
    }
  },

  updateIndicatorDots: function(selectedIndex) {
    var self = this
    var count = this.config.categories.length
    selectedIndex = ((selectedIndex % count) + count) % count

    this.indicatorDots.forEach(function(dot, index) {
      var isSelected = index === selectedIndex
      self.tweens.add({
        targets: dot,
        fillColor: isSelected ? 0xffd700 : 0x4a5568,
        scale: isSelected ? 1.4 : 1,
        duration: 150
      })
    })
  },

  createFooter: function(width) {
    var self = this
    var footerY = this.contentBottom - this.sz(75)

    // 开始按钮
    var btnContainer = this.add.container(width / 2, footerY)

    var btnBg = this.add.rectangle(0, 0, this.sz(170), this.sz(48), 0xffd700, 0.9)
    btnBg.setStrokeStyle(this.sz(2), 0xffd700)

    var btnText = this.add.text(0, 0, '开始测算', {
      fontSize: this.fontSize(22),
      fontFamily: this.FONTS.body,
      color: '#1a1a2e',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    btnContainer.add([btnBg, btnText])

    btnBg.setInteractive({ useHandCursor: true })

    btnBg.on('pointerover', function() {
      self.tweens.add({
        targets: btnContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      })
    })

    btnBg.on('pointerout', function() {
      self.tweens.add({
        targets: btnContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      })
    })

    btnBg.on('pointerdown', function() {
      var selectedIndex = ((Math.round(self.currentIndex) % self.config.categories.length) + self.config.categories.length) % self.config.categories.length
      var category = self.config.categories[selectedIndex]

      self.tweens.add({
        targets: btnContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: function() {
          self.scene.start('QuestionScene', { category: category.key })
        }
      })
    })

    // 底部提示
    this.add.text(width / 2, this.contentBottom - this.sz(18), '每日一卦，小占怡情', {
      fontSize: this.fontSize(13),
      fontFamily: this.FONTS.accent,
      color: '#5a6878'
    }).setOrigin(0.5)
  }
})
