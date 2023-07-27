import { apiUrl2, apiUrl } from "../config.json";

import http from "./httpService";

export const getAllOrders = () => {
  const apiEndPoint = `${apiUrl2}/orders`;
  return http.get(apiEndPoint);
};

export const getOrderbyId = (params) => {
  const apiEndPoint = `${apiUrl2}/orders?orderId=${params}`;
  return http.get(apiEndPoint);
};

export function updateOrders(data) {
  const apiEndPoint = `${apiUrl2}/deliveryDetails`;
  console.log(";;;;;;;;;;;;;;;;;; update order details", data);
  return http.put(`${apiEndPoint}`, data);
}
export const sendSms = (mobileNo, msg) => {
  console.log(mobileNo,msg)
  const apiEndPoint = `https://ttdc.in/hotel-api/sendSms?mobileno=${mobileNo}&msg=${msg}`;
  console.log("API======>>>>>", apiEndPoint);
  return http.get(apiEndPoint);
};

export const placeOrder = (data) => {
  const apiEndPoint = `${apiUrl}/multiOrders`;
  console.log(";;;;;;;;;;;;;;; place order data", data);
  return http.post(`${apiEndPoint}`, data);
};
