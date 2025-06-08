import axios from 'axios';
// import Cookies from 'js-cookie'; // Menghapus impor ini karena tidak digunakan

const API_BASE_URL = 'https://recipe-130852023885.us-central1.run.app/api'; // Your deployed backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach access token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for refreshing tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If the error is 403 Forbidden (invalid access token) and it's not a refresh token request
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Backend /api/auth/token endpoint akan menggunakan refresh token httpOnly
                // untuk mengeluarkan access token baru.
                const response = await axios.get(`${API_BASE_URL}/auth/token`, {
                    withCredentials: true, // Kirim cookie dengan permintaan
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // Perbarui header permintaan asli dengan token baru
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest); // Coba lagi permintaan asli
            } catch (refreshError) {
                // Jika refresh token gagal (misalnya, expired atau refresh token tidak valid),
                // logout pengguna.
                console.error('Tidak dapat me-refresh token. Logout...', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                // Anda mungkin ingin mengarahkan ke halaman login di sini
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
