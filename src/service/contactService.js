import http from './httpService';
import { apiUrl2 } from "../config.json";

export function addContactDetails(data) {
  const apiEndPoint = `${apiUrl2}/merchantDetails`;
  return http.post(`${apiEndPoint}`, data);
}


export const getContactList2 = (params) => {
  console.log(params)
  const apiEndPoint = `${apiUrl2}/merchantDetails?merchantId=${params}`;
  return http.get(apiEndPoint)
}

export const getContactList = () => {
  const apiEndPoint = `${apiUrl2}/merchantDetails`;
  console.log(apiEndPoint)
  return http.get(apiEndPoint)
}

export const getActiveMerchants = () =>{
  let par="A";
 const apiEndPoint = `${apiUrl2}/merchantDetails?status=A`;
 console.log(apiEndPoint)
 return http.get(apiEndPoint)
}


export function updateContactDetails(data) {
  const apiEndPoint = `${apiUrl2}/merchantDetails`;
  console.log(data)
  return http.put(`${apiEndPoint}`, data);

}

export function deleteBuffetData(params) {
  const apiEndPoint = `${apiUrl2}/merchantDetails`;
  return http.delete(`${apiEndPoint}`,{params});
}


