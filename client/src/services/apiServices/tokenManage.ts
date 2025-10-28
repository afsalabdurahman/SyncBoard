// src/api/tokenManager.ts
import axios, { AxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const handleTokenRefresh = async (
  error: any,
  originalRequest: AxiosRequestConfig & { _retry?: boolean },
  tokenUrl: string
) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(axios(originalRequest));
        },
        reject,
      });
    });
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const refreshResponse = await axios.post(
      tokenUrl,
      { refreshToken },
      { withCredentials: true }
    );
    const newToken = refreshResponse.data?.accessToken;

    localStorage.setItem("accessToken", newToken);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    processQueue(null, newToken);

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
    }
    return axios(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};
