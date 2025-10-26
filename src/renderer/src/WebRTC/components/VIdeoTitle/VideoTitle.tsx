import { Avatar, Card, Typography } from "antd";
import { Participant } from "../../types/webrtc.types";
import { FC, useEffect, useRef } from "react";
import styles from './VideoTitle.module.scss'
import { AudioMutedOutlined, AudioOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from "@ant-design/icons";

const { Text } = Typography

interface VideoTitleProps {
    participant: Participant
    isLocal?: boolean
}

const VideoTitle: FC<VideoTitleProps> = ({ participant, isLocal = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current && participant.stream) {
            videoRef.current.srcObject = participant.stream
        }
    }, [participant.stream])

    return (
        <Card>
            {participant.stream && participant.videoEnabled ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className={styles.video}

                />
            ) : (
                <div>
                    <Avatar
                        size={64}
                        src={participant.user.avatarUrl}
                        className={styles.avatar}
                    >
                        {participant.user.nickname?.[0]?.toUpperCase()}
                    </Avatar>
                </div>
            )}


            <div className={styles.userInfo}>
                <div className={styles.userName}>
                    <Text strong style={{ color: '#fff' }}>
                        {participant.user.nickname}
                        {isLocal && '我'}
                    </Text>
                </div>

                <div className={styles.indicators}>
                    {participant.audioEnabled ? (
                        <AudioOutlined className={styles.iconActive} />
                    ) : (
                        <AudioMutedOutlined className={styles.iconMuted} />
                    )}

                    {participant.videoEnabled ? (
                        <VideoCameraOutlined className={styles.iconActive} />
                    ) : (
                        <VideoCameraAddOutlined className={styles.iconMuted} />
                    )}
                </div>
            </div>

            {isLocal && (
                <div className={styles.localBadge}>
                    <Text style={{ fontSize: 12, color: '#fff' }}>本地</Text>
                </div>
            )}
        </Card>
    )
}

export default VideoTitle