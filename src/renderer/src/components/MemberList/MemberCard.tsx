import { UserItem } from "@renderer/hooks/User/useTeamMembers";
import { formatDuration } from "@renderer/pages/ClockIn/ClockRecord/utils/utils";
import { getGrade } from "@renderer/utils/getGrade";
import { Avatar, Card, Col, Row, Typography } from "antd";
import { FC } from "react";

const { Text } = Typography

const MemberCard: FC<UserItem> = ({ nickname, grade, pointsBalance, avatarUrl, todayDuration }) => {
    return (
        <Card hoverable style={{ borderRadius: 8 }}>
            <Row align="middle" justify="space-between">
                <Col>
                    <Row align="middle">
                        <Avatar src={avatarUrl} alt="用户头像" size={48}/>
                        <div style={{ marginLeft: 10 }}>
                            <Text strong>{nickname}</Text>
                            <Typography.Text type="secondary" style={{ display: "block", marginTop: 2 }}>
                                {getGrade(grade)}
                            </Typography.Text>
                        </div>
                    </Row>
                </Col>
                <Col style={{ display: 'flex', flexDirection: "column", justifyContent: 'end', alignItems: 'center' }}>
                    <Text strong type="warning">
                        总计积分：{pointsBalance}
                    </Text>
                    <Text type="secondary" style={{ display: "block", marginTop: 2 }}>
                        今日: {formatDuration(todayDuration)}
                    </Text>
                </Col>
            </Row>
        </Card>
    )
}

export default MemberCard


