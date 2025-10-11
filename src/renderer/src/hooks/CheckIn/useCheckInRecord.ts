import { useRequest } from 'ahooks'
import { RecordData } from '../../pages/ClockIn/ClockRecord/RecordTable/RecordTable'
import { getCheckInRecordService } from '@renderer/services/clock'

export type SearchOption = {
  userId: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function useCheckInRecord() {
  const {
    run: getRecords,
    loading,
    data: records
  } = useRequest(
    async (params: SearchOption) => {
      console.log(params)
      const res = (await getCheckInRecordService(params)) as RecordData
      return res || []
    },
    {
      manual: true
    }
  )

  return { getRecords, loading, records }
}
