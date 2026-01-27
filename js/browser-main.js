// 浏览器端游戏入口
(function() {
  // 等待DOM加载完成
  function initGame() {
    // 隐藏加载提示
    var loading = document.getElementById('loading')

    // 检查Phaser是否加载
    if (typeof Phaser === 'undefined') {
      if (loading) {
        loading.querySelector('.loading-text').textContent = '请下载 Phaser 3 库文件'
      }
      console.error('Phaser 3 未加载，请下载 phaser.min.js 并放置到 js/libs/ 目录')
      console.log('下载地址: https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js')
      return
    }

    // 获取设备像素比（限制最大为2避免性能问题）
    var dpr = Math.min(window.devicePixelRatio || 1, 2)

    // 获取窗口尺寸
    var windowWidth = window.innerWidth
    var windowHeight = window.innerHeight

    // 游戏以物理像素尺寸渲染（高清）
    var gameWidth = Math.floor(windowWidth * dpr)
    var gameHeight = Math.floor(windowHeight * dpr)

    // 调试日志
    console.log('=== 屏幕信息 ===')
    console.log('窗口尺寸:', windowWidth, 'x', windowHeight)
    console.log('设备像素比 (DPR):', dpr)
    console.log('游戏渲染尺寸:', gameWidth, 'x', gameHeight)
    console.log('==================')

    // Phaser 游戏配置 - 以物理像素尺寸渲染
    var config = {
      type: Phaser.CANVAS,
      parent: 'game-container',
      width: gameWidth,
      height: gameHeight,
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

    // 创建游戏实例
    var game = new Phaser.Game(config)

    // 用 CSS 将画布缩放回逻辑尺寸
    game.events.once('ready', function() {
      var canvas = game.canvas
      if (canvas) {
        canvas.style.width = windowWidth + 'px'
        canvas.style.height = windowHeight + 'px'
        console.log('画布 CSS 尺寸已设置:', windowWidth, 'x', windowHeight)
      }
    })

    // 存储信息供场景使用
    game.dpr = dpr
    game.logicalWidth = windowWidth
    game.logicalHeight = windowHeight

    // 隐藏加载提示
    if (loading) {
      loading.classList.add('hidden')
    }

    console.log('易经八卦算命游戏已启动')
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'complete') {
    initGame()
  } else {
    window.addEventListener('load', initGame)
  }
})()
