import { io } from "socket.io-client"


const  socket = io('http://43.138.244.158:8080')

export const connectRankingSocket = (
    onUpdate: (data: any) => void,
    onError: (data: any) => void,
) => { 
    socket.on('connect',() => {
        console.log('Websocket 连接成功')
    })

    socket.on('rankingUpdated',(data) => { 
        onUpdate(data)
    })

    socket.on('error',(error) => {
        onError(error)
    })

    return () => {
        socket.off('rankingUpdated')
        socket.off('error')
    } 
}