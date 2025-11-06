import { useGetAllCard } from '@renderer/hooks/DrawCard/useGetAllCard'
import { Card as AntdCard, Button } from 'antd'
import Title from 'antd/es/typography/Title'
import { FC, useEffect, useState } from 'react'
import styles from './Account.module.scss'
import { Item, ITEMS, RARITY_CONFIG } from '@renderer/pages/DrawCard/CsRoll/CsRoll'
import { useCardEffect } from '@renderer/hooks/DrawCard/useCard'
import UserSelectorModal from '@renderer/components/UserSelectorModal/UserSelectorModal'


const CARD_TYPE_TO_ITEM: Record<string, typeof ITEMS[number] | undefined> = {
    pointsCard: ITEMS.find(item => item.name === '积分卡'),
    strikeCard: ITEMS.find(item => item.name === '打压'),
    checkInCard: ITEMS.find(item => item.name === '加时卡'),
    theftCard: ITEMS.find(item => item.name === '神之一手'),
};


interface AccountProps {
    refresh: () => void
}

const Account: FC<AccountProps> = ({ refresh }) => {
    const { data, run } = useGetAllCard()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<Item | null>(null)
    const { run: useCard } = useCardEffect()

    const handleUseCard = async () => {
        if (!selectedCard) return

        if (selectedCard.effect === 'self') {
            useCard('', selectedCard.cardType)
            setSelectedCard(null)
            await run()
            refresh()
        }
        else if (selectedCard.effect === 'other') {
            setIsModalOpen(true)
        }
    }

    const handleSelectTarget = async (username: string) => {
        if (!selectedCard) return

        await useCard(username, selectedCard.cardType)
        await run()
        setIsModalOpen(false)
        setSelectedCard(null)
        refresh()
    }

    useEffect(() => {
        run()
    }, [])

    const account = data?.account

    if (!account) {
        return (
            <AntdCard>
                <Title level={3} style={{ margin: 0 }}>我的卡包</Title>
                <p>加载中...</p>
            </AntdCard>
        )
    }

    const CARD_DISPLAY_ORDER = ['pointsCard', 'strikeCard', 'checkInCard', 'theftCard'] as const;

    const cardEntries = CARD_DISPLAY_ORDER
        .map(key => {
            const count = account[key];
            return count != null ? [key, count] : null;
        })
        .filter(Boolean) as [string, number][];

    return (
        <AntdCard>
            <Title level={3} style={{ margin: 0, marginBottom: '20px', textAlign: 'center' }}>
                我的卡包
            </Title>

            {cardEntries.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>暂无卡片</p>
            ) : (
                <div className={styles.cardList}>
                    {cardEntries.map(([cardKey, count], i) => {
                        const item = CARD_TYPE_TO_ITEM[cardKey]
                        if (!item) return null;

                        const rarityConfig = RARITY_CONFIG[item.rarity]
                        const isSelected = selectedCard?.cardType === cardKey
                        console.log(cardKey)

                        return (
                            <div
                                key={cardKey}
                                className={`${styles.cardItem} ${isSelected ? styles.expanded : ''}`}
                                style={{ borderColor: rarityConfig.color }}
                                onClick={() => setSelectedCard(isSelected ? null : item)}
                            >
                                <div className={styles.icon}>{item.icon}</div>
                                <div className={styles.name}>{item.name}</div>
                                <div
                                    className={styles.rarityTag}
                                    style={{ backgroundColor: rarityConfig.color }}
                                >
                                    {rarityConfig.label}
                                </div>
                                <div className={styles.count}>拥有数量：{count}</div>

                                {selectedCard && i === Number(selectedCard.id) - 1 && (
                                    <div className={styles.cardActions}>
                                        <Button
                                            type='primary'
                                            style={{ backgroundColor: rarityConfig.color }}
                                            size='large'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUseCard()
                                            }}
                                            disabled={!count}
                                            className={styles.useCardButton}
                                        >
                                            使用卡片
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <UserSelectorModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectTarget}
            />
        </AntdCard>
    )
}

export default Account