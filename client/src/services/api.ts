import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { url } from "inspector";
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
const VITE_TOKEN_API_URL =import.meta.env.VITE_TOKEN_API_URL
// Create a base axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token, etc.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
//Response with Refresh logic
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];
//create a que...
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
//Response logic............

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const data = error.response?.data as { message?: string; error?: string };
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh-token")
      // !originalRequest.url?.includes('/api/auth/logout')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          VITE_TOKEN_API_URL,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.accessToken;

        localStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Force logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (
      status === 403 &&
      (data.message == "User is blocked" ||
        data.message == "User is removed") &&
      error.config.url !== "auth/user/login"
    ) {
      console.log(error, "api error");
      console.log(error.config.url, "url");

      window.location.href = "/login";

      //   window.location.href = '/login';
    } else if (status === 404) {
      console.warn("404 Not Found:", error.config?.url);
    } else if (status && status >= 500) {
      console.error("Server Error:", status);
    } else if (!error.response) {
      console.error("Network error:", error.request);
    }

    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(config,"axios config")
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for handling errors globally
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },

//   (error) => {
//      const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;}
//       console.log(originalRequest,"response err intercep")

//     const data = error.response?.data as { message?: string; error?: string };
//     if (error.response) {
//       const { status } = error.response;
//     console.log(originalRequest,"orih=ginal request")
//       if (status === 401&&originalRequest && !originalRequest._retry) {
//         localStorage.removeItem('accessToken');
//         originalRequest._retry = true;
//         if (
//         originalRequest.url?.includes('/api/auth/refresh-token') ||
//         originalRequest.url?.includes('/api/auth/logout')
//       ){     console.error('401 error on auth endpoint:', data?.message);

//         return Promise.reject({ message: data?.message, status });}
//         // Redirect to login or show notification
//       } else if (status === 403&& data?.error === 'ForbiddenError' &&
//       data?.message === 'User is blocked') {
//         window.location.href = '/login';
//       } else if (status === 404) {
//         // Handle not found
//       } else if (status >= 500) {
//         // Handle server errors
//       }
//     } else if (error.request) {
//       console.error('Network error:', error.request);
//     } else {
//       console.error('Error:', error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// API Service methods with TypeScript typing
const apiService = {
  get: <T = any>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, { params, ...config });
  },

  post: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
};

export default apiService;
