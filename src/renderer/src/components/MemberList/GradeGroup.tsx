import { UserItem } from "@renderer/hooks/User/useTeamMembers";
import { getGrade } from "@renderer/utils/getGrade";
import { Col, Row, Typography } from "antd";
import { FC } from "react";
import MemberCard from "./MemberCard";

const { Text } = Typography

const gradeBadgeColorMap: Record<string, string> = {
    freshman: "blue",
    sophomore: "orange",
    junior: "green",
    senior: "purple",
};

const GradeGroup: FC<{
    grade: string;
    members: UserItem[];
}> = ({ grade, members }) => {
    if (members.length === 0) return null;
    return (
        <div style={{ marginBottom: 24 }}>
            <Row align="middle" style={{ marginBottom: 12 }}>
                <span
                    style={{
                        backgroundColor: gradeBadgeColorMap[grade],
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginRight: 8,
                    }}
                >
                    {getGrade(grade)}
                </span>
                <Text strong>{getGrade(grade)}成员</Text>
                <Text type="secondary" style={{ marginLeft: 6 }}>
                    ({members.length}人)
                </Text>
            </Row>
            <Row gutter={[16, 16]}>
                {members.map((member,i) => (
                    <Col key={member.nickname + i} xs={24} sm={12} md={8}>
                        <MemberCard {...member} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default GradeGroup