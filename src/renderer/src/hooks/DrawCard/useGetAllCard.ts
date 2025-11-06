import { getAllCard } from '@renderer/services/drawCard'
import { useRequest } from 'ahooks'
import { message } from 'antd'

export function useGetAllCard() {
  const { run, data } = useRequest(
    async () => {
      const res = await getAllCard()

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

  return { run, data }
}
