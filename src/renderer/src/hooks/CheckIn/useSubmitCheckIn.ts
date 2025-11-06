import { endCheckInState } from '@renderer/services/clock'
import { useRequest } from 'ahooks'
import { message } from 'antd'

export function useSubmitCheckIn() {
  const {
    run: submitCheckIn,
    loading
  } = useRequest(
    async () => {
      const data = await endCheckInState(new Date().toString())
      return data
    },
    {
      manual: true,
      onSuccess(res) {
        if(res.ok)message.success(res.message)
        else message.error(res.message)
      }
    }
  )

  return { loading, submitCheckIn }
}
