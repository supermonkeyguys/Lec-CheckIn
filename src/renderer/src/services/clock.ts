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
  const { startTime, endTime, checkInDate, duration } = params

  const url = `/api/checkIn/submit`
  const data = await axios.post(url, {
    startTime: startTime,
    endTime: endTime,
    checkInDate: checkInDate,
    duration
  })

  return data
}

export async function getCheckInRecordService(params: SearchOption): Promise<ResDataType> {
  const url = '/api/checkIn/record'
  const data = await axios.get(url, { params })
  return data
}

export async function getCheckInStatService(): Promise<ResDataType> {
  const url = `/api/checkIn/stat`
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
  const url = `/api/ranking`
  const data = axios.get(url, { params })

  return data
}

export async function fetchWeeklyClockData(): Promise<WeeklyResponse> {
  const url = `/api/checkIn/weekly-heatmap`
  const res = (await axios.get(url)) as WeeklyResponse
  return res
}
