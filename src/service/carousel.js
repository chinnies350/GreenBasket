import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get location
export const getcarousel = (data) => {
  const apiEndPoint = `${apiUrl2}/banners?merchantId=${data}`;
  return http.get(apiEndPoint)
}




