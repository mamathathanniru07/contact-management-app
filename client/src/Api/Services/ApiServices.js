import { apiUrlConstants } from "../Utils/ApiConstants";
import { ApiGet, ApiPost } from "../Utils/ApiRequests";

export const getAllCustomers = async () => {
  return ApiGet({ url: apiUrlConstants.getCustomers })
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const saveCustomer = async (data) => {
  return ApiPost({ url: apiUrlConstants.saveCustomer, data })
    .then((res) => {
      if (res.status === 201) {
        console.log(res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
