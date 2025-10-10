import { app } from 'electron'
import path from 'path'
import { promises as fs } from 'fs'

interface TokenData {
  token?: string
  updatedAt?: string
}

const userDataPath = app.getPath('userData')
const tokenFilePath = path.join(userDataPath, 'auth.json')

export async function initTokenFile(): Promise<void> {
  try {
    await fs.access(tokenFilePath)
  } catch {
    await fs.writeFile(tokenFilePath, JSON.stringify({} as TokenData), 'utf8')
  }
}

export async function setToken(token: string): Promise<void> {
  await initTokenFile()

  const tokenData: TokenData = {
    token: token,
    updatedAt: new Date().toString()
  }

  await fs.writeFile(tokenFilePath, JSON.stringify(tokenData), 'utf-8')
}

export async function getToken():Promise<string | null> {
    await initTokenFile()
    const fileContent = await fs.readFile(tokenFilePath,'utf-8')
    const tokenData: TokenData = JSON.parse(fileContent)
    return tokenData.token || null
}

export async function removeToken(): Promise<void> {
    await initTokenFile();
    await fs.writeFile(tokenFilePath,JSON.stringify({} as TokenData),'utf-8')
}
