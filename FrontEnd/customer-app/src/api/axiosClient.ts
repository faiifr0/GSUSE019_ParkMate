import axios from 'axios';
import { store } from '../redux/store';

const axiosClient = axios.create({
    baseURL: 'https://your-api-url.com/api', // Thay bằng API thật của bạn
    timeout: 10000,
});

axiosClient.interceptors.request.use(async (config) => {
    const token = store.getState().user.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
