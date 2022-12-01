import axios from "axios";


//const BASE_URL = "http://192.168.137.1:5000/api/"; Redmi Phone
const BASE_URL = "http://localhost:5000/api/";

  const user = JSON.parse(localStorage.getItem("persist:root"))?.auth;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.acessToken;

  

export const publicRequest = axios.create({
    baseURL: BASE_URL,
  });
  
  
export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: { token: `Bearer ${TOKEN}` },
  });