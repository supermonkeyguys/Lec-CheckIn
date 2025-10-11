import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store";
import { useCallback, useEffect, useState } from "react";
import { startTimer, stopTimer } from "../../store/clockReducer";
import { Timeout } from "ahooks/lib/useRequest/src/types";

export function useTimer() {
    const dispatch = useDispatch()
    const { isTiming, startTime , staTime } = useSelector(
        (state: StateType) => state.checkIn
    )

    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        let interval:Timeout | null = null

        if (isTiming && startTime) {
            const updateElapsedTime = () => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000)
                setSeconds(elapsed)
            }
            updateElapsedTime()

            interval = setInterval(updateElapsedTime, 1000)
        } else {
            setSeconds(0)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isTiming, startTime])


    const handleStart = useCallback(() => {
        dispatch(startTimer())
    }, [dispatch])


    const handleStop = useCallback(() => {
        const finalSeconds = isTiming && startTime ?
            Math.floor((Date.now() - startTime) / 1000) : 0

        dispatch(stopTimer())
        return finalSeconds
    }, [dispatch, isTiming, seconds])


    return {
        isTiming,
        startTime,
        staTime,
        currentSeconds: seconds,
        handleStart,
        handleStop
    }
}  