export class PeerConnection {
  private pc: RTCPeerConnection

  constructor(
    private peerId: string,
    private config: RTCConfiguration,
    private callbacks: {
      onTrack: (stream: MediaStream) => void
      onIceCandidate: (candidate: RTCIceCandidate) => void
      onConnectionStateChange: (state: RTCPeerConnectionState) => void
    }
  ) {
    this.pc = new RTCPeerConnection(config)
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // 监听远端媒体流
    this.pc.ontrack = (event) => {
      console.log(`[${this.peerId}] 收到远端媒体流`)
      // 增加安全检查
      if (event.streams && event.streams.length > 0) {
        this.callbacks.onTrack(event.streams[0])
      }
    }

    // 监听 ICE 候选
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.callbacks.onIceCandidate(event.candidate)
      }
    }

    // 监听连接状态变化（connected, disconnected, failed, closed）
    this.pc.onconnectionstatechange = () => {
      console.log(`[${this.peerId}] 连接状态: ${this.pc.connectionState}`)
      this.callbacks.onConnectionStateChange(this.pc.connectionState)
    }

    // 监听 ICE 连接状态变化（new, checking, connected, completed, failed, disconnected, closed）
    this.pc.oniceconnectionstatechange = () => {
      console.log(`[${this.peerId}] ICE 状态: ${this.pc.iceConnectionState}`)
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)
    return offer
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    return answer
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(description)
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.pc.addIceCandidate(candidate)
    } catch (err) {
      console.error('添加 ICE 候选失败:', err)
    }
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.pc.addTrack(track, stream)
  }

  replaceTrack(oldTrack: MediaStreamTrack, newTrack:MediaStreamTrack): Promise<void> {
    const sender = this.pc.getSenders().find(s => s.track?.id === oldTrack.id)
    if (sender) {
      return sender.replaceTrack(newTrack) 
    } 
    throw new Error('No sender found for the given track')
  }

  close() {
    this.pc.close()
  }

  get connectionState() {
    return this.pc.connectionState
  }
  
  get iceConnectionState() {
    return this.pc.iceConnectionState
  }
}
