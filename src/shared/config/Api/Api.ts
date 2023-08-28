import axios from 'axios';
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

instance.interceptors.request.use(
  config => {
    // Добавить логику перед отправкой запроса
    return config;
  },
  error => {
    // Обработка ошибок запроса
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    // Обработка ответа
    return response;
  },
  error => {
    // Обработка ошибок ответа
    return Promise.reject(error);
  }
);

export default instance;
