import { FC, useState } from "react";
import PageInfo from "../../components/PageInfo";
import { Button, Card, Col, Modal, Row, Space, Typography } from "antd";
import ContentComponent from "../../components/ContentComponent/Component";
import { CaretRightOutlined, CheckCircleOutlined, ClockCircleOutlined, MenuOutlined, RightOutlined, TrophyFilled, } from "@ant-design/icons";
import styles from './ClockIn.module.scss'
import { formatTime, transMsTos, } from "./utils";
import { useNavigate } from "react-router-dom";
import { POINTS_PAGE_PATHNAME, RECORD_PAGE_PATHNAME } from "../../router/router";
import { useSubmitCheckIn } from "../../hooks/CheckIn/useSubmitCheckIn";
import { useTimer } from "../../hooks/CheckIn/useTimer";
import ClockHeatmap from "./ClockRecord/ClockHeatMap";

const { Title, Text } = Typography

const ClockStart: FC<{
    onCheckInSuccess?: () => void
}> = ({ onCheckInSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { submitCheckIn, loading } = useSubmitCheckIn()
    const {
        currentTime,
        isRunning,
        start,
        stop,
        startTime,
        clear,
    } = useTimer()

    const handleStopClock = async () => {
        await stop()
        onCheckInSuccess!()
        await submitCheckIn({
            startTime: new Date(startTime),
            endTime: new Date(),
            checkInDate: new Date(),
            duration: currentTime
        });
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        clear()
    }

    const ModalElem = (
        <Modal
            open={isModalOpen}
            onCancel={handleCloseModal}
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
                    本次打卡时长: {formatTime(currentTime).split('.')[0]}
                </div>
                <div style={{ fontSize: '16px', color: 'rgba(245, 158, 11)' }}>
                    获得积分: +{Math.floor(transMsTos(currentTime) / 60)}
                </div>
                <Button
                    type="primary"
                    onClick={handleCloseModal}
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
                    {isRunning ? `打卡中...` : '未开始打卡'}
                </Text>
                <div className={styles.clockTime}>{formatTime(currentTime)}</div>
                <Button
                    disabled={loading}
                    type="primary"
                    icon={<CaretRightOutlined />}
                    onClick={(isRunning ? handleStopClock : start)}
                    className={isRunning ? styles.end : ''}
                    style={{ width: "320px", height: "40px", borderRadius: "16px" }}
                >
                    {isRunning ? '停止打卡' : '开始打卡'}
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
    const [heatmapKey, setHeatmapKey] = useState(0)

    return (
        <ContentComponent
            componentList={[
                () => <PageInfo title="打卡" desc="记录你学习的时间" />,
                () => <ClockStart
                    onCheckInSuccess={() => setHeatmapKey(key => key + 1)}
                />,
                () => <ClockHeatmap key={heatmapKey} />, //利用 key 触发刷新
                () => <ClockRank />
            ]}
        />
    )
}

export default ClockIn