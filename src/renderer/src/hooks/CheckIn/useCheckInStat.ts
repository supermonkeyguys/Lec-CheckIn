import { useRequest } from "ahooks";
import { getCheckInStatService } from "@/renderer/src/services/clock";
import { getUserId } from "@/renderer/src/utils/use-Token";



export function useCheckInStat() {

    const { data,run } = useRequest(
        async () => {
            const userId = await getUserId()
            const data = getCheckInStatService(userId)
            return data 
        },
        {
            manual:true
        }
    )

    return { data, run }
}