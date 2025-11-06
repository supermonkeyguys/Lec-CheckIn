import { addCheckInRecord } from '@renderer/services/clock'
import { useRequest } from 'ahooks'

export function useAddRecord() {
  const { run } = useRequest(
    async (duration: number) => {
      const res = await addCheckInRecord(duration)

      return res
    },
    {
      manual: true,
      onSuccess(res) {
        console.log(res)
      },
      onError(err) {
        console.error(err.message)
      }
    }
  )

  return { run }
}
