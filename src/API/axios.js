import axios from "axios";

export default axios.create({
  baseURL: "https://d39z33-4000.csb.app"
});
export const axiosPrivate = axios.create({
  baseURL: "https://d39z33-4000.csb.app",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
