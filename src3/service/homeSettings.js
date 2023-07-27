import http from './httpService';
import { apiUrl } from "../config.json";

export const getHomeConfig = () => {
  const apiEndPoint = `${apiUrl}/features`;
  return http.get(apiEndPoint);
}

export const insertHomeConfig = (data) => {
  const apiEndPoint = `${apiUrl}/features`;
  return http.post(apiEndPoint, data);
}

export const updateHomeConfig = (data) => {
  const apiEndPoint = `${apiUrl}/features`;
  return http.put(apiEndPoint, data);
}

export const deleteHomeConfig = (params) => {
  const apiEndPoint = `${apiUrl}/features?${params}`;
  return http.delete(apiEndPoint);
}

