import axios from "axios";

let baseURL = "";

if (typeof window !== "undefined") {
  baseURL = window.location.origin;
}

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
