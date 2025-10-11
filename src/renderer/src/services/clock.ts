import { SubmitCheckInParams } from '@renderer/store/clockReducer/type'
import axios, { ResDataType } from './ajax'
import { SearchOption } from '@renderer/hooks/CheckIn/useCheckInRecord'



type DailyItem = {
  date: string
  totalSeconds: number
}

type WeeklyResponse = {
  dailyTotals: DailyItem[]
  heatmapPoints?: Array<{ date: string; hour: number; value: number }>
  hourlyMatrix?: Record<string, number[]>
}

export async function submitCheckInService(params: SubmitCheckInParams): Promise<ResDataType> {
  const { userId, startTime, endTime, checkInDate, duration } = params

  const url = `/api/checkIn/submit`
  const data = await axios.post(url, {
    userId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    checkInDate: checkInDate.toISOString(),
    duration
  })   
  console.log(data)
  return data
}

export async function getCheckInRecordService(params: SearchOption): Promise<ResDataType> {
  const url = '/api/checkIn/record'
  const data = await axios.get(url, { params })
  return data
}

export async function getCheckInStatService(userId: string): Promise<ResDataType> {
  const url = `/api/checkIn/stat?userId=${userId}`
  const data = (await axios.get(url)) as ResDataType

  return data
}

export async function getUserAllCheckInRecordsService(params: SearchOption): Promise<ResDataType> {
  const url = '/api/checkIn/records'
  const data = await axios.get(url, { params })

  return data
}

export async function getUserRankingService(params: {
  timeRange: string
  grade?: string | undefined
  sortBy: string
}) {
  const url = '/api/ranking'
  const data = axios.get(url, { params })

  return data
}

export async function fetchWeeklyClockData(userId: string): Promise<WeeklyResponse> {
  const url = `/api/checkIn/weekly-heatmap?userId=${userId}`
  const res = await axios.get(url)
  return res.data
}
