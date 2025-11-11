import axios from 'axios'
import { ipcMain } from 'electron'

const OFFICE_COORD = { lat: 30.6667, lng: 104.0667 }  // 104.1837681105103,30.82943119137996
const ALLOWED_RADIUS_METERS = 300

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function checkLocationFromPublicIP(): Promise<{ success: boolean; distance?: number; ip?: string }> {
  try {
    const ipRes = await axios.get('https://ipapi.co/json/', { timeout: 2000 })
    const publicIP = ipRes.data.ip

    const geoRes = await axios.get(`https://ipapi.co/${publicIP}/json/`, { timeout: 2000 })
    const { latitude, longitude } = geoRes.data

    if (!latitude || !longitude) {
      return { success: false }
    }

    const distance = getDistance(OFFICE_COORD.lat, OFFICE_COORD.lng, latitude, longitude)
    const success = distance <= ALLOWED_RADIUS_METERS

    return { success, distance, ip: publicIP }
  } catch (err) {
    console.error('地理位置验证失败:', err)
    return { success: false }
  }
}

export const registerVerifyIPHandler = () => {
  ipcMain.handle('check-target-network', async () => {
    const locationCheck = await checkLocationFromPublicIP()

    console.log("locationCheck: ", locationCheck)

    const isAllow = locationCheck.success

    return isAllow
  })
}
