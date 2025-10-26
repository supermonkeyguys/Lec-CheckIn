import { io, Socket } from 'socket.io-client'

export class SignalingClient {
  private socket: Socket | null = null
  private handlers = new Map<string, Function>()

  constructor(private url: string) {}

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        auth: {
          token,
        }
      })

      this.socket.on('connect', () => {
        resolve()
        console.log('信令服务器已经连接')
      })

      this.socket.on('connect_error', (error) => {
        console.log('连接失败')
        reject(error)
      })

      this.setupMessageHandlers()
    })
  }

  private setupMessageHandlers() {
    if (!this.socket) return

    this.socket.on('offer', (data) => this.emit('offer', data))
    this.socket.on('answer', (data) => this.emit('answer', data))
    this.socket.on('ice-candidate', (data) => this.emit('ice-candidate', data))
    this.socket.on('user-joined', (data) => this.emit('user-joined', data))
    this.socket.on('user-left', (data) => this.emit('user-left', data))
    this.socket.on('room-joined', (data) => this.emit('room-joined', data))
  }

  send(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.log('信令服务器未连接')
    }
  }

  on(event: string, handler: Function) {
    this.handlers.set(event, handler)
  }

  private emit(event: string, data: any) {
    const handler = this.handlers.get(event)
    if (handler) {
      handler(data)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinRoom(roomId: string) {
    this.send('join-room', { roomId })
  }

  leaveRoom() {
    this.send('leave-room',{})
  }
}
