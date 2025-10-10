import { message } from "antd";
import axios from "axios";
import { getToken } from "../utils/use-Token";
const instance = axios.create({
  baseURL: 'http://localhost:3005/',
  timeout: 10 * 1000,
  headers: {},
});

// request 拦截
instance.interceptors.request.use(
  async (config) => {
    const publicPaths = [
      '/api/user/login',
      '/api/user/register',
    ];

    const isPublic = publicPaths.some(path => config.url?.startsWith(path));
    if (!isPublic) {
      const token = await getToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// response 拦截
instance.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResType;
  const { errno, data, msg } = resData;

  if (errno !== 0) {
    if (msg) {
      message.error(msg);
    }

    throw Promise.reject(new Error(msg || '请求失败'))
  }

  return data as any;
});

export default instance;

export type ResType = {
  errno: number;
  data?: ResDataType;
  msg?: string;
};

export type ResDataType = {
  [key: string]: any;
};
