import { apiUrlConstants } from "../Utils/ApiConstants"
import { ApiGet } from "../Utils/ApiRequests"

export const getAllCustomers = async () => {
    return ApiGet({ url: apiUrlConstants.getCustomers }).then((res) => {
        if (res.status === 200) {
            Promise.resolve(res.data)
        }else {
            Promise.reject(res)
        }
        
    }).catch(err => {
        Promise.reject(err)
    })
}

