import axios from "axios";

export default axios.create({
  baseURL: "https://gym-managment-backend.onrender.com"
});
export const axiosPrivate = axios.create({
  baseURL: "https://gym-managment-backend.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
