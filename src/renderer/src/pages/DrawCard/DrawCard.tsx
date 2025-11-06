import ContentComponent from "@renderer/components/ContentComponent/Component";
import PageInfo from "@renderer/components/PageInfo";
import { Button, Card, message, Tooltip, Typography } from "antd";
import { FC, useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styles from './DrawCard.module.scss';
import Title from "antd/es/typography/Title";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useGetBalance } from "@renderer/hooks/Points/useGetBalance";
import { formatDuration } from "../ClockIn/ClockRecord/utils/utils";
import Scroll from "./CsRoll/CsRoll";
import { useSlot } from "@renderer/hooks/DrawCard/useSlotMachine";

const { Text } = Typography

interface SlotRollerProps {
    onResult: (result: string) => void
    autoStopDelay: number
    stopDuration: number
    rollerIndex: number
    targetResult: string
}

export interface SlotRollerHandle {
    startRoll: () => void;
    stopRoll: () => void;
}

interface Prize {
    message: string
    type: string
    value: number
}

const images = [
    "😀",
    "😍",
    "🤣",
];
const ITEM_HEIGHT = 100
const INFINITE_MULTIPLIER = 50
const infiniteImages = Array(INFINITE_MULTIPLIER).fill(images).flat()
const PRICE_ROLLER = 60
const PRIZE_TIME = 30 * 60 * 1000
const COST_TIME = 10 * 60 * 1000
const PRIZE_POINTS = 210

const SlotRoller = forwardRef<SlotRollerHandle, SlotRollerProps>(
    ({ onResult, autoStopDelay, stopDuration, rollerIndex, targetResult }, ref) => {
        const rollerRef = useRef<HTMLDivElement>(null)
        const [isRolling, setIsRolling] = useState(false)
        const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
        const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

        useEffect(() => {
            return () => {
                if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current)
                if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current)
            }
        }, [])

        const startRoll = () => {
            if (!rollerRef.current) return
            setIsRolling(true)

            if (autoStopTimeoutRef.current) {
                clearInterval(autoStopTimeoutRef.current)
            }

            const middleIndex = Math.floor(infiniteImages.length / 2)
            const alignedMiddleIndex = Math.floor(middleIndex / images.length) * images.length
            rollerRef.current.style.transition = 'none'
            rollerRef.current.style.transform = `translateY(${-alignedMiddleIndex * ITEM_HEIGHT}px)`

            setTimeout(() => {
                if (!rollerRef.current) return
                rollerRef.current.style.transition = 'transform 3s linear'
                const endIndex = middleIndex + images.length * 10
                rollerRef.current.style.transform = `translateY(${-endIndex * ITEM_HEIGHT}px)`
            }, 50)

            autoStopTimeoutRef.current = setTimeout(() => {
                stopRoll()
            }, autoStopDelay)
        }


        const stopRoll = () => {
            if (!rollerRef.current || isRolling) return

            if (autoStopTimeoutRef.current) {
                clearTimeout(autoStopTimeoutRef.current)
            }

            const computedStyle = window.getComputedStyle(rollerRef.current)
            const matrix = new DOMMatrixReadOnly(computedStyle.transform)
            const currentY = -matrix.m42

            const VIEWPORT_HEIGHT = 300
            const middleOffset = Math.floor(VIEWPORT_HEIGHT / 2 / ITEM_HEIGHT)
            const topIndex = Math.round(currentY / ITEM_HEIGHT)
            const middleIndex = topIndex + middleOffset

            let finalIndex
            if (targetResult) {
                const targetIndex = images.indexOf(targetResult)
                if (targetIndex !== -1) {
                    const offset = (targetIndex - (middleIndex % images.length) + images.length) % images.length
                    finalIndex = middleIndex + offset
                } else {
                    const randomOffset = Math.floor(Math.random() * images.length)
                    finalIndex = middleIndex + randomOffset
                }
            } else {
                const randomOffset = Math.floor(Math.random() * images.length)
                finalIndex = middleIndex + randomOffset
            }

            const alignedFinalIndex = Math.round(finalIndex)

            const finalY = (alignedFinalIndex - middleOffset) * ITEM_HEIGHT

            const originalIndex = alignedFinalIndex % images.length
            const finalResult = images[originalIndex]

            rollerRef.current.style.transition = `transform ${stopDuration}s cubic-bezier(0.22,0.61,0.36,1)`
            rollerRef.current.style.transform = `translateY(${-finalY}px)`

            setIsRolling(false)

            stopTimeoutRef.current = setTimeout(() => {
                onResult(finalResult)
                console.log(`轮盘${rollerIndex + 1}停止: ${finalResult}`);
            }, stopDuration * 1000)
        }

        useImperativeHandle(ref, () => ({
            startRoll,
            stopRoll
        }))

        return (
            <div className={styles.roller}>
                <div className={styles.imageList} ref={rollerRef}>
                    {infiniteImages.map((img, index) => (
                        <div key={index} className={styles.ywbg}>
                            {img}
                        </div>
                    ))}
                </div>
                <div className={styles.maskTop}></div>
                <div className={styles.maskBottom}></div>
                <div className={styles.pointer}></div>
            </div>
        )
    }
)

SlotRoller.displayName = 'SlotRoller'

const SlotMachine: FC<{
    refresh: () => void
}> = ({ refresh }) => {
    const roller1Ref = useRef<SlotRollerHandle>(null)
    const roller2Ref = useRef<SlotRollerHandle>(null)
    const roller3Ref = useRef<SlotRollerHandle>(null)

    const [isAnimation, setIsAnimation] = useState(false)
    const [results, setResults] = useState<(string | null)[]>([null, null, null])
    const [prize, setPrize] = useState<Prize | null>(null)
    const [isWin, setIsWin] = useState(false)
    const { run: rollSlot, loading: slotLoading, slotData: slotResult } = useSlot()


    const ROLLER_CONFIG = [
        { autoStopDelay: 1000, stopDuration: 1.0 },
        { autoStopDelay: 2000, stopDuration: 1.2 },
        { autoStopDelay: 3000, stopDuration: 1.6 },
    ]

    const startRoll = () => {
        if (isAnimation) return
        setIsAnimation(true)
        setResults([null, null, null])
        setIsWin(false)

        roller1Ref.current?.startRoll()
        roller2Ref.current?.startRoll()
        roller3Ref.current?.startRoll()
    }

    const handleResult = (index: number, result: string) => {
        setResults((prev) => {
            const newResults = [...prev]
            newResults[index] = result

            if (newResults.every((r) => r !== null)) {
                setIsAnimation(false)
            }

            return newResults
        })
    }


    const handleStartRoller = async () => {
        if (slotLoading || isAnimation) return

        await rollSlot()
    }

    useEffect(() => {
        console.log("slotRes: ", slotResult)
        if (slotResult && slotResult.results) {
            setResults(slotResult.result)
            setPrize(slotResult.prize)
            startRoll()
        }
    }, [slotResult])


    const checkWin = () => {

        if (prize?.type !== null) {
            setIsWin(true)
            message.success(prize?.message)

        } else {
            message.success(prize?.message)
        }
    }

    useEffect(() => {
        if (isAnimation) refresh()
    }, [isAnimation])

    useEffect(() => {
        if (results.length === 3 && results.every(r => r !== null)) {

            if (!isWin) {
                checkWin()
            }
        }
    }, [results])

    return (
        <Card className={isWin ? styles.winCard : ''}>
            <div>
                <Title style={{ margin: 0, marginBottom: '20px' }} level={3}>
                    老虎机
                </Title>
                <span>
                    抽奖规则
                </span>
                <Tooltip
                    title={`三个相同即可触发效果, 
                    😀为增加${formatDuration(PRIZE_TIME)}打卡时长;
                    😍为获得${PRIZE_POINTS}积分;
                    🤣为减少${formatDuration(COST_TIME)}打卡时长`}
                >
                    <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                </Tooltip>
            </div>
            <div className={styles.setMachine}>
                <div className={styles.rollers}>
                    <SlotRoller
                        ref={roller1Ref}
                        onResult={(result) => handleResult(0, result)}
                        autoStopDelay={ROLLER_CONFIG[0].autoStopDelay}
                        stopDuration={ROLLER_CONFIG[0].stopDuration}
                        rollerIndex={0}
                        targetResult={results[0] || ''}
                    />
                    <SlotRoller
                        ref={roller2Ref}
                        onResult={(result) => handleResult(1, result)}
                        autoStopDelay={ROLLER_CONFIG[1].autoStopDelay}
                        stopDuration={ROLLER_CONFIG[1].stopDuration}
                        rollerIndex={1}
                        targetResult={results[1] || ''}
                    />
                    <SlotRoller
                        ref={roller3Ref}
                        onResult={(result) => handleResult(2, result)}
                        autoStopDelay={ROLLER_CONFIG[2].autoStopDelay}
                        stopDuration={ROLLER_CONFIG[2].stopDuration}
                        rollerIndex={2}
                        targetResult={results[2] || ''}
                    />
                </div>

                <Tooltip title={`消耗${PRICE_ROLLER}积分`}>
                    <div className={styles.controllers}>
                        <Button
                            type="primary"
                            size="large"
                            className={styles.btn}
                            onClick={handleStartRoller}
                            disabled={isAnimation}
                            loading={isAnimation}
                        >
                            {isAnimation ? '抽奖中...' : '🎁 开始抽奖'}
                        </Button>
                    </div>
                </Tooltip>

                <div className={styles.resultWrapper}>
                    {results.every((r) => r !== null) && (
                        <div className={`${styles.result} ${isWin ? styles.winResult : ''}`}>
                            <div className={styles.resultItems}>
                                {results.map((r, i) => (
                                    <span key={i + 'item'} className={styles.resultItem}>
                                        {r}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.winTextWrapper}>
                                {isWin && <div className={styles.winText}>🎊 中奖啦！🎊</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card >

    )
}


const DrawCard: FC = () => {
    const { run: getBalance, pointsBalance, refresh } = useGetBalance()

    useEffect(() => {
        getBalance()
    }, [])

    return (
        <ContentComponent>
            <PageInfo title="抽奖" desc="这是一个花费你努力成果的地方" />
            <div>
                <Text type="secondary" style={{ fontSize: 20 }}>
                    当前积分: <strong style={{ color: "orange", fontSize: 15 }}>{pointsBalance}</strong>
                </Text>
            </div>
            <SlotMachine refresh={refresh} />
            <Scroll refresh={refresh} />
        </ContentComponent>
    );
};

export default DrawCard;
