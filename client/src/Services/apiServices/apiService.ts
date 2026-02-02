// src/api/apiService.ts
import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  
} from "axios";
import { handleApiError } from "./apiErrorHandle";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});



axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh logic
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      toast.error("Session expaired")
  
    }

    // Handle other known errors
    handleApiError(error);
    return Promise.reject(error);
  }
);

// ✅ Generic service methods
const apiService = {
  get: <T = any>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => axiosInstance.get<T>(url, { params, ...config }),

  post: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data, config),

  put: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data, config),

  patch: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => axiosInstance.patch<T>(url, data, config),

  delete: <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url, config),
};

export default apiService;
