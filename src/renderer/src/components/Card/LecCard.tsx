import { FC } from 'react'
import styles from './LecCard.module.scss'

export interface Item {
    id: string
    name: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    desc?: string
    effect?: string
    cardType: string
}

export const RARITY_CONFIG = {
    common: { color: '#b0c3d9', label: '普通', weight: 60 },
    rare: { color: '#4b69ff', label: '稀有', weight: 25 },
    epic: { color: '#8847ff', label: '史诗', weight: 12 },
    legendary: { color: '#ff8000', label: '传说', weight: 3 },
}

interface CardProps {
    item: Item
    i: number
}

export const LecCard: FC<CardProps> = ({ item}) => {


    return (
        <>
            <div className={styles.itemIcon}>{item.icon}</div>
            <div className={styles.itemName}>{item.name}</div>
            <div
                className={styles.itemRarity}
                style={{ backgroundColor: RARITY_CONFIG[item.rarity].color }}
            >
                {RARITY_CONFIG[item.rarity].label}
            </div>
        </>
    )
}


export const ITEMS: Item[] = [
    { id: '1', name: '积分卡', icon: '😀', rarity: 'common', desc: "获得30积分", effect: 'self', cardType: 'pointsCard' },
    { id: '2', name: '打压', icon: '🥊', rarity: 'rare', desc: '选择一位目标并减少其30积分', effect: 'other', cardType: 'strikeCard' },
    {
        id: '3', name: '加时卡', icon: '😇', rarity: 'epic',
        desc: '选择一位目标并为其增加30分钟打卡时长', effect: 'other',
        cardType: 'checkInCard'
    },
    {
        id: '4', name: '神之一手', icon: '🥷', rarity: 'legendary',
        desc: '选择一位目标并偷取其30分钟打卡时长(本周),并获取其60积分(结果可为负)', effect: 'other',
        cardType: 'theftCard'
    },
    { 
        id: '5', name: '你的枪里没有子弹', icon: '🤠', rarity: 'epic', 
        desc: '随机加减30分钟打卡时间(自身), 并对应扣除(增加)积分', effect: 'self',
        cardType: 'betCard'
    },
    {
        id: '6', name: '顺手的事', icon: '👌', rarity: 'epic',
        desc: '80%的概率偷取别人的60积分, 20%再偷取60积分', effect: 'other',
        cardType: 'okCard'
    },
    {
        id: '7', name: '劫富济贫',  icon: '🤺', rarity: 'legendary',
        desc: '可与选中目标平分其一半的资产(可以为负)', effect: 'other',
        cardType: 'divideCard'
    },
]


