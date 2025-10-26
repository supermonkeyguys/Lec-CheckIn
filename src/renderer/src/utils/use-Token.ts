// export async function setToken(payload: {
//   token: string
//   username: string
//   remember: boolean
// }): Promise<boolean> {
//   const o = await window.electronAPI!.setToken(payload)
//   if (o) return true
//   else return false
// }

export async function getToken(): Promise<string | null> {
  const token = await window.electronAPI!.getToken(getUsername())
  return token.token
}

export async function removeToken(): Promise<void> {
  await window.electronAPI!.removeToken()
  return
}

const USER_NAME = 'username'
export function setUsername(username:string) {
  localStorage.setItem(USER_NAME,username)
}

export function getUsername():string {
  return localStorage.getItem(USER_NAME) as string
}

export function removeUsername() {
  localStorage.removeItem(USER_NAME)
} 