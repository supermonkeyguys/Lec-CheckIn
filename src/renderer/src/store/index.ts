import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer/userSlice";
import { CheckInState } from "./clockReducer/type";
import checkInReducer from "./clockReducer"; 
import settingReducer, { SettingState } from "./settingReducer";
import webrtcReducer, { WebRTCState } from './webrtcReducer/webrtcSlice'

export type StateType = {
    user: UserStateType
    checkIn: CheckInState
    setting: SettingState
    webrtc: WebRTCState
}

export const store = configureStore({
    reducer: {
        user: userReducer,
        checkIn: checkInReducer,
        setting: settingReducer,
        webrtc: webrtcReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['webrtc/setLocalStream', 'webrtc/updateParticipantStream'],
            ignoredPaths: ['webrtc.localStream', 'webrtc.participants']
          }
        })
})