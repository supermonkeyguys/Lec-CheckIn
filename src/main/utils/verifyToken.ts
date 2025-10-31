import axios from 'axios'

const devUrl = 'localhost'
const proUrl = '43.138.244.158'

const baseUrl = `http://${devUrl}:8080`

export async function verifyToken(token:string): Promise<any>  {
    try {
        const url = baseUrl + '/api/auth/verify'
        const res = await axios.get(url,{
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.data
    } catch (err) {
        console.log(err)
       
        throw new Error('Token 已过期')
    }
}