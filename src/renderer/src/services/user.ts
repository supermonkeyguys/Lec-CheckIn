import axios, { ResDataType } from './ajax'
import { SettingState } from '@renderer/store/settingReducer'

type UserProps = {
  username: string
  password: string
  grade?: string
  nickname?: string
}

export async function registerUserService(props: UserProps): Promise<ResDataType> {
  const { username, password, grade, nickname } = props
  const url = '/api/user/register'
  const data = await axios.post(url, { username, password, grade, nickname })
  return data
}

export async function loginUserService(props: UserProps): Promise<ResDataType> {
  const { username, password } = props
  const url = '/api/user/login'
  const data = await axios.post(url, { username, password })
  return data
}

export async function updateUserAvatarService(file: File): Promise<ResDataType> {
  const formData = new FormData()
  formData.append('avatar', file)
  const url = `/api/user/avatar`

  const data = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

export async function getUserInfoService(): Promise<ResDataType> {
  const url = `/api/user/info`
  const data = await axios.get(url)
  return data
}

export async function updateUserInfo(nickname: string): Promise<ResDataType> {
  const url = '/api/user/info'
  const data = (await axios.post(url, { nickname })) as ResDataType

  return data
}

export async function findAllUserService(grade: string): Promise<ResDataType> {
  const url = `/api/user/members?grade=${grade}`
  const data = await axios.get(url)

  return data
}

export async function updateUserSetting(settings: SettingState): Promise<ResDataType> {
  const url = `/api/user/setting`
  const data = await axios.post(url, settings)
  return data
}

export async function getUserSetting():Promise<ResDataType> {
  const url = '/api/user/setting'
  const data = await axios.get(url)
  return data
}

export async function getCurrentCheckInState(): Promise<ResDataType> {
  const url = '/api/user/checkInState'
  const data = await axios.get(url) as ResDataType

  return data
} 