import Cookies from "universal-cookie";
const cookies = new Cookies();
// export const localstore = () => {
//   localStorage.setItem("CREATEDBY", 1);
//   localStorage.setItem("UPDATEDBY", 2);
//   localStorage.setItem("HOTELID", 15);
// };

export const getLocalStorageValues = (key) => {
  return localStorage.getItem(key);
};



// export const localstore = () => {
//   localStorage.setItem("CREATEDBY", 1);
//   localStorage.setItem("UPDATEDBY", 2);
// };

// export const getLocalStorageValues = (key) => {
//   return localStorage.getItem(key);
// };

// Store single Cookie Values

export const storeCookieData = (key, value) => {
  console.log("cookie setting ", value);
  if (value) cookies.set(key, value, { path: "/" });
};

// Get Single Cookie Data

export function getCookieData(key) {
  return cookies.get(key);
} 

// Remove Single Cookie Data

export function removeCookieData(key) {
  return cookies.remove(key, { path: "/" });
}

//  Removing all Cookie Data

export async function ClearCookie() {
  const allCookie = cookies.getAll();
  if (allCookie) {
    for (let key in allCookie) {
      await cookies.remove(key, { path: "/" });
    } 
  }
}

