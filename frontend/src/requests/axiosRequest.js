import axios from 'axios';


export const rootAddress = 'http://83.229.84.71:80/';


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
