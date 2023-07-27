import http from './httpService';
import { apiUrl2 } from "../config.json";

export const getHomeConfig = (data) => {
  console.log(data)
  const apiEndPoint = `${apiUrl2}/features?merchantId=${data}`;
  return http.get(apiEndPoint);
}

export const insertHomeConfig = (data) => {
  const apiEndPoint = `${apiUrl2}/features`;
  return http.post(apiEndPoint, data);
}

export const updateHomeConfig = (data) => {
  const apiEndPoint = `${apiUrl2}/features`;
  return http.put(apiEndPoint, data);
}

export const deleteHomeConfig = (params) => {
  const apiEndPoint = `${apiUrl2}/features?${params}`;
  return http.delete(apiEndPoint);
}

