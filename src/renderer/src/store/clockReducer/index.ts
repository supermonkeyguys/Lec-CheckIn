import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CheckInRecord, CheckInState, CheckInStats } from "./type"

const INIT_STATE: CheckInState = {
    records: {},
    stats: {
        totalCount: 0,
        consecutiveDays: 0,
        totalPoints: 0
    },
    current: {
        checkInDate: new Date().toString().split('T')[0],
        startTime: '',
        endTime: '',
        isEditing: false,
    },

    isRunning: false,
    startTime:'',
    currentTime: 0,
}

export const checkInSlice = createSlice({
    name: 'check',
    initialState: INIT_STATE,
    reducers: {
        resetCurrent: (state: CheckInState) => {
            state.current = INIT_STATE.current
        },
        resetCheckIn: () => INIT_STATE,
        updateCurrent: (state: CheckInState, action: PayloadAction<Partial<CheckInState['current']>>) => {
            state.current = { ...state.current, ...action.payload }
        },
        addCheckInRecord: (state: CheckInState, action: PayloadAction<CheckInRecord>) => {
            const newRecord = action.payload
            const key = newRecord.checkInDate
            if (!state.records[key]) state.records[key] = []
            state.records[key].push(newRecord)

            state.stats.totalCount += 1;
            state.stats.totalPoints += newRecord.rewardPoints;
        },
        getCheckInData: (state: CheckInState, action: PayloadAction<{ records: CheckInRecord[]; stats: CheckInStats }>) => {
            state.records = action.payload.records.reduce((acc, record) => {
                const key = record.checkInDate;
                if (!acc[key]) acc[key] = []
                acc[key].push(record)
                return acc
            }, {} as Record<string, CheckInRecord[]>)
            state.stats = action.payload.stats
        }
    }
})

export const {
    updateCurrent,
    resetCheckIn,
    resetCurrent,
    addCheckInRecord,
    getCheckInData,
} = checkInSlice.actions

export default checkInSlice.reducer 