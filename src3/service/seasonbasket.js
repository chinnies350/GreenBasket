import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get specialoffers
export const getseasonbasket = () => {
  const apiEndPoint = `${apiUrl2}/products`;
  return http.get(apiEndPoint)
}




