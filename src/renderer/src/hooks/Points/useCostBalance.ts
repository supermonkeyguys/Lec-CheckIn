import { costPoints } from '@renderer/services/points'
import { useRequest } from 'ahooks'
import { message } from 'antd'

export function useCostBalance(action: () => void) {
  const { run, loading, data } = useRequest(
    async (price: number) => {
      const res = await costPoints(price)

      return res
    },
    {
      manual: true,
      onSuccess(res) {
        if (res?.ok) {
          message.success(res?.message)
          action()
        } else message.warning(res?.message)
      },
      onError(err) {
        console.error(err.message)
        message.error('出了点小问题')
      }
    }
  )

  return { run, data, loading }
}
