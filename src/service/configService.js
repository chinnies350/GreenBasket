import { apiUrl2 } from "../config.json";

import http from './httpService';



export function getConfig() {
  const apiEndPoint = `${apiUrl2}/configuration`;
  return http.get(`${apiEndPoint}`);
}

export function getConfigName(data) {
  const apiEndPoint = `${apiUrl2}/configuration?configName=charge limit&merchantId=${data}`;
  return http.get(`${apiEndPoint}`); 
}

export function getDeliverHour(data) {
  const apiEndPoint = `${apiUrl2}/configuration?configName=delivery hour&merchantId=${data}`;
  return http.get(`${apiEndPoint}`); 
}
export function getSignInImage(data) {
  const apiEndPoint = `${apiUrl2}/configuration?configName=SignInImage&merchantId=${data}`;
  return http.get(`${apiEndPoint}`); 
}

export function putConfig(data) {
  const apiEndPoint = `${apiUrl2}/configuration`;
  return http.put(`${apiEndPoint}`, data);
}

export function postConfig(data) {
  const apiEndPoint = `${apiUrl2}/configuration`;
  return http.post(`${apiEndPoint}`, data);
}

