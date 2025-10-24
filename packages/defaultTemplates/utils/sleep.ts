/**
 * @description 睡眠函数
 * @param time 睡眠时间
 */
export function sleep(time = 3000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(null)
      clearTimeout(timer)
    }, time)
  })
}
