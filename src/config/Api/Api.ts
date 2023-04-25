import axios from "axios";
const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, max-age=3600',
        'Expires': new Date(Date.now() + 3600 * 1000).toUTCString()
    },

});

instance.interceptors.request.use(
    (config) => {
        // Добавить логику перед отправкой запроса
        return config;
    },
    (error) => {
        // Обработка ошибок запроса
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Обработка ответа
        return response;
    },
    (error) => {
        // Обработка ошибок ответа
        return Promise.reject(error);
    }
);

export default instance;