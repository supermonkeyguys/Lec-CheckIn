import { CaretRightOutlined, ClockCircleOutlined, MenuOutlined, RightOutlined, TrophyFilled, } from "@ant-design/icons";
import { useCheckInStat } from "@renderer/hooks/CheckIn/useCheckInStat";
import { useStartCheckIn } from "@renderer/hooks/CheckIn/useStartCheckIn";
import { Button, Card, Col, message, Progress, ProgressProps, Row, Space, Typography } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentComponent from "../../components/ContentComponent/Component";
import PageInfo from "../../components/PageInfo";
import { useSubmitCheckIn } from "../../hooks/CheckIn/useSubmitCheckIn";
import { STARTTIME_KEY, useTimer } from "../../hooks/CheckIn/useTimer";
import { POINTS_PAGE_PATHNAME, RECORD_PAGE_PATHNAME } from "../../router/router";
import styles from './ClockIn.module.scss';
import ClockHeatmap from "./ClockRecord/ClockHeatMap";
import { formatDuration, formatDurationNumber } from "./ClockRecord/utils/utils";
import { formatTime } from "./utils";
import { useGetUserInfo } from "@renderer/hooks/User/useGetUserInfo";

const { Title, Text } = Typography

const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ffccc7',
};


const ClockStart: FC = React.memo(() => {
    const dispatch = useDispatch()
    const [isCheckIp, setIsCheckIp] = useState(false)
    const { submitCheckIn, loading } = useSubmitCheckIn()
    const { start, loadingStart } = useStartCheckIn()
    const { data, run, refresh } = useCheckInStat()
    const { userInfo } = useGetUserInfo()
    const { weekHours = 0 } = data || {}
    const {
        currentTime,
        isRunning,
        startTimer,
        stopTimer,
    } = useTimer()

    useEffect(() => {
        run()
    }, [])

    const target = userInfo?.grade === 'freshman' ? 28 : 38
    const percent = ((formatDurationNumber(weekHours) / target) * 100).toFixed(1)

    const handleStartClock = useCallback(async () => {
        setIsCheckIp(true)
        try {
            const res = await window.electronAPI?.checkTargetNetwork()
            if (!res) {
                message.error('请在团队内打卡')
                return
            }

            await start()
            const local = localStorage.getItem(STARTTIME_KEY) || Date.now()
            startTimer(new Date(local).getTime())
        } catch (err) {
            console.error(err)
        } finally {
            setIsCheckIp(false)
        }
    }, [start, startTimer])


    const handleStopClock = useCallback(async () => {
        try {
            await submitCheckIn()
            stopTimer()
            refresh()
        } catch (err) {
            console.log(err)
        }
    }, [submitCheckIn, dispatch, stopTimer, refresh])

    return (
        <>
            <Card className={styles.cardContainer}>

                <ClockCircleOutlined style={{ fontSize: '32px', color: 'rgba(22, 119, 255)' }} />
                <Title level={4} style={{ margin: '0' }}>Start CheckIn</Title>
                <div className={styles.displayCheckIn}>
                    <Progress
                        type="dashboard"
                        percent={Number(percent)}
                        size={70}
                        style={{
                            marginRight: '20px'
                        }}
                        strokeColor={conicColors}
                    />
                    <span><strong>本周打卡时长:  </strong></span>
                    <span style={{ color: Number(percent) >= 100 ? 'green' : 'red' }}> &nbsp;{formatDuration(weekHours)}</span>
                </div>
                <Text style={{ margin: "0" }}>
                    {isRunning ? `打卡中...` : '未开始打卡'}
                </Text>
                <div className={styles.clockTime}>{formatTime(currentTime)}</div>
                <Button
                    disabled={loading || loadingStart}
                    loading={isCheckIp}
                    type="primary"
                    icon={<CaretRightOutlined />}
                    onClick={(isRunning ? handleStopClock : handleStartClock)}
                    className={isRunning ? styles.end : ''}
                    style={{ width: "320px", height: "40px", borderRadius: "16px" }}
                >
                    {isRunning ? '停止打卡' : '开始打卡'}
                </Button>
            </Card>
        </>
    )
})

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

    return (
        <ContentComponent>
            <PageInfo title="打卡" desc="记录你学习的时间" />
            <ClockStart />
            <ClockHeatmap />
            <ClockRank />
        </ContentComponent>
    )
}

export default ClockIn