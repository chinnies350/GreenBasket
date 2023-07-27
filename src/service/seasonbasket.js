import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get specialoffers
export const getseasonbasket = (data) => {
  const apiEndPoint = `${apiUrl2}/products?merchantId=${data}`;
  return http.get(apiEndPoint)
}




