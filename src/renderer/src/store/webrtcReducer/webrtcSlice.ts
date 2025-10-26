import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Participant } from '@renderer/WebRTC/types/webrtc.types'

export interface WebRTCState {
  localStream: MediaStream | null
  participants: Record<string, Participant>
  isConnected: boolean
  isMicOn: boolean
  isCameraOn: boolean
  currentRoom: string | null
  isScreenSharing: boolean
}

const initialState: WebRTCState = {
  localStream: null,
  participants: {},
  isConnected: false,
  isMicOn: true,
  isCameraOn: true,
  currentRoom: null,
  isScreenSharing: false
}

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    setLocalStream(state, action: PayloadAction<MediaStream>) {
      state.localStream = action.payload
    },

    addParticipant(state, action: PayloadAction<Participant>) {
      state.participants[action.payload.socketId] = action.payload
    },

    removeParticipant(state, action: PayloadAction<string>) {
      delete state.participants[action.payload]
    },

    updateParticipantStream(state, action: PayloadAction<{ id: string; stream: MediaStream }>) {
      if (state.participants[action.payload.id]) {
        state.participants[action.payload.id].stream = action.payload.stream
      }
    },

    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload
    },

    toggleMic(state) {
      state.isMicOn = !state.isMicOn
    },

    toggleCamera(state) {
      state.isCameraOn = !state.isCameraOn
    },

    setCurrentRoom(state, action: PayloadAction<string | null>) {
      state.currentRoom = action.payload
    },

    toggleScreenSharing: (state) => {
        state.isScreenSharing = !state.isScreenSharing
    },

    setScreenSharing: (state,action: PayloadAction<boolean>) => {
        state.isScreenSharing = action.payload
    },

    reset(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  setLocalStream,
  addParticipant,
  removeParticipant,
  updateParticipantStream,
  setConnected,
  toggleMic,
  toggleCamera,
  setCurrentRoom,
  reset,
  setScreenSharing
} = webrtcSlice.actions

export default webrtcSlice.reducer
