import axios from 'axios';


export const rootAddress = 'https://server-gnnsie.fibo.cloud/';


const request = axios.create({
    baseURL: rootAddress,
});


request.interceptors.request.use(request => {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`
    }
    return request
})


export { request }
