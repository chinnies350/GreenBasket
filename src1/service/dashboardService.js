import http from './httpService';
import { apiUrl2 } from "../config.json";

export const getCategoryList = () => {
    const apiEndPoint = `${apiUrl2}/listCategories`;
    return http.get(apiEndPoint);
}

export const getCategorybyId = (params) => {    
    const apiEndPoint = `${apiUrl2}/ategories?${params}`;
    return http.get(apiEndPoint);
}

export const getToptenValues = () => {
  const apiEndPoint = `${apiUrl2}/topTen`;
  return http.get(apiEndPoint)
}

export const getDeliveryDetails = () => {
  const apiEndPoint = `${apiUrl2}/deliverycount`;
  return http.get(apiEndPoint)
}


export const getProductsbyId = (params) => {  
  console.log(params)  
  const apiEndPoint = `${apiUrl2}/products?categoryId=${params}`;
  return http.get(apiEndPoint);
}

