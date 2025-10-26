import { FC } from "react"
import styles from './ControlBar.module.scss'
import { Button, Space, Tooltip } from "antd"
import {
    AudioMutedOutlined,
    AudioOutlined,
    DesktopOutlined,
    MessageOutlined,
    PhoneOutlined,
    SettingOutlined,
    StopOutlined,
    VideoCameraFilled,
    VideoCameraOutlined
} from "@ant-design/icons"

interface ControlBarProps {
    isMicOn: boolean
    isCameraOn: boolean
    onToggleMic: () => void
    onToggleCamera: () => void
    onLeaveRoom: () => void
    onOpenSettings?: () => void
    onOpenChat?: () => void
    isScreenSharing?: boolean
    onToggleScreenShare: () => void
}

const ControlBar: FC<ControlBarProps> = ({
    isMicOn,
    isCameraOn,
    onToggleMic,
    onToggleCamera,
    onLeaveRoom,
    onOpenSettings,
    onOpenChat,
    isScreenSharing,
    onToggleScreenShare
}) => {
    return (
        <div className={styles.ControlBarContainer}>
            <Space size="large">
                <Tooltip title={isMicOn ? '关闭麦克风' : '打开麦克风'}>
                    <Button
                        type='primary'
                        shape="circle"
                        size="large"
                        icon={isMicOn ? <AudioOutlined /> : <AudioMutedOutlined />}
                        onClick={onToggleMic}
                        className={isMicOn ? styles.activeBtn : styles.mutedBtn}
                    />
                </Tooltip>

                <Tooltip title={isCameraOn ? '关闭摄像头' : '打开摄像头'}>
                    <Button
                        type='primary'
                        shape="circle"
                        size="large"
                        icon={isCameraOn ? <VideoCameraOutlined /> : <VideoCameraFilled />}
                        onClick={onToggleCamera}
                        className={isCameraOn ? styles.activeBtn : styles.mutedBtn}
                    />
                </Tooltip>
                
                <Tooltip
                    title={isScreenSharing ? '停止共享' : '共享屏幕'}
                >
                    <Button
                        type='primary'
                        shape="circle"
                        size='large'
                        icon={isScreenSharing ? <StopOutlined /> : <DesktopOutlined />}
                        onClick={onToggleScreenShare}
                        className={isScreenSharing ? styles.activeBtn : styles.mutedBtn}
                    />
                </Tooltip>

                <Tooltip title='离开房间'>
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        danger
                        icon={<PhoneOutlined />}
                        onClick={onLeaveRoom}
                        className={styles.hangupBtn}
                    />
                </Tooltip>

                {onOpenChat && (
                    <Tooltip title='聊天'>
                        <Button
                            type='default'
                            shape='circle'
                            size='large'
                            icon={<MessageOutlined />}
                            onClick={onOpenChat}
                        />
                    </Tooltip>
                )}

                {onOpenSettings && (
                    <Tooltip title='设置'>
                        <Button
                            type='default'
                            shape='circle'
                            size='large'
                            icon={<SettingOutlined />}
                            onClick={onOpenSettings}
                        />
                    </Tooltip>
                )}

            </Space>
        </div>
    )
}

export default ControlBar