export function formatDate(date:string) {
    return date.split('T')[0]
}
export function formatTime(date:string) {
    const time = date.split('T')[1].split('.')[0]
    
    const parts = time.split(':')

    return `${parts[0]}:${parts[1]}`
}

export function formatDuration(ms:number) {
    const duration = Number((ms / 1000).toFixed(2))

    if(duration < 60)return `${duration} 秒`

    const min = Number((duration / 60).toFixed(2))

    if(min < 60)return `${min}分钟`

    const hours = (min / 60).toFixed(2)

    return `${hours}小时`
}

