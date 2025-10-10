export function formatDate(date:string) {
    return date.split('T')[0]
}
export function formatTime(date:string) {
    const time = date.split('T')[1].split('.')[0]
    
    const parts = time.split(':')

    return `${parts[0]}:${parts[1]}`
}

export function formatDuration(duration:number) {
    
    if(duration < 60)return `${duration} 秒`

    const min = Math.floor(duration / 60)

    return `${min} 分钟`
}

