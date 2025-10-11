import { getToken, getUserId } from '@renderer/utils/use-Token'
import { useRequest } from 'ahooks'

export function useAuth() {
  const { data, loading } = useRequest(async () => {
    const userId = await getUserId()
    const token = await getToken()

    return { userId: userId ?? null, token: token ?? null }
  })

  const token = data?.token ?? null
  const userId = data?.userId ?? null
  return { token, userId, loading }
}
