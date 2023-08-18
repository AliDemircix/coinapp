import { API_URI } from "../utils/apiurl";



export type CoinList = {
    id?: number,
    name: string,
    amount: number,
    price: number
 }

export async function getCoins(): Promise<Array<CoinList>> {
    const response = await fetch(`${API_URI}/coins`);
    return await response.json()
}
export async function addCoin(coin: CoinList): Promise<CoinList> {
    const response = await fetch(`${API_URI}/coins`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(coin)
    });
    return await response.json()
}
export async function deleteCoin(coinId: number): Promise<{message:string}> {
    const response = await fetch(`${API_URI}/coins/${coinId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return await response.json()
}
export async function updateCoin(coinId: number,coin: CoinList): Promise<CoinList> {
    const response = await fetch(`${API_URI}/coins/${coinId}/update`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(coin)
    });
    return await response.json()
}