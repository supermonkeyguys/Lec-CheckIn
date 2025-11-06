import axios, { ResDataType } from './ajax'

export async function getBalance() {
  const url = '/api/points/getBalance'
  const res = await axios.post(url)

  return res
}

export async function costPoints(price: number) {
  const url = '/api/points/costPoints'
  const res = (await axios.post(url, { cost: price })) as ResDataType

  return res
}
