import http from './httpService';
import { apiUrl2 } from "../config.json";




export function addFeedback(data) {
  const apiEndPoint = `${apiUrl2}/feedback`;
  return http.post(`${apiEndPoint}`, data);
}




