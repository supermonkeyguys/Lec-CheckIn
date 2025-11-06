import { message } from 'antd'
import { useRequest } from 'ahooks'
import { useSlotMachine } from '@renderer/services/drawCard'

export function useSlot() {
  const {
    run,
    loading,
    data = {}
  } = useRequest(
    async () => {
      const res = await useSlotMachine()
      console.log(res)
      return res
    },
    {
      manual: true,
      onError(err) {
        message.error('抽奖失败：' + err.message)
      }
    }
  )

  return { run, loading, slotData: data?.data }
}
