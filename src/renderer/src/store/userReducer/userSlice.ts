import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserStateType = {
    nickname: string;
    avatarUrl: string
}

const INIT_STATE: UserStateType = {
    nickname: '',
    avatarUrl:'',
}


const userSlice = createSlice({
    name: 'user',
    initialState: INIT_STATE,
    reducers: {
        loginReducer: (state: UserStateType, action: PayloadAction<UserStateType>) => {
            return action.payload
        },
        logoutReducer: () => INIT_STATE
    }
})

export const { loginReducer, logoutReducer } = userSlice.actions

export default userSlice.reducer