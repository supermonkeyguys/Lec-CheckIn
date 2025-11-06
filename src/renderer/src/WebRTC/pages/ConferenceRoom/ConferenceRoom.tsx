import { FC, useEffect, useState } from 'react'
import styles from './ConferenceRoom.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebRTC } from '@renderer/WebRTC/hooks/useWebRTC'
import { Card, message, Modal, Spin } from 'antd'
import { CLOCKIN_PAGE_PATHNAME } from '@renderer/router/router'
import { LoadingOutlined } from '@ant-design/icons'
import ContentComponent from '@renderer/components/ContentComponent/Component'
import PageInfo from '@renderer/components/PageInfo'
import VideoGrid from '@renderer/WebRTC/components/VideoGrid/VideoGrid'
import ControlBar from '@renderer/WebRTC/components/ControlBar/ControlBar'

const ConferenceRoom: FC = () => {
    const { roomId } = useParams<{ roomId: string }>()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const {
        localParticipant,
        remoteParticipants,
        isMicOn,
        isCameraOn,
        toggleMic,
        toggleCamera,
        leaveRoom,
        joinRoom,
        isScreenSharing,
        toggleScreenShare,
    } = useWebRTC()

    useEffect(() => {
        if (!roomId || roomId === 'roomId') {
            console.log("room:", roomId)
            message.error('房间不存在')
            navigate(CLOCKIN_PAGE_PATHNAME)
            return
        }

        const initConference = async () => {
            try {
                setIsLoading(true)
                await joinRoom(roomId)
                message.success('已加入房间')
            } catch (err) {
                message.error('加入房间失败')
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }

        initConference()

        return () => {
            leaveRoom()
        }
    }, [roomId])

    const handleLeaveRoom = () => {
        Modal.confirm({
            title: '确认离开会议室?',
            content: '离开后将会断开连接',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                leaveRoom()
                message.info('已离开会议室')
                navigate(CLOCKIN_PAGE_PATHNAME)
            }
        })
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                    tip='正在加入会议室...'
                />
            </div>
        )
    }

    return (
        <ContentComponent>
            <PageInfo
                title={`会议室 ${roomId}`}
                desc={`在线人数: ${remoteParticipants.length + 1}`}
            />
            <Card className={styles.videoContainer}>
                <VideoGrid
                    participants={remoteParticipants}
                    localParticipant={localParticipant}
                />
            </Card>
            <div className={styles.controlBarWrapper}>
                <ControlBar
                    isMicOn={isMicOn}
                    isCameraOn={isCameraOn}
                    onToggleMic={toggleMic}
                    onToggleCamera={toggleCamera}
                    onLeaveRoom={handleLeaveRoom}
                    isScreenSharing={isScreenSharing}
                    onToggleScreenShare={toggleScreenShare}
                />
            </div>
        </ContentComponent>
    )
}

export default ConferenceRoom