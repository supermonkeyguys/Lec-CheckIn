import { getCheckInStatService } from "@renderer/services/clock";
import { useRequest } from "ahooks";


export function useCheckInStat() {

    const { data,run, refresh } = useRequest(
        async () => {
            const data = getCheckInStatService()
            return data 
        },
        {
            manual:true
        }
    )

    return { data, run, refresh }
}