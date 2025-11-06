import { useCard } from '@renderer/services/drawCard'
import { useRequest } from 'ahooks'
import { message } from 'antd'

export function useCardEffect() {
  const { run } = useRequest(
    async (username: string, cardName: string) => {
      const res = await useCard(username, cardName)

      return res
    },
    {
      manual: true,
      onSuccess(res) {
        if (res?.ok) message.success(res?.message)
        else message.error(res?.message)
      }
    }
  )

  return { run }
}
