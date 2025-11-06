import { startCheckInState } from "@renderer/services/clock";
import { useRequest } from "ahooks";
import { message } from "antd";
import { STARTTIME_KEY } from "./useTimer";



export function useStartCheckIn() {

    const { run:start , loading: loadingStart } = useRequest(
        async () => {
            const res = await startCheckInState(new Date().toISOString()) 

            localStorage.setItem(STARTTIME_KEY,new Date().toLocaleString())
            return res
        }, 
        {
           manual: true,
           onSuccess(res) {
                if(res?.ok) message.success(res?.message)
                else message.error(res?.message)
           },
           onError(err) {
                console.error(err)
                message.error(err.message)
           }
        }
    )

    return { start, loadingStart }
} 