// Symbol polyfill for WeChat mini-game
if (typeof Symbol === 'undefined') {
  window.Symbol = function(description) {
    return '__symbol_' + description + '_' + Math.random().toString(36).substr(2, 9)
  }
  window.Symbol.iterator = '__symbol_iterator__'
  window.Symbol.for = function(key) {
    return '__symbol_for_' + key
  }
}
