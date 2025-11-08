import { Button, Card, message, Tooltip } from "antd"
import { FC, useEffect, useRef, useState } from "react"
import styles from './CsRoll.module.scss'
import { GiftOutlined } from "@ant-design/icons"
import { useDrawCard } from "@renderer/hooks/DrawCard/useDrawCard"
import { useCardEffect } from "@renderer/hooks/DrawCard/useCard"
import UserSelectorModal from "@renderer/components/UserSelectorModal/UserSelectorModal"
import { Item, ITEMS, LecCard, RARITY_CONFIG } from "@renderer/components/Card/LecCard"





const Scroll: FC<{
    refresh: () => void
}> = ({ refresh }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)

    const [isRolling, setIsRolling] = useState(false)
    const [winner, setWinner] = useState<Item | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { run: useCard } = useCardEffect()

    const ITEM_WIDTH = 150
    const GAP = 10
    const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP
    const INFINITE_MULTIPLIER = 80
    const infiniteItems = Array(INFINITE_MULTIPLIER).fill(ITEMS).flat()

    const startScroll = async (cardType: string) => {
        if (!containerRef.current || !viewportRef.current || isRolling) return
        setIsRolling(true)
        setWinner(null)

        const targetItem = ITEMS.find(item => item.cardType === cardType)
        if (!targetItem) {
            throw new Error('服务端返回数据错误')
        }

        const viewportWidth = viewportRef.current!.offsetWidth
        const centerX = viewportWidth / 2

        const safeStartIndex = Math.floor(infiniteItems.length * 0.4)
        const safeEndIndex = Math.floor(infiniteItems.length * 0.6)

        const targetCandidates = infiniteItems
            .map((item, i) => ({ item, i }))
            .filter(({ item, i }) =>
                item.id === targetItem.id &&
                i >= safeStartIndex &&
                i <= safeEndIndex
            )

        const targetData = targetCandidates[Math.floor(Math.floor(Math.random() * targetCandidates.length))]
        const targetIndex = targetData.i

        const startIndex = Math.floor(infiniteItems.length * 0.2)
        const startX = -(startIndex * TOTAL_ITEM_WIDTH) + centerX - ITEM_WIDTH / 2

        containerRef.current.style.transition = 'none'
        containerRef.current.style.transform = `translateX(${startX}px)`

        void containerRef.current.offsetHeight

        setTimeout(() => {
            if (!containerRef.current) return

            const targetItemCenterX = targetIndex * TOTAL_ITEM_WIDTH + ITEM_WIDTH / 2

            const finalX = centerX - targetItemCenterX

            containerRef.current.style.transition = 'transform 5s cubic-bezier(0.11,0.67,0.18,0.99)'
            containerRef.current.style.transform = `translateX(${finalX}px)`

            setTimeout(() => {
                setIsRolling(false)
                finalAdjust(targetItem, targetIndex, centerX)
            }, 5000)
        }, 50)

    }
    const { run } = useDrawCard(startScroll)

    const handleUseCard = () => {
        if (!winner) return

        if (winner.effect === 'self') {
            useCard('', winner.cardType)
            setWinner(null)
        }
        else if (winner.effect === 'other') {
            setIsModalOpen(true)
        }
    }

    const handleSelectTarget = async (username: string) => {
        if (!winner) return

        await useCard(username, winner.cardType)
        setIsModalOpen(false)
        setWinner(null)
    }

    const finalAdjust = (targetItem: Item, targetIndex: number, centerX: number) => {
        if (!containerRef.current) return

        const targetItemCenterX = targetIndex * TOTAL_ITEM_WIDTH + ITEM_WIDTH / 2
        const preciseX = centerX - targetItemCenterX

        containerRef.current.style.transition = 'transform 0.3s ease-out'
        containerRef.current.style.transform = `translateX(${preciseX}px)`

        setTimeout(() => {
            setWinner(targetItem)
            message.success({
                content: `恭喜抽中 ${targetItem.name} ${targetItem.icon}!`,
                duration: 3,
            });
        }, 300)
    }

    useEffect(() => {
        if (winner) refresh()
    }, [winner])

    return (
        <Card>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <GiftOutlined /> 抽卡
                </h2>
                <div className={styles.rarity}>
                    {Object.entries(RARITY_CONFIG).map(([key, config]) => (
                        <Tooltip key={key} title={`${config.weight}%概率`}>
                            <span className={styles.rarityTag} style={{ borderColor: config.color }}>
                                <span className={styles.rarityDot} style={{ backgroundColor: config.color }}></span>
                                {config.label}
                            </span>
                        </Tooltip>
                    ))}
                </div>
            </div>

            <div ref={viewportRef} className={styles.viewport}>
                <div ref={containerRef} className={styles.itemsContainer}>
                    {infiniteItems.map((item, i) => (
                        <div
                            key={`${item.id}-${i}`}
                            className={`${styles.itemCard} 
                                    ${winner?.id === item.id
                                    && i === infiniteItems
                                        .findIndex((it, idx) => it.id === item.id
                                            && idx >= Math.floor(infiniteItems.length * 0.4)) ?
                                    styles.winner : ''}
                                `}
                            style={{
                                borderColor: RARITY_CONFIG[item.rarity].color,
                            }}
                        >
                            <LecCard item={item} i={i} />
                        </div>
                    ))}
                </div>
                <div className={styles.indicator}>
                    <div className={styles.indicatorArrow}>▼</div>
                </div>
                <div className={styles.maskLeft}></div>
                <div className={styles.maskRight}></div>
            </div>

            <div className={styles.controls}>
                <Tooltip title='消耗180积分'>
                    <Button
                        type="primary"
                        size='large'
                        disabled={isRolling}
                        onClick={run}
                        loading={isRolling}
                    >
                        {isRolling ? '滚动中...' : '🎁 开始抽奖'}
                    </Button>
                </Tooltip>
            </div>

            {winner && (
                <>
                    <div className={styles.result}>
                        <div
                            className={styles.winnerCard}
                            style={{
                                borderColor: RARITY_CONFIG[winner.rarity].color
                            }}
                        >
                            <div className={styles.winnerIcon}>{winner.icon}</div>
                            <div className={styles.winnerName}>{winner.name}</div>
                            <div
                                className={styles.itemRarity}
                                style={{ backgroundColor: RARITY_CONFIG[winner.rarity].color, fontSize: '20px' }}
                            >
                                {RARITY_CONFIG[winner.rarity].label}
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardAction}>
                        <Button
                            className={styles.useCard}
                            onClick={handleUseCard}
                        >
                            使用卡片
                        </Button>
                        <Button
                            className={styles.saveCard}
                            onClick={() => {
                                setWinner(null)
                                message.success('存入成功')
                            }}
                        >
                            存入卡包
                        </Button>
                    </div>

                    <UserSelectorModal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSelect={handleSelectTarget}
                    />
                </>
            )}
        </Card>
    )
}

export default Scroll 