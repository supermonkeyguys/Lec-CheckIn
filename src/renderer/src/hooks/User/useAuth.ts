import { getToken } from '@renderer/utils/use-Token'
import { useRequest } from 'ahooks'

export function useAuth() {
  const { data, loading } = useRequest(async () => {
    const token = await getToken()

    return { token: token ?? null }
  })

  const token = data?.token ?? null
  return { token, loading }
}
