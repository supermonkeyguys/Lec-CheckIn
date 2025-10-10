import { getUserId } from "@renderer/utils/use-Token";
import { useRequest } from "ahooks";
import { updateUserInfo } from "../../services/user";

export function useUpdateInfo() {

    const { run: updateInfo } = useRequest(
        async (nickname: string) => {
            const userId = await getUserId()
            const res = await updateUserInfo(userId,nickname)
            return res
        },
        {
            manual:true,
            onSuccess(res) {
                console.log(res)
            }
        }
    )

    return  { updateInfo }
}