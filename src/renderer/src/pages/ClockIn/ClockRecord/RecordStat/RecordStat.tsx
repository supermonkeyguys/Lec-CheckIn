import { CalendarOutlined, ClockCircleOutlined, LineChartOutlined, StarFilled } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import React, { FC, useEffect } from "react";
import styles from './RecordStat.module.scss'
import { useCheckInStat } from "../../../../hooks/CheckIn/useCheckInStat";
import { formatDuration } from "../utils";

const { Title, Text } = Typography

type StatProps = {
    key: string,
    title: string,
    text: string,
    icon: React.ReactNode
}


const RecordStat: FC = () => {
    const { data, run } = useCheckInStat()
    const {
        weekHours,
        consecutiveDays,
        totalPoints,
        totalHours,
    } = data! || { totalCount: 0 }
    
    console.log(data)

    useEffect(() => {
        run()
    }, [])

    const StatItems: StatProps[] = [
        {
            key: 'totalCount',
            title: '总计获得积分',
            text: `${totalPoints} 积分`,
            icon: <StarFilled />,
        },
        {
            key: 'consecutiveDays',
            title: '最长连续打卡天数',
            text: `${consecutiveDays} 天`,
            icon: <LineChartOutlined />
        },
        {
            key: 'totalMonTime',
            title: '总计打卡时长',
            text: `${totalHours} 小时`,
            icon: <CalendarOutlined />,
        },
        {
            key: 'totalWeekTime',
            title: '本周打卡时长',
            text: `${formatDuration(weekHours)}`,
            icon: <ClockCircleOutlined />,
        }
    ]

    return (
        <div className={styles.bottomContainer}>
            {StatItems.map((s, index) => {

                return (
                    <Card key={s.key} className={styles.bottomCard}>
                        <Row justify={'space-between'}>
                            <div className={`${styles.commonBtn} ${styles[`btn${index}`]}`}>
                                {s.icon}
                            </div>
                            <Col>
                                <Text type="secondary">{s.title}</Text>
                                <Title level={4} style={{ margin: 0 }}>
                                    {s.text}
                                </Title>
                            </Col>
                        </Row>
                    </Card>
                )
            })}
        </div>
    )
}

export default RecordStat