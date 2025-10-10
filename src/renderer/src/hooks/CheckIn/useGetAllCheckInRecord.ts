import { useRequest } from "ahooks";
import { SearchOption } from "./useCheckInRecord";
import { getUserAllCheckInRecordsService } from "../../services/clock"

export function useGetAllCheckInRecord() {

    const { run: getAllRecords, data: allRecords , loading: allRecordsLoading } = useRequest(
        async (params: SearchOption) => {
            console.log(params)
            const res = await getUserAllCheckInRecordsService(params)
            return res || []
        },
        {
            manual: true
        }
    )

    return { getAllRecords , allRecords ,allRecordsLoading }
}