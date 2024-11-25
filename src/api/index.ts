import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {}
        return Promise.reject(error);
    }
);


export default apiClient;
