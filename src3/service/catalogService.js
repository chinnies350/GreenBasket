import http from "./httpService";
// import { apiUrl } from "../config.json";
import { apiUrl2 } from "../config.json";

//Offers
export const getOfferList = () => {
  console.log("data")
  const apiEndPoint = `${apiUrl2}/specialOffer`;
  return http.get(apiEndPoint);
};

export const getOfferListById = (params) =>{
  const apiEndPoint = `${apiUrl2}/specialOffer?merchantId=${params}`;
  return http.get(apiEndPoint);
}
export function addOffers(data) {
  const apiEndPoint = `${apiUrl2}/specialOffer`;
  return http.post(`${apiEndPoint}`, data);
}

export function updateOffers(data) {
  const apiEndPoint = `${apiUrl2}/specialOffer`;
  console.log(";;;;;;;;;;;;;;; delete offers", data);

  return http.put(`${apiEndPoint}`, data);
}

export function deleteOffers(params) {
  const apiEndPoint = `${apiUrl2}/specialOffer?offerId=${params}`;
  console.log(";;;;;;;;;;;;;;; delete offers", params);
  return http.delete(`${apiEndPoint}`);
}

// export const deleteOffers = (data) => {
//   const apiEndPoint = `${apiUrl}/specialOffer?${data}`;
//   return http.get(apiEndPoint);
// }

//Category
export function addCategory(data) {
  const apiEndPoint = `${apiUrl2}/categories`;
  console.log(";;;;;;;;;;;;;;;;;;", data);
  return http.post(`${apiEndPoint}`, data);
}

export const getCategories = () => {
  const apiEndPoint = `${apiUrl2}/categories`;
  console.log(apiEndPoint);
  return http.get(apiEndPoint);
};

export const getCategoriesById = (params) => {
  const apiEndPoint = `${apiUrl2}/categories?merchantId=${params}`;
  console.log(apiEndPoint);
  return http.get(apiEndPoint);
};

export const getcategoryByStatus = () => {
  const apiEndPoint = `${apiUrl2}/categoryByStatus?categoryStatus=A`;
  return http.get(apiEndPoint);
};

export function updateCategory(data) {
  const apiEndPoint = `${apiUrl2}/categories`;
  console.log(";;;;;;;;;;;;;;;;;;", data);

  return http.put(`${apiEndPoint}`, data);
}

export function deleteCategory(params) {
  const apiEndPoint = `${apiUrl2}/categories`;
  return http.delete(`${apiEndPoint}?${params}`);
}

//Products
export function addProduct(data) {
  const apiEndPoint = `${apiUrl2}/products`;
  return http.post(`${apiEndPoint}`, data);
}
export const getAllProductsById = async (params) => {
  const apiEndPoint = `${apiUrl2}/products?merchantId=${params}`;
  return http.get(apiEndPoint);
};
export const getAllProducts = () => {
  const apiEndPoint = `${apiUrl2}/products`;
  return http.get(apiEndPoint);
};

export function updateProduct(data) {
  console.log(data)
  const apiEndPoint = `${apiUrl2}/products`;
  return http.put(`${apiEndPoint}`, data);
  
}

export function deleteProduct(params) {
  const apiEndPoint = `${apiUrl2}/products`;
  return http.delete(`${apiEndPoint}?${params}`);
}

export const getUoM = () => {
  const apiEndPoint = `${apiUrl2}/configuration?configName=uom`;
  return http.get(apiEndPoint);
};

export const getSubCategory = () => {
  const apiEndPoint = `${apiUrl2}/subCategories`;
  return http.get(apiEndPoint);
};

// Search Products

export const searchProduct = (term) => {
  const apiEndPoint = `${apiUrl2}/searchItem?searchItem=${term}`;
  return http.post(apiEndPoint);
};
