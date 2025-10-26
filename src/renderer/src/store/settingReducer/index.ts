import { createSlice } from "@reduxjs/toolkit"


export type BackgroundType = 'none' | 'image' | 'video'
export type ThemeType = 'light' | 'dark' | 'custom'

export interface SettingState {
    reminderTime?: number
    reminderInterval?: number
    backgroundType?:BackgroundType
    backgroundImageSrc?:string
    backgroundVideoSrc?:string
    theme?: ThemeType
    customColor?: string
}


const initialState: SettingState = {
    reminderTime: 3 * 60 * 60 * 1000,
    reminderInterval: 30 * 60 * 1000,
    backgroundType:'none',
    backgroundImageSrc:'',
    backgroundVideoSrc:'',
    theme: 'light'
}

export const settingSlice = createSlice({
    name:'setting',
    initialState, 
    reducers:{
        updateSetting:(state:SettingState,action) => {
            Object.assign(state,action.payload)
        }
    }
})


export const {
    updateSetting
} = settingSlice.actions

export default settingSlice.reducer