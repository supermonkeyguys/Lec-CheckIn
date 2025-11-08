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

      return res
    },
    {
      manual: true,
      onSuccess(res) {
        if(res.ok)message.success(res.message)
        else message.error(res.message)
      },
      onError(err) {
        message.error('抽奖失败：' + err.message)
      }
    }
  )

  return { run, loading, slotData: data?.data }
}
