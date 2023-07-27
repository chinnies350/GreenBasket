import jwtDecode from "jwt-decode";
import http from "./httpService";
import Cookies from 'universal-cookie';
import { apiUrl2, apiUrl,staticToken } from "../config.json";

const cookies = new Cookies();
const tokenKey = "token";


http.setJwt(staticToken);


export function loginWithJwt(jwt) {
  cookies.set(tokenKey, jwt, { path: '/' });
}

export async function logout() {
 await cookies.remove('__info', { path: '/' });
 await cookies.remove("__cartAmount", { path: '/' });
 await cookies.remove(tokenKey, { path: '/' });
}

export function getCurrentUser() {
  try {
    const jwt = cookies.get(tokenKey);
    jwtDecode(jwt)
    return true;
  } catch (ex) {
    return false;
  }
}

export const storeData = (key, value) => {
  cookies.set(key, value, { path: '/' });
}

export function getJwt(key) {
  return cookies.get(key);
}


export const signUp = (data) => {
  console.log(data)
  const apiEndPoint = `${apiUrl2}/registration`;
  return http.post(apiEndPoint, data)
}

export const login = (data) => {
  console.log(data)
  const apiEndPoint = `${apiUrl2}/login`;
  return http.post(apiEndPoint, data)
}

// send OTP
export const sendOtp = (params) => {
  const apiEndPoint = `${apiUrl}/otp?${params}`;
  return http.get(apiEndPoint)

}

// forgot password 
export const forgotPassword = (data) => {
  const apiEndPoint = `${apiUrl}/forgotPassword`;
  return http.post(apiEndPoint, data)
}


export const checkUser = (data) => {
  const apiEndPoint = `${apiUrl}/checkusers?emailId=${data}`;
  return http.get(apiEndPoint)
}

export default {
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
