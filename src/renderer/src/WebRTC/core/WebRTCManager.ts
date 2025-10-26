// WebRTCManager.ts
import { getUsername } from '@renderer/utils/use-Token'
import { WebRTCConfig } from '../types/webrtc.types'
import { DeviceManager, StreamType } from './DeviceManager'
import { PeerConnection } from './PeerConnection'
import { SignalingClient } from './SignalingClients'

export class WebRTCManager {
  private peers = new Map<string, PeerConnection>()
  private localStream: MediaStream | null = null
  private signalingClient: SignalingClient
  private deviceManager: DeviceManager
  private currentStreamType: StreamType = 'camera'

  constructor(
    private config: WebRTCConfig,
    private callbacks: {
      onRemoteStream: (peerId: string, stream: MediaStream) => void
      onUserJoined: (userId: string, user: any) => void
      onUserLeft: (userId: string) => void
      onRoomJoined: (data: any) => void
    }
  ) {
    this.signalingClient = new SignalingClient(config.signalingUrl)
    this.deviceManager = new DeviceManager()
    this.setupSignalingHandlers()
  }

  private setupSignalingHandlers() {
    this.signalingClient.on('user-joined', async (data: { socketId: string; user: any }) => {
      console.log(`${data.user.nickname} 加入房间`)
      this.callbacks.onUserJoined(data.socketId, data.user)
      await this.createPeerConnection(data.socketId, true)
    })

    this.signalingClient.on('user-left', (data: { userId: string }) => {
      console.log(`用户 ${data.userId} 离开`)
      this.removePeerConnection(data.userId)
      this.callbacks.onUserLeft(data.userId)
    })

    this.signalingClient.on('room-joined', async (data: { roomId: string; users: any[] }) => {
      console.log(`成功加入房间 ${data.roomId}`)
      this.callbacks.onRoomJoined(data)
    })

    this.signalingClient.on(
      'offer',
      async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
        console.log(`收到来自 ${data.from} 的 offer`)
        await this.handleOffer(data.from, data.offer)
      }
    )

    this.signalingClient.on(
      'answer',
      async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
        console.log(`收到来自 ${data.from} 的 answer`)
        await this.handleAnswer(data.from, data.answer)
      }
    )

    this.signalingClient.on(
      'ice-candidate',
      async (data: { from: string; candidate: RTCIceCandidateInit }) => {
        await this.handleIceCandidate(data.from, data.candidate)
      }
    )
  }

  async connect() {
    const data = await window.electronAPI?.getToken(getUsername())
    await this.signalingClient.connect(data?.token)
  }

  async getLocalStream(
    type: StreamType,
    constraints: MediaStreamConstraints = { video: true, audio: true }
  ) {
    if (this.localStream && this.currentStreamType === type) {
      return this.localStream
    }

    const newStream = await this.deviceManager.getLocalStream(type, constraints)

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }

    this.localStream = newStream
    this.currentStreamType = type

    return this.localStream
  }

  async joinRoom(roomId: string) {
    this.signalingClient.joinRoom(roomId)
  }

  leaveRoom() {
    this.signalingClient.leaveRoom()
    this.closeAllConnections()
  }

  private async createPeerConnection(peerId: string, isInitiator: boolean) {
    const pc = new PeerConnection(
      peerId,
      { iceServers: this.config.iceServers },
      {
        onTrack: (stream) => this.callbacks.onRemoteStream(peerId, stream),
        onIceCandidate: (candidate) => {
          this.signalingClient.send('ice-candidate', { to: peerId, candidate })
        },
        onConnectionStateChange: (state) => {
          if (state === 'failed' || state === 'closed') {
            this.removePeerConnection(peerId)
          }
        }
      }
    )

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    }

    this.peers.set(peerId, pc)

    if (isInitiator) {
      const offer = await pc.createOffer()
      this.signalingClient.send('offer', { to: peerId, offer })
    }
  }

  private async handleOffer(peerId: string, offer: RTCSessionDescriptionInit) {
    let pc = this.peers.get(peerId)
    if (!pc) {
      await this.createPeerConnection(peerId, false)
      pc = this.peers.get(peerId)!
    }

    await pc.setRemoteDescription(offer)
    const answer = await pc.createAnswer()
    this.signalingClient.send('answer', { to: peerId, answer })
  }

  private async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peers.get(peerId)
    if (pc) {
      await pc.setRemoteDescription(answer)
    }
  }

  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peers.get(peerId)
    if (pc) {
      await pc.addIceCandidate(candidate)
    }
  }

  private removePeerConnection(peerId: string) {
    const pc = this.peers.get(peerId)
    if (pc) {
      pc.close()
      this.peers.delete(peerId)
    }
  }

  private closeAllConnections() {
    this.peers.forEach((pc) => pc.close())
    this.peers.clear()

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  // 动态切换视频源（摄像头 ↔ 屏幕）
  async switchVideoSource(targetType: StreamType) {
    if (!this.localStream) {
      throw new Error('No local stream available')
    }

    if (this.currentStreamType === targetType) {
      return
    }

    try {
      console.log(`Switching from ${this.currentStreamType} to ${targetType}`)

      const newStream = await this.deviceManager.getLocalStream(targetType, {
        video: true,
        audio: false
      })
      const newVideoTrack = newStream.getVideoTracks()[0]

      if (!newVideoTrack) {
        throw new Error('Failed to get new video track')
      }

      // 替换所有 peer 的视频轨道
      const oldVideoTrack = this.localStream.getVideoTracks()[0]
      if (oldVideoTrack) {
        for (const pc of this.peers.values()) {
          await pc.replaceTrack(oldVideoTrack, newVideoTrack)
        }
        // 直接在现有的流上操作 不创建新流
        this.localStream.removeTrack(oldVideoTrack)
        oldVideoTrack.stop()
      }

      // 添加至新的视频到现有流
      this.localStream.addTrack(newVideoTrack)
      this.currentStreamType = targetType
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  // 启动屏幕共享（带 UI）
  async startScreenShare() {
    await this.switchVideoSource('screen')
  }

  async stopScreenShare() {
    await this.switchVideoSource('camera')
  }

  disconnect() {
    this.leaveRoom()
    this.signalingClient.disconnect()
  }

  // 设备管理
  async getDevices() {
    return this.deviceManager.getDevices()
  }

  async checkPermissions() {
    return this.deviceManager.checkPermissions()
  }
}
