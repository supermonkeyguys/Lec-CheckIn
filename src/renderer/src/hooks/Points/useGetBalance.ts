import { getBalance } from '@renderer/services/points'
import { useRequest } from 'ahooks'

export function useGetBalance() {
  const { run, data: pointsBalance, refresh } = useRequest(
    async () => {
      const res = await getBalance()

      return res as unknown as number
    },
    {
      manual: true
    }
  )

  return { run, pointsBalance, refresh }
}
