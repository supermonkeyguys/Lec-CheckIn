export function formatTime(seconds: number):string {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
}

export function getDate() {
    const date = new Date()
    const year = date.getFullYear().toString()
    const mon = (date.getMonth() + 1).toString()
    const day = date.getDate().toString
    
    return `${year}-${mon}-${day}`
}