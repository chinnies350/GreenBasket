import { apiUrl2 } from "../config.json";
import http from "./httpService";

export const getPaymentDetailsById = async (params) => {
  console.log(params);
  const apiEndPoint = `${apiUrl2}/paymentDetails?merchantId=${params}`;
  return http.get(apiEndPoint);
};

export const getPaymentDetails = async () => {
  const apiEndPoint = `${apiUrl2}/paymentDetails`;
  return http.get(apiEndPoint);
};

export const addPaymentDetails = async (params) => {
  console.log(params);
  const apiEndPoint = `${apiUrl2}/paymentDetails`;
  return http.post(apiEndPoint,params);
};

export const updatePaymentDetails = async (params) => {
  console.log(params);
  const apiEndPoint = `${apiUrl2}/paymentDetails`;
  return http.put(apiEndPoint,params);
};

export const deltePaymentDetails = async (params) => {
  console.log(params);
  const apiEndPoint = `${apiUrl2}/paymentDetails`;
  return http.delete(apiEndPoint, params);
};
