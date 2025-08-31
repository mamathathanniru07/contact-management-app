import axios from 'axios'
import { apiMethods, baseUrl } from './ApiConstants';


const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

async function ApiRequest({ url, method, data, params }) {
    return axiosInstance({
        url: url,
        method: method,
        data: data,
        params: params,
    })
}

export async function ApiGet({ url, params }) {
    return ApiRequest({
        url,
        method: apiMethods.get,
        params
    })
}

export async function ApiPost({ url, data }) {
    return ApiRequest({
        url,
        method: apiMethods.post,
        data
    })
}

export async function ApiDelete({url, data}) {
    return ApiRequest({
        url,
        method: apiMethods.delete,
        data
    })
}

export async function ApiPut({url, data}) {
    return ApiRequest({
        url,
        method: apiMethods.put,
        data
    })
}