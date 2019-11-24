import axios from 'axios';

export const TOKEN_KEY = 'kanban_token';

// The client dev server proxies /api to the Express server (see package.json).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
});

// Attach the JWT to every request when we have one.
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
});

/**
 * Pull a readable message out of an axios error.
 */
export function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  return 'Something went wrong. Please try again.';
}

export default api;
