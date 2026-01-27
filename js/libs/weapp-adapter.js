// WeChat Mini-game Adapter for Phaser 3
const { screenWidth, screenHeight } = wx.getSystemInfoSync()

// Canvas adapter
const sharedCanvas = wx.createCanvas()
const sharedContext = sharedCanvas.getContext('2d')

// Set canvas size
sharedCanvas.width = screenWidth
sharedCanvas.height = screenHeight

// Global window object
if (typeof window === 'undefined') {
  GameGlobal.window = GameGlobal
}

window.canvas = sharedCanvas
window.innerWidth = screenWidth
window.innerHeight = screenHeight
window.devicePixelRatio = 1

// requestAnimationFrame
window.requestAnimationFrame = callback => {
  return sharedCanvas.requestAnimationFrame(callback)
}

window.cancelAnimationFrame = id => {
  return sharedCanvas.cancelAnimationFrame(id)
}

// Document adapter
window.document = {
  createElement: function(tagName) {
    tagName = tagName.toLowerCase()
    if (tagName === 'canvas') {
      const canvas = wx.createCanvas()
      canvas.style = {}
      return canvas
    } else if (tagName === 'img' || tagName === 'image') {
      const image = wx.createImage()
      return image
    } else if (tagName === 'audio') {
      const audio = wx.createInnerAudioContext()
      audio.play = () => audio.play()
      audio.pause = () => audio.pause()
      return audio
    }
    return {}
  },

  getElementById: function(id) {
    if (id === 'canvas' || id === 'game') {
      return sharedCanvas
    }
    return null
  },

  getElementsByTagName: function(tagName) {
    if (tagName === 'canvas') {
      return [sharedCanvas]
    }
    return []
  },

  createElementNS: function(namespaceURI, qualifiedName) {
    return this.createElement(qualifiedName)
  },

  body: {
    appendChild: function() {},
    removeChild: function() {},
    style: {}
  },

  documentElement: {
    style: {}
  },

  readyState: 'complete',

  addEventListener: function(type, listener) {
    if (type === 'DOMContentLoaded') {
      listener()
    }
  },

  removeEventListener: function() {},

  hidden: false
}

// HTMLCanvasElement
window.HTMLCanvasElement = function() {}
window.HTMLCanvasElement.prototype = sharedCanvas.__proto__

// Image adapter
window.Image = function() {
  const image = wx.createImage()
  return image
}

// Audio adapter
window.Audio = function(src) {
  const audio = wx.createInnerAudioContext()
  if (src) {
    audio.src = src
  }
  return audio
}

// XMLHttpRequest adapter
window.XMLHttpRequest = class XMLHttpRequest {
  constructor() {
    this.readyState = 0
    this.status = 0
    this.responseText = ''
    this.response = null
    this.responseType = ''
    this.onload = null
    this.onerror = null
    this.onreadystatechange = null
  }

  open(method, url) {
    this._method = method
    this._url = url
    this.readyState = 1
  }

  setRequestHeader() {}

  send(data) {
    const self = this

    wx.request({
      url: this._url,
      method: this._method,
      data: data,
      responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
      success: function(res) {
        self.readyState = 4
        self.status = res.statusCode
        self.responseText = res.data
        self.response = res.data
        if (self.onreadystatechange) {
          self.onreadystatechange()
        }
        if (self.onload) {
          self.onload()
        }
      },
      fail: function(err) {
        self.readyState = 4
        self.status = 0
        if (self.onerror) {
          self.onerror(err)
        }
      }
    })
  }
}

// FileReader adapter
window.FileReader = class FileReader {
  constructor() {
    this.result = null
    this.onload = null
    this.onerror = null
  }

  readAsDataURL(blob) {
    // Not implemented for mini-game
  }

  readAsArrayBuffer(blob) {
    // Not implemented for mini-game
  }
}

// Touch event adapter
const touchEventHandlers = {}

function handleTouchEvent(type, event) {
  const touches = []
  const changedTouches = []

  for (let i = 0; i < event.touches.length; i++) {
    const touch = event.touches[i]
    touches.push({
      identifier: touch.identifier,
      clientX: touch.clientX,
      clientY: touch.clientY,
      pageX: touch.clientX,
      pageY: touch.clientY
    })
  }

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i]
    changedTouches.push({
      identifier: touch.identifier,
      clientX: touch.clientX,
      clientY: touch.clientY,
      pageX: touch.clientX,
      pageY: touch.clientY
    })
  }

  const newEvent = {
    type: type,
    target: sharedCanvas,
    currentTarget: sharedCanvas,
    touches: touches,
    changedTouches: changedTouches,
    timeStamp: event.timeStamp,
    preventDefault: function() {},
    stopPropagation: function() {}
  }

  if (touchEventHandlers[type]) {
    touchEventHandlers[type].forEach(handler => handler(newEvent))
  }
}

wx.onTouchStart(event => handleTouchEvent('touchstart', event))
wx.onTouchMove(event => handleTouchEvent('touchmove', event))
wx.onTouchEnd(event => handleTouchEvent('touchend', event))
wx.onTouchCancel(event => handleTouchEvent('touchcancel', event))

sharedCanvas.addEventListener = function(type, handler) {
  if (!touchEventHandlers[type]) {
    touchEventHandlers[type] = []
  }
  touchEventHandlers[type].push(handler)
}

sharedCanvas.removeEventListener = function(type, handler) {
  if (touchEventHandlers[type]) {
    const index = touchEventHandlers[type].indexOf(handler)
    if (index > -1) {
      touchEventHandlers[type].splice(index, 1)
    }
  }
}

sharedCanvas.getBoundingClientRect = function() {
  return {
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    x: 0,
    y: 0
  }
}

sharedCanvas.focus = function() {}
sharedCanvas.blur = function() {}

// localStorage adapter
window.localStorage = {
  data: {},

  setItem: function(key, value) {
    this.data[key] = value
    try {
      wx.setStorageSync(key, value)
    } catch (e) {}
  },

  getItem: function(key) {
    try {
      const value = wx.getStorageSync(key)
      if (value) {
        return value
      }
    } catch (e) {}
    return this.data[key] || null
  },

  removeItem: function(key) {
    delete this.data[key]
    try {
      wx.removeStorageSync(key)
    } catch (e) {}
  },

  clear: function() {
    this.data = {}
    try {
      wx.clearStorageSync()
    } catch (e) {}
  }
}

// navigator adapter
window.navigator = {
  userAgent: 'Mozilla/5.0 (WeChat MiniGame)',
  language: 'zh-CN',
  platform: 'WeChat',
  appVersion: '5.0'
}

// location adapter
window.location = {
  href: 'game.js',
  protocol: 'https:',
  host: '',
  hostname: '',
  port: '',
  pathname: '',
  search: '',
  hash: ''
}

// performance adapter
window.performance = {
  now: function() {
    return Date.now()
  }
}

// setTimeout and setInterval are already available
window.setTimeout = setTimeout
window.setInterval = setInterval
window.clearTimeout = clearTimeout
window.clearInterval = clearInterval

// console is already available
window.console = console

// Export canvas
export default sharedCanvas
