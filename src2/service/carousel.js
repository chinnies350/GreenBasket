import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get location
export const getcarousel = () => {
  const apiEndPoint = `${apiUrl2}/banners`;
  return http.get(apiEndPoint)
}




