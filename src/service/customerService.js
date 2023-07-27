import { apiUrl2 } from "../config.json";

import http from "./httpService";

export const getFeedbacks = () => {
  const apiEndPoint = `${apiUrl2}/feedback`;
  return http.get(apiEndPoint);
};

export const getUserDetails = () => {
  const apiEndPoint = `${apiUrl2}/userDetails`;
  return http.get(apiEndPoint);
};

export const getUserDetailsById=async(params)=>{
  const apiEndPoint = `${apiUrl2}/userDetails?userId=${params}`;
  return http.get(apiEndPoint)
}

export function deleteUserDetails(params) {
  console.log(params)
  return http.delete(`${apiUrl2}/userDetails?${params}`);
}
export function updateUserDetails(data) {
  const apiEndPoint = `${apiUrl2}/userDetails`;
  return http.put(`${apiEndPoint}`, data);
}

export function deleteUserFeedback(params) {
  return http.delete(`${apiUrl2}/feedback?${params}`);
}
