import http from './httpService';
import { apiUrl } from "../config.json";

// Get location
export const getLocation = () => {
  const apiEndPoint = `${apiUrl}/configuration?configName=pincode`;

  return http.get(apiEndPoint).catch(err=>{
    console.log(err)
  })

}
export const getPinLoc = () => {
  const apiEndPoint = `https://api.postalpincode.in/pincode/635109}`;

  return http.get(apiEndPoint)
  

}




