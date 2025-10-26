export type CheckInStatus = 'completed' | 'pending';

export interface CheckInRecord {
    fe_id: string;
    username: string;
    checkInDate: string;
    startTime: string;
    endTime: string;
    checkInTime: string;
    rewardPoints: number;
    status: CheckInStatus;
}

export interface CheckInStats {
    totalCount: number;
    consecutiveDays: number;
    totalPoints: number;
}

export interface CheckInState {
    records: Record<string, CheckInRecord[]>;

    stats: CheckInStats;

    current: {
        checkInDate: string;
        startTime: string;
        endTime: string;
        isEditing: boolean;
        editingId?: string;
    }

    isRunning: boolean;
    startTime: string;
    currentTime: number;
}

export interface SubmitCheckInParams {
    checkInDate: Date;
    startTime: Date;
    endTime: Date;
    duration: number;
}

export type DateRange = {
    startDate: string | null;
    endDate: string | null;
}