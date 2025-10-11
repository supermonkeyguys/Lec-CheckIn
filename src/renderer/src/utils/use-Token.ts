import { jwtDecode } from 'jwt-decode'

export async function setToken(token:string): Promise<boolean>  { 
  const o = await window.electronAPI!.setToken(token)
  if(o)return true
  else return false
}

export async function getToken(): Promise<string | null> {
  const token = await window.electronAPI!.getToken()
  return token
}

export async function removeToken(): Promise<void> {
  await window.electronAPI!.removeToken()
  return
}

export async function getUserId() {
  const token = await getToken()
  if (typeof token !== 'string') return null
  const payload = jwtDecode(token)
  return payload.sub
}
