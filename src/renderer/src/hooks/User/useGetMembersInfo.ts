import { useRequest } from "ahooks"
import { findAllUserService } from "../../services/user"

export function useGetMembersInfo() {

    const { data, run, loading } = useRequest(
        async (grade: string) => {
            const res = await findAllUserService(grade)
            return res
        },
        {
            manual: true
        }
    )

    return { data, run, loading }
} 