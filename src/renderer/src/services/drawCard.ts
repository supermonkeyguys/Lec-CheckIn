import axios, { ResDataType } from './ajax'


export async function getAllCard() {
    const url = '/api/draw-card/getAllCard'
    const res = await axios.post(url) as ResDataType

    console.log(res)

    return res
}

export async function saveCard() {
    const url = '/api/draw-card/saveCard'
    const res = await axios.post(url) as ResDataType

    return res
}

export async function drawCard(): Promise<ResDataType> {
    const url = '/api/draw-card/drawCard'
    const res = await axios.post(url) as ResDataType

    return res
}

export async function useCard(username:string, cardName:string) {
    const url = '/api/draw-card/useCard'
    const params = {
        username,
        cardName,
    }
    const res = await axios.post(url,params) as ResDataType 

    return res
}

export async function useSlotMachine(): Promise<ResDataType> {
    const url = '/api/draw-card/useSlotMachine' 
    const res = await axios.post(url) as ResDataType

    return res
}