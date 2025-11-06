export function getGrade(grade: string) {
    switch (grade) {
        case 'all':
            return '全部'
        case 'freshman':
            return '大一'
        case 'sophomore':
            return '大二'
        case 'junior':
            return '大三'
        case 'senior':
            return '大四'
        default:
            return '???'
    }
}