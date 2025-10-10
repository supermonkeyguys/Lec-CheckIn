import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer/userSlice";
import { CheckInState } from "./clockReducer/type";
import checkInReducer from "./clockReducer"; 

export type StateType = {
    user: UserStateType;
    checkIn: CheckInState
}

export const store = configureStore({
    reducer: {
        user: userReducer,
        checkIn: checkInReducer
    }
})