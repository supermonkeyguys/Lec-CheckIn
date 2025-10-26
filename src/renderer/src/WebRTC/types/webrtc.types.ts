export interface UserInfo {
    id: string 
    username: string
    nickname: string
    avatarUrl?: string
    grade: string
}


export interface Participant {
    socketId: string
    user: UserInfo
    stream: MediaStream | null
    audioEnabled: boolean
    videoEnabled: boolean
    isLocal: boolean
}

export interface WebRTCConfig {
    iceServers:RTCConfiguration['iceServers']
    signalingUrl: string
}

export interface SignalingMessage {
    type: 'offer' | 'ice-candidate' | 'join-room' | 'leave-room'
    from?: string
    to?: string
    data?: any 
}

export interface DeviceInfo {
    deviceId: string
    label: string
    kind: MediaDeviceKind
}

export interface DesktopSource {
    id: string;
    name: string;
    thumbnail: string; // data URL
  }