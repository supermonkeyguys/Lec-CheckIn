import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer/userSlice";
import { CheckInState } from "./clockReducer/type";
import checkInReducer from "./clockReducer"; 
import settingReducer, { SettingState } from "./settingReducer";

export type StateType = {
    user: UserStateType
    checkIn: CheckInState
    setting: SettingState
}

export const store = configureStore({
    reducer: {
        user: userReducer,
        checkIn: checkInReducer,
        setting: settingReducer
    }
})