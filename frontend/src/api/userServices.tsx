import { API_URI } from "../utils/apiurl";

export async function addUser(user:any){
    const response = await fetch(`${API_URI}/signup`, {
        method: 'POST',
        body: user
    });
    return await response.json()
}

export async function loginUser(user:any){
    const response = await fetch(`${API_URI}/login`, {
        method: 'POST',
        body: user
    });
    return await response.json()
}

export async function checkAuth() {
    const response = await fetch(`${API_URI}/user_info`)
    return await response.json()
}