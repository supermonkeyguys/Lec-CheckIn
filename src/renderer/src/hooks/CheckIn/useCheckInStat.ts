import { getCheckInStatService } from "@renderer/services/clock";
import { getUserId } from "@renderer/utils/use-Token";
import { useRequest } from "ahooks";


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