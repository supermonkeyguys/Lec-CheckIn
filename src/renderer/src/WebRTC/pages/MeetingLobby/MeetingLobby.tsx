import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Space, Typography, message } from 'antd';
import {
  VideoCameraOutlined,
  PlusOutlined,
  LoginOutlined
} from '@ant-design/icons';
import styles from './MeetingLobby.module.scss';
import ContentComponent from '@renderer/components/ContentComponent/Component';
import PageInfo from '@renderer/components/PageInfo';


const { Title, Text } = Typography;

const MeetingLobby: FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    navigate(`/clock/conference/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      message.warning('请输入房间 ID');
      return;
    }
    navigate(`/clock/conference/${roomId.trim()}`);
  };

  return (
    <ContentComponent>
      <PageInfo title="视频会议" desc="创建或加入会议室" />

      <div className={styles.lobbyContainer}>
        {/* 创建会议 */}
        <Card className={styles.actionCard}>
          <VideoCameraOutlined className={styles.cardIcon} />
          <Title level={4}>创建会议</Title>
          <Text type="secondary">立即创建一个新的会议室</Text>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateRoom}
            className={styles.actionBtn}
          >
            创建会议室
          </Button>
        </Card>
        {/* 加入会议 */}
        <Card className={styles.actionCard}>
          <LoginOutlined className={styles.cardIcon} />
          <Title level={4}>加入会议</Title>
          <Text type="secondary">输入会议 ID 加入现有会议</Text>
          <Space.Compact style={{ width: '100%', marginTop: 16 }}>
            <Input
              placeholder="输入会议室 ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onPressEnter={handleJoinRoom}
              size="large"
            />
            <Button
              type="primary"
              size="large"
              onClick={handleJoinRoom}
            >
              加入
            </Button>
          </Space.Compact>
        </Card>
      </div>
    </ContentComponent>
  );
};

export default MeetingLobby;
