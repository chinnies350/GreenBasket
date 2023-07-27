import http from './httpService';
import { apiUrl2 } from "../config.json";

// Get banners
export const BannerDetails = () => {
  const apiEndPoint = `${apiUrl2}/banners`;
  return http.get(apiEndPoint)
}

//  Add banners
export function addBanners(data) {
  const apiEndPoint = `${apiUrl2}/banners`;
  return http.post(`${apiEndPoint}`, data);
}

export const getBannersById =(data)=>{
const apiEndPoint = `${apiUrl2}/banners?merchantId=${data}`;
return http.get(apiEndPoint)
}
// edit banners
export function updateBanners(data) {
  const apiEndPoint = `${apiUrl2}/banners`;
  return http.put(`${apiEndPoint}`, data);
}
 

// delete banners
export function deleteBanners(params) {
  console.log(params)
  const apiEndPoint = `${apiUrl2}/banners?merchantId=${params}`;
  return http.delete(apiEndPoint);
}



