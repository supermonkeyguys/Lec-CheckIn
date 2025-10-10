import axios, { ResDataType } from './ajax'
import { getUserId } from '../utils/use-Token'

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
  const userId = await getUserId()
  const formData = new FormData()
  formData.append('avatar', file)

  const url = `/api/user/avatar?userId=${userId}`

  const data = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

export async function getUserInfoService(userId: string): Promise<ResDataType> {
  const url = `/api/user/info?userId=${userId}`
  const data = await axios.get(url)
  return data
}

export async function updateUserInfo(userId:string,nickname: string): Promise<ResDataType> {
  const url = '/api/user/info'
  const data = (await axios.post(url, { userId, nickname })) as ResDataType

  return data
}

export async function findAllUserService(grade: string): Promise<ResDataType> {
  const url = `/api/ranking/daily?grade=${grade}`
  const data = await axios.get(url)

  return data
}
