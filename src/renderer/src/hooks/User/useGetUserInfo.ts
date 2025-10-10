import { getUserId } from '@/renderer/src/utils/use-Token'
import { useRequest } from 'ahooks'
import { getUserInfoService } from '../../services/user'

export function useGetUserInfo() {
  const {
    data: userInfo,
    refresh: refreshGetInfo
  } = useRequest(
    async () => {
      const userId = await getUserId()
      const data = await getUserInfoService(userId)

      return data
    },
    {
      manual: true
    }
  )
  
  return { userInfo , refreshGetInfo }
}