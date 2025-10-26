import { FC, useMemo } from 'react';
import { Row, Col, Empty } from 'antd';
import type { Participant } from '../../types/webrtc.types';
import styles from './VideoGrid.module.scss';
import VideoTitle from '../VIdeoTitle/VideoTitle';

interface VideoGridProps {
  participants: Participant[];
  localParticipant: Participant | null;
}

const VideoGrid: FC<VideoGridProps> = ({ participants, localParticipant }) => {
  // 计算网格布局
  const gridLayout = useMemo(() => {
    const total = participants.length + (localParticipant ? 1 : 0);
    
    if (total === 0) return { cols: 24, rows: 1 };
    if (total === 1) return { cols: 24, rows: 1 };
    if (total === 2) return { cols: 12, rows: 1 };
    if (total <= 4) return { cols: 12, rows: 2 };
    if (total <= 6) return { cols: 8, rows: 2 };
    if (total <= 9) return { cols: 8, rows: 3 };
    return { cols: 6, rows: 4 };
  }, [participants.length, localParticipant]);

  const allParticipants = useMemo(() => {
    const validParticipants = participants.filter(
      p => p && p.socketId && p.user && p.user.id
    );
    
    const list = [...validParticipants];
    
    // 如果本地参与者有效，添加到列表开头
    if (localParticipant && localParticipant.socketId) {
      list.unshift(localParticipant);
    }

    return list;
  }, [participants, localParticipant]);

  // 如果没有有效的参与者
  if (allParticipants.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty
          description="暂无参与者"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={styles.videoGridContainer}>
      <Row gutter={[16, 16]} className={styles.gridRow}>
        {allParticipants.map((participant, index) => {
          // 双重保险：再次检查 participant 有效性
          if (!participant || !participant.socketId) {
            return null;
          }
          
          return (
            <Col
              key={participant.socketId}
              span={gridLayout.cols}
              className={styles.gridCol}
            >
              <VideoTitle
                participant={participant}
                isLocal={index === 0 && !!localParticipant}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default VideoGrid;
