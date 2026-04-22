// src/api/apiService.ts
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { handleApiError } from "./apiErrorHandle"; 
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type QueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

   
    if (error.response?.status === 401 && !originalRequest?._retry) {

      if (originalRequest?.url?.includes("/auth/refresh-token")) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshAxios.post("/auth/refresh-token");

        if (refreshResponse.status === 404 || refreshResponse.status >= 400) {
          throw new Error("Refresh token invalid or missing");
        }

    
        processQueue();
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError: unknown) {
       
        processQueue(refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

   
    handleApiError(error);
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  
  Navigate("/login")
};




const apiService = {
  get: <T = unknown>(url: string, params = {}, config: AxiosRequestConfig = {}) =>
    axiosInstance.get<T>(url, { params, ...config }),

  post: <T = unknown>(url: string, data = {}, config: AxiosRequestConfig = {}) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = unknown>(url: string, data = {}, config: AxiosRequestConfig = {}) =>
    axiosInstance.put<T>(url, data, config),

  patch: <T = unknown>(url: string, data = {}, config: AxiosRequestConfig = {}) =>
    axiosInstance.patch<T>(url, data, config),

  delete: <T = unknown>(url: string, config: AxiosRequestConfig = {}) =>
    axiosInstance.delete<T>(url, config),
};

export default apiService;