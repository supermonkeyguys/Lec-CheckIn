import { FC, useEffect, useState } from "react";
import PageInfo from "../../components/PageInfo";
import { Button, Card, Col, message, Modal, Row, Space, Typography } from "antd";
import ContentComponent from "../../components/ContentComponent/Component";
import { CaretRightOutlined, CheckCircleOutlined, ClockCircleOutlined, MenuOutlined, RightOutlined, StarFilled, TrophyFilled, } from "@ant-design/icons";
import styles from './ClockIn.module.scss'
import { formatTime, } from "./utils";
import { useNavigate } from "react-router-dom";
import { POINTS_PAGE_PATHNAME, RECORD_PAGE_PATHNAME } from "../../router/router";
import { useSubmitCheckIn } from "../../hooks/CheckIn/useSubmitCheckIn";
import { useTimer } from "../../hooks/CheckIn/useTimer";

import ClockHeatmap from "./ClockRecord/ClockHeatMap";
import { useAuth } from "../../hooks/User/useAuth";
import { getUserId } from "@renderer/utils/use-Token";

const { Title, Text } = Typography

const ClockStart: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lastDuration, setLastDuration] = useState(0)
    const { submitCheckIn, loading } = useSubmitCheckIn()
    const { userId } = useAuth()
    const {
        isTiming,
        staTime,
        currentSeconds,
        handleStart,
        handleStop
    } = useTimer()

    const handleStopClock = async () => {
        const duration = handleStop()
        setLastDuration(duration)
        try {
            console.log(userId)
            if (!userId) throw new Error('当前查询不到用户名, 请重新登录')
            await submitCheckIn({
                userId,
                startTime: new Date(staTime),
                endTime: new Date(),
                checkInDate: new Date(),
                duration: handleStop()
            });

            setIsModalOpen(true)
        } catch (err) {
            console.error(err)
            message.error('打卡失败');
        }

    }

    const ModalElem = (
        <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            centered
            closable={false}
            footer={false}
        >
            <div className={styles.modalContainer}>
                <CheckCircleOutlined
                    style={{
                        fontSize: '32px',
                        color: '#1677ff',
                        marginBottom: '16px',
                    }}
                />
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    打卡完成
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                    本次打卡时长: {formatTime(lastDuration)}
                </div>
                <div style={{ fontSize: '16px', color: 'rgba(245, 158, 11)' }}>
                    获得积分: +{Math.floor(lastDuration / 60)}
                </div>
                <Button
                    type="primary"
                    onClick={() => {
                        setIsModalOpen(false)
                        setLastDuration(0)
                    }}
                >
                    确定
                </Button>
            </div>
        </Modal>
    )


    return (
        <>
            <Card className={styles.cardContainer}>
                <ClockCircleOutlined style={{ fontSize: '32px', color: 'rgba(22, 119, 255)' }} />
                <Title level={4} style={{ margin: '0' }}>Start CheckIn</Title>
                <Text style={{ margin: "0" }}>
                    {isTiming ? `打卡中...` : '未开始打卡'}
                </Text>
                <div className={styles.clockTime}>{formatTime(currentSeconds)}</div>
                <Button
                    disabled={loading}
                    type="primary"
                    icon={<CaretRightOutlined />}
                    onClick={(isTiming ? handleStopClock : handleStart)}
                    className={isTiming ? styles.end : ''}
                    style={{ width: "320px", height: "40px", borderRadius: "16px" }}
                >
                    {isTiming ? '停止打卡' : '开始打卡'}
                </Button>
            </Card>
            {ModalElem}
        </>
    )
}


const ClockRank: FC = () => {
    const nav = useNavigate()

    const bottomItem = [
        {
            key: RECORD_PAGE_PATHNAME,
            icon: <MenuOutlined />,
            title: '打卡记录',
            text: '查看打卡记录'
        },
        {
            key: POINTS_PAGE_PATHNAME,
            icon: <TrophyFilled />,
            title: '排行榜',
            text: '查看团队打卡排名'
        }
    ]

    return (
        <div className={styles.bottomContainer}>
            {bottomItem.map((bi, index) => (
                <Card
                    key={bi.key}
                    style={{ flex: '1' }}
                    onClick={() => {
                        nav(bi.key)
                    }}
                >
                    <Row
                        align={'middle'}
                        gutter={16}
                        justify="space-between"
                    >
                        <Col flex="none">
                            <div style={{ fontSize: '20px' }} className={`${styles.commonBtn} ${styles[`btn${index}`]}`}>
                                {bi.icon}
                            </div>
                        </Col>
                        <Col flex='auto'>
                            <Space
                                direction="vertical"
                                size={4}>
                                <Title
                                    level={5}
                                    style={{ margin: 0 }}
                                >
                                    {bi.title}
                                </Title>
                                <span style={{ fontSize: 12, color: '#999' }}>
                                    {bi.text}
                                </span>
                            </Space>
                        </Col>
                        <Col>
                            <RightOutlined style={{ fontSize: 16, color: '#ccc' }} />
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    )
}


const ClockIn: FC = () => {
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await getUserId()
                setUserId(id)
            } catch (err) {
                console.log(err)
                setUserId(null)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (!userId || loading) {
        return (
            <div>加载中</div>
        )
    }

    return (
        <ContentComponent
            componentList={[
                () => <PageInfo title="打卡" desc="记录你学习的时间" />,
                () => <ClockStart />,
                () => <ClockHeatmap userId={userId} />,
                () => <ClockRank />
            ]}
        />
    )
}

export default ClockIn