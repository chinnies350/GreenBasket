import http from './httpService';
import { apiUrl } from "../config.json";
import { getCookieData } from "../components/common/CookiesFunc"

export const getConfigMaster = () => {
    const apiEndPoint = `${apiUrl}/configMaster`;
    console.log(apiEndPoint)
    return http.get(apiEndPoint)
}
export const UserRole = () => {
  const apiEndPoint = `${apiUrl}/configMaster`;
}
  

export const adduserRights = (data) => {
  const apiEndPoint = `${apiUrl}/userRights`;
  console.log(apiEndPoint,data)
  return http.post(`${apiEndPoint}`,data)
}
export const getuserRights = () => {
  const apiEndPoint = `${apiUrl}/userRights`;
  console.log(apiEndPoint)
  return http.get(apiEndPoint)
}
export const getuserRightsEdit = () => {
  let data =  getCookieData("userRole")
  const apiEndPoint = `${apiUrl}/userRights?userRole=${data}`;
  console.log(apiEndPoint,data)
  return http.get(`${apiEndPoint}`)
}