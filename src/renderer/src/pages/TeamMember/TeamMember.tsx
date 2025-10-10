import { FC, useEffect, useState } from "react";
import ContentComponent from "../../components/ContentComponent/Component";
import PageInfo from "../../components/PageInfo";
import { Avatar, Button, Card, Col, message, Row, Spin, Typography } from "antd";
import { useGetMembersInfo } from "../../hooks/User/useGetMembersInfo";
import styles from './TeamMember.scss'
import { getGrade } from "../Profile/Profile";
import { connectRankingSocket } from "../ClockIn/ClockRanking/utils/socket";

const { Text } = Typography

interface UserItem {
  userId: string;
  nickname: string;
  avatarUrl: string;
  grade: string;
  pointsBalance: number;
}


const gradeList = ['all', 'freshman', 'sophomore', 'junior', 'senior']
const gradeBadgeColorMap: Record<string, string> = {
  freshman: "blue",
  sophomore: "orange",
  junior: "green",
  senior: "purple",
};

const GradeFilter: FC<{
  activeValue: number;
  setActiveValue: (g: number) => void;
}> = ({ activeValue, setActiveValue }) => {
  return (
    <Row align="middle" justify="start" style={{ gap: 15, marginBottom: 16 }}>
      {gradeList.map((g, i) => (
        <Button
          key={g}
          type={activeValue === i ? "primary" : "default"}
          onClick={() => setActiveValue(i)}
        >
          {getGrade(g)}
        </Button>
      ))}
    </Row>
  );
};

const MemberCard: FC<UserItem> = ({ nickname, grade, pointsBalance, avatarUrl }) => {
  return (
    <Card hoverable style={{ borderRadius: 8 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Row align="middle">
            <Avatar src={avatarUrl} alt="用户头像" size={48} />
            <div style={{ marginLeft: 10 }}>
              <Text strong>{nickname}</Text>
              <Typography.Text type="secondary" style={{ display: "block", marginTop: 2 }}>
                {getGrade(grade)}
              </Typography.Text>
            </div>
          </Row>
        </Col>
        <Col>
          <Text strong type="warning">
            总计积分：{pointsBalance}
          </Text>
          <Text type="secondary" style={{ display: "block", marginTop: 2 }}>
            今日: {0}h
          </Text>
        </Col>
      </Row>
    </Card>
  );
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
        {members.map((member) => (
          <Col key={member.userId} xs={24} sm={12} md={8}>
            <MemberCard {...member} />
          </Col>
        ))}
      </Row>
    </div>
  );
};


const TeamMember: FC = () => {
  const [activeGradeIndex, setActiveGradeIndex] = useState(0);
  const currentGrade = gradeList[activeGradeIndex];
  const { data, run, loading } = useGetMembersInfo();

  useEffect(() => {
    run(currentGrade === "all" ? "all" : currentGrade);
  }, [currentGrade]);
  console.log(data)

  useEffect(() => {
    const disconnect = connectRankingSocket(
      () => {
        console.log("收到更新，刷新成员数据...");
        run(currentGrade === "全部" ? "all" : currentGrade);
      },
      (error) => {
        message.error("实时连接错误：" + error.message);
      }
    );
    return () => disconnect();
  }, [currentGrade]);


  const allMembers: any = data || [];
  const filteredMembers =
    currentGrade === "all"
      ? allMembers
      : allMembers.filter((m: any) => m.grade === currentGrade);
  return (
    <ContentComponent
      componentList={[
        () => <PageInfo title="团队成员" desc="查看当前团队成员信息" />,
        () => (
          <GradeFilter
            activeValue={activeGradeIndex}
            setActiveValue={setActiveGradeIndex}
          />
        ),
        () => (
          <Spin spinning={loading}>
            <div style={{ marginTop: 16 }}>
              {currentGrade === "all" ? (
                gradeList.slice(1).map((grade) => (
                  <GradeGroup
                    key={grade}
                    grade={grade}
                    members={allMembers.filter((m: any) => m.grade === grade)}
                  />
                ))
              ) : (
                <GradeGroup grade={currentGrade} members={filteredMembers} />
              )}
            </div>
          </Spin>
        ),
      ]}
    />
  );
};

export default TeamMember

