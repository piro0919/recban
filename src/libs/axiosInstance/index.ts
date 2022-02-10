import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL && typeof window !== "undefined") {
  baseURL = window.location.origin;
}

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
