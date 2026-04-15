import axios, { AxiosRequestConfig } from 'axios';
import { envWeb } from '@/config/env-web';

export const axiosInstance = axios.create({
    baseURL: envWeb.VITE_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.request<T>(config).then(({ data }) => data);
};
