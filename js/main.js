import Phaser from './libs/phaser.min.js'
import StartScene from './scenes/StartScene'
import QuestionScene from './scenes/QuestionScene'
import ResultScene from './scenes/ResultScene'

export default class Main {
  constructor() {
    // 跨平台获取屏幕尺寸和设备像素比
    let screenWidth, screenHeight, dpr
    let source = 'unknown'

    // 尝试微信小程序环境
    if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
      try {
        const sysInfo = wx.getSystemInfoSync()
        screenWidth = sysInfo.screenWidth
        screenHeight = sysInfo.screenHeight
        dpr = sysInfo.pixelRatio || 1
        source = 'wx'
      } catch (e) {
        // 降级到浏览器方式
        screenWidth = window.innerWidth || 375
        screenHeight = window.innerHeight || 667
        dpr = window.devicePixelRatio || 1
        source = 'wx-fallback'
      }
    } else {
      // 浏览器或其他环境
      screenWidth = window.innerWidth || document.documentElement.clientWidth || 375
      screenHeight = window.innerHeight || document.documentElement.clientHeight || 667
      dpr = window.devicePixelRatio || 1
      source = 'browser'
    }

    // 限制 DPR 最大值
    dpr = Math.min(dpr, 3)

    // 调试日志
    console.log('=== 屏幕信息 ===')
    console.log('来源:', source)
    console.log('逻辑宽度:', screenWidth)
    console.log('逻辑高度:', screenHeight)
    console.log('设备像素比 (DPR):', dpr)
    console.log('物理宽度:', screenWidth * dpr)
    console.log('物理高度:', screenHeight * dpr)
    console.log('window.innerWidth:', window.innerWidth)
    console.log('window.innerHeight:', window.innerHeight)
    console.log('window.devicePixelRatio:', window.devicePixelRatio)
    console.log('==================')

    // 获取或创建画布
    let gameCanvas = (typeof canvas !== 'undefined') ? canvas : null

    // 设置画布物理尺寸（高清渲染）
    if (gameCanvas) {
      // 微信小程序的 canvas 是特殊对象，直接设置属性
      gameCanvas.width = Math.floor(screenWidth * dpr)
      gameCanvas.height = Math.floor(screenHeight * dpr)
      if (gameCanvas.style) {
        gameCanvas.style.width = screenWidth + 'px'
        gameCanvas.style.height = screenHeight + 'px'
      }
    }

    const config = {
      type: Phaser.CANVAS,
      canvas: gameCanvas,
      width: screenWidth,
      height: screenHeight,
      backgroundColor: '#1a1a2e',
      scene: [StartScene, QuestionScene, ResultScene],
      scale: {
        mode: Phaser.Scale.NONE
      },
      render: {
        antialias: true,
        pixelArt: false
      }
    }

    this.game = new Phaser.Game(config)

    // Store screen dimensions and dpr globally
    this.game.screenWidth = screenWidth
    this.game.screenHeight = screenHeight
    this.game.dpr = dpr
  }
}
