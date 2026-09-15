import axios from 'axios';

export const BASE_URL = 'https://route-posts.routemisr.com';

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeErrors = (errors) => {
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors.flatMap((item) => {
      if (Array.isArray(item)) return item;
      if (typeof item === 'string') return [item];
      return [String(item)];
    });
  }

  if (typeof errors === 'string') return [errors];

  if (typeof errors === 'object') {
    return Object.values(errors).flatMap((value) => {
      if (Array.isArray(value)) return value.flatMap((item) => (typeof item === 'string' ? [item] : [String(item)]));
      if (typeof value === 'string') return [value];
      return [String(value)];
    });
  }

  return [String(errors)];
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    const errors = normalizeErrors(error.response?.data?.errors);
    return Promise.reject({ message, errors, status: error.response?.status });
  }
);

export default axiosClient;
