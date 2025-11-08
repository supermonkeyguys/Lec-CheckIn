import { useGetAllCard } from '@renderer/hooks/DrawCard/useGetAllCard'
import { Card as AntdCard, Button, Tooltip } from 'antd'
import Title from 'antd/es/typography/Title'
import { FC, useEffect, useState } from 'react'
import styles from './Account.module.scss'
import { useCardEffect } from '@renderer/hooks/DrawCard/useCard'
import UserSelectorModal from '@renderer/components/UserSelectorModal/UserSelectorModal'
import { Item, ITEMS, LecCard, RARITY_CONFIG } from '@renderer/components/Card/LecCard'

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

    return (
        <AntdCard>
            <Title level={3} style={{ margin: 0, marginBottom: '20px', textAlign: 'center' }}>
                我的卡包
            </Title>

            {ITEMS.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>暂无卡片</p>
            ) : (
                <div className={styles.cardList}>
                    {ITEMS.map((item, i) => {
                        const cardKey = item.cardType
                        const count = account[cardKey]
                        console.log(`${cardKey}: `,count)
                        if (!item) return null;

                        const rarityConfig = RARITY_CONFIG[item.rarity]
                        const isSelected = selectedCard?.cardType === cardKey

                        return (
                            <Tooltip
                                key={cardKey}
                                title={item.desc}
                            >
                                <div
                                    key={cardKey}
                                    className={`${styles.cardItem} ${isSelected ? styles.expanded : ''}`}
                                    style={{ borderColor: rarityConfig.color }}
                                    onClick={() => setSelectedCard(isSelected ? null : item)}
                                >
                                    <LecCard item={item} i={i} />
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
                            </Tooltip>
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