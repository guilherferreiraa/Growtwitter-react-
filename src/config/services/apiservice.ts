import axios from 'axios';

const api = axios.create({
  baseURL: 'https://growtweeter.vercel.app',
});

export default api;