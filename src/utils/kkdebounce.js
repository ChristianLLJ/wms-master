export function kkdeboundce(fn, delay) {
  let timer = null
  const _debounce = function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this)
      timer = null
    }, delay)
  }
  return _debounce
}
