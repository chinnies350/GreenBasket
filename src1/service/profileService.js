import { apiUrl } from "../config.json";
import { apiUrl2 } from "../config.json";
import http from './httpService';

// change password
export function editPassword(data) {
  const apiEndPoint = `${apiUrl}/changePassword`;
  return http.post(`${apiEndPoint}`, data);
}



 
// view profile
export const getProfileDetails = (params) => {
  const apiEndPoint = `${apiUrl}/particularUser?${params}`;  
  return http.get(apiEndPoint)
}

// edit profile
export function updateProfileDetails(data) {
  const apiEndPoint = `${apiUrl}/userDetails`;
  console.log(";;;;;;;;;;;;;;;; update profile details", data)
  return http.put(`${apiEndPoint}`, data);
}

// view wishlist
export const getWishList = (params) => {
  const apiEndPoint = `${apiUrl2}/wishlist?${params}`;  
  return http.get(apiEndPoint)
} 

// delete wishlist

export const removeWishList = (params) => {
  const apiEndPoint = `${apiUrl2}/wishlist?${params}`;  
 
  return http.delete(apiEndPoint)
} 

//  Add Cart
export function addtoCart(data) {
  console.log(data)
  const apiEndPoint = `${apiUrl2}/cart`;
  return http.post(`${apiEndPoint}`, data);
}


//  Add Wishlist
export function addtoWishlist(data) {
  const apiEndPoint = `${apiUrl2}/wishlist`;
  return http.post(`${apiEndPoint}`, data);
}
