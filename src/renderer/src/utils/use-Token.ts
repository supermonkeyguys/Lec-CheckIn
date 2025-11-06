import { useRequest } from "ahooks"

export function getTokenSync(): string | null {
  const { data } = useRequest(
    async () => {
      const token = await getToken()

      return token
    }
  )

  return data || null
}

export async function getToken(): Promise<string | null> {
  const token = await window.electronAPI!.getToken(getUsername())
  return token.token
}

export async function removeToken(): Promise<void> {
  await window.electronAPI!.removeToken()
  return
}

const USER_NAME = 'username'
const TOKEN = 'token'
export function setUsername(username:string) {
  localStorage.setItem(USER_NAME,username)
}

export function getUsername():string {
  return localStorage.getItem(USER_NAME) as string
}

export function removeUsername() {
  localStorage.removeItem(USER_NAME)
} 

export function setTokenSession(token:string) {
  localStorage.setItem(TOKEN,token)
}

export function getTokenSession() {
  return localStorage.getItem(TOKEN)
}