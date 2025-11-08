import { useRequest } from 'ahooks'
import { getUserInfoService } from '../../services/user'

export function useGetUserInfo() {
  const { data: userInfo, refresh: refreshGetInfo } = useRequest(
    async () => {
      const data = await getUserInfoService()

      return data
    },
    {
      manual: false
    }
  )



  return { userInfo, refreshGetInfo }
}
