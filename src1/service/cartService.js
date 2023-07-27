import http from './httpService';
import { apiUrl } from "../config.json";
import { apiUrl2 } from "../config.json";

// Get banners
export const getCartItems = (userId) => {
  const apiEndPoint = `${apiUrl2}/cart?userId=${userId}`;
  return http.get(apiEndPoint)
}

export const deleteCartItem = (cartId) => {
  console.log(cartId)
  const apiEndPoint = `${apiUrl2}/cart?cartId=${cartId}`;
  return http.delete(apiEndPoint)
}
 
export const getGSTdetails = () => {
  const apiEndPoint = `${apiUrl}/contactDetails`;
  return http.get(apiEndPoint)
}


export const getPincodedetails = () => {
  const apiEndPoint = `${apiUrl}/configuration?configName=pincode`;
  return http.get(apiEndPoint)
}
