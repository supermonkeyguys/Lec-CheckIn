import { useRequest } from "ahooks";
import { updateUserInfo } from "../../services/user";

export function useUpdateInfo() {

    const { run: updateInfo } = useRequest(
        async (nickname: string) => {
            const res = await updateUserInfo(nickname)
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