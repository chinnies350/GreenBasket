import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get specialoffers
export const getspecialOffer = () => {
  const apiEndPoint = `${apiUrl2}/specialOffer`;
  return http.get(apiEndPoint)
}




