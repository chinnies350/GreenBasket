import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get specialoffers
export const getspecialOffer = (data) => {
  const apiEndPoint = `${apiUrl2}/specialOffer?merchantId=${data}`;
  return http.get(apiEndPoint)
}




