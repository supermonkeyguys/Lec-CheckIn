// useWebRTC.ts
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebRTCManager } from '../core/WebRTCManager'
import {
  setLocalStream,
  addParticipant,
  removeParticipant,
  updateParticipantStream,
  toggleMic as toggleMicAction,
  toggleCamera as toggleCameraAction,
  setConnected,
  reset,
  setScreenSharing
} from '@renderer/store/webrtcReducer/webrtcSlice'

import type { Participant } from '../types/webrtc.types'
import { StateType } from '@renderer/store'
import { useRequest } from 'ahooks'
import { getUsername } from '@renderer/utils/use-Token'
import { message } from 'antd'

let webrtcManager: WebRTCManager | null = null

export const useWebRTC = () => {
  const dispatch = useDispatch()

  const token = useRequest(async () => {
    const res = await window.electronAPI?.getToken(getUsername())
    return res
  })

  const {
    localStream,
    participants,
    isMicOn,
    isCameraOn,
    isConnected,
    isScreenSharing // 从 Redux 获取状态
  } = useSelector((state: StateType) => state.webrtc)

  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null)
  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>([])

  // 初始化 WebRTC Manager
  useEffect(() => {
    if (!webrtcManager) {
      webrtcManager = new WebRTCManager(
        {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
          signalingUrl: 'http://43.138.244.158:8080/signaling'
        },
        {
          onRemoteStream: (socketId, stream) => {
            dispatch(updateParticipantStream({ id: socketId, stream }))
          },
          onUserJoined: (socketId, user) => {
            dispatch(
              addParticipant({
                socketId,
                user: {
                  id: user.id,
                  username: user.username,
                  nickname: user.nickname,
                  avatarUrl: user.avatarUrl,
                  grade: user.grade
                },
                stream: null,
                audioEnabled: true,
                videoEnabled: true,
                isLocal: false
              })
            )
          },
          onUserLeft: (socketId) => {
            dispatch(removeParticipant(socketId))
          },
          onRoomJoined: (data) => {
            dispatch(setConnected(true))
            data.users.forEach((user: any) => {
              dispatch(
                addParticipant({
                  socketId: user.socketId,
                  user: user.user,
                  stream: null,
                  audioEnabled: true,
                  videoEnabled: true,
                  isLocal: false
                })
              )
            })
          }
        }
      )
    }
  }, [dispatch])

  // 加入房间
  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!webrtcManager) return
      try {
        await webrtcManager.connect()
        const stream = await webrtcManager.getLocalStream('camera')

        dispatch(setLocalStream(stream))

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        setLocalParticipant({
          socketId: 'local',
          user: {
            id: currentUser.id,
            username: currentUser.username,
            nickname: currentUser.nickname,
            avatarUrl: currentUser.avatarUrl,
            grade: currentUser.grade
          },
          stream,
          audioEnabled: true,
          videoEnabled: true,
          isLocal: true
        })
        await webrtcManager.joinRoom(roomId)
      } catch (error) {
        console.error('加入房间失败:', error)
        throw error
      }
    },
    [token.data, dispatch]
  )

  // 离开房间
  const leaveRoom = useCallback(() => {
    if (webrtcManager) {
      webrtcManager.leaveRoom()
      dispatch(reset())
      setLocalParticipant(null)
    }
  }, [dispatch])

  // 切换麦克风
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
        dispatch(toggleMicAction())
      }
    }
  }, [localStream, isMicOn, dispatch])

  // 切换摄像头
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn
        dispatch(toggleCameraAction())
      }
    }
  }, [localStream, isCameraOn, dispatch])

  // 👇 启动屏幕共享
  const startScreenShare = useCallback(async () => {
    if (!webrtcManager || !localStream) return

    try {
      await webrtcManager.startScreenShare()

      // 获取新的本地流
      const updatedStream = await webrtcManager.getLocalStream('screen')

      // 👇 添加更详细的检查
      const videoTrack = updatedStream.getVideoTracks()[0]
      console.log('屏幕共享已启动:', {
        streamId: updatedStream.id,
        active: updatedStream.active,
        videoTracks: updatedStream.getVideoTracks().length,
        // 👇 关键：检查 video track 的状态
        videoTrackDetails: videoTrack
          ? {
              id: videoTrack.id,
              kind: videoTrack.kind,
              label: videoTrack.label,
              enabled: videoTrack.enabled,
              readyState: videoTrack.readyState, // 应该是 'live'
              muted: videoTrack.muted
            }
          : null
      })

      dispatch(setLocalStream(updatedStream))
      dispatch(setScreenSharing(true))
    } catch (err: any) {
      if (err.message !== '用户取消屏幕共享') {
        message.error('屏幕共享启动失败')
      }
      console.error('屏幕共享错误:', err)
    }
  }, [webrtcManager, localStream, dispatch])

  // 👇 停止屏幕共享（切换回摄像头）
  const stopScreenShare = useCallback(async () => {
    if (!webrtcManager || !localStream) return

    try {
      // 切换回摄像头（保留当前音频状态）
      await webrtcManager.stopScreenShare()

      const newLocalStream = await webrtcManager.getLocalStream('camera')
      dispatch(setLocalStream(newLocalStream))
      dispatch(setScreenSharing(false))
    } catch (err) {
      message.error('切换回摄像头失败')
      console.error(err)
    }
  }, [localStream, dispatch])

  // 👇 切换屏幕共享
  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare()
    } else {
      startScreenShare()
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare])

  // 更新远端参与者列表
  useEffect(() => {
    setRemoteParticipants(Object.values(participants))
  }, [participants])

  return {
    localParticipant,
    remoteParticipants,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    isConnected,
    joinRoom,
    leaveRoom,
    toggleMic,
    toggleCamera,
    toggleScreenShare
  }
}
