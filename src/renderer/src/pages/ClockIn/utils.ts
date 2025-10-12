export function formatTime(ms: number): string {
  const totalMs = Math.floor(ms) // 确保是整数
  const hours = Math.floor(totalMs / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const milliseconds = totalMs % 1000

  return `${String(hours).padStart(2, '0')}
  : ${String(minutes).padStart(2, '0')}
  : ${String(seconds).padStart(2, '0')}
  . ${String(milliseconds).padStart(3, '0')}`
}

export function transMsTos(ms:number):number {
    const totalMs = Math.floor(ms)
    const seconds = Math.floor(totalMs / 1000)
    return seconds
}

export function getDate() {
  const date = new Date()
  const year = date.getFullYear().toString()
  const mon = (date.getMonth() + 1).toString()
  const day = date.getDate().toString

  return `${year}-${mon}-${day}`
}
