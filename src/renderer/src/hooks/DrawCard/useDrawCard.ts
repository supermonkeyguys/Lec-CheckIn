import { drawCard } from '@renderer/services/drawCard'
import { useRequest } from 'ahooks'
import { message } from 'antd'

export function useDrawCard(startRoll: (cardType:string) => void) {
  const { run } = useRequest(
    async () => {
      const res = await drawCard()

      return res
    },
    {
      manual: true,
      onSuccess(res) {
        if (res?.ok) {
          message.success(res?.message)
          startRoll(res.cardType)
        } else message.error(res?.message)
      }
    }
  )

  return { run }
}
