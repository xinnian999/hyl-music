import axios from "axios";

const request: any = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true,
});

request.interceptors.request.use((config: any) => {
  config.xsrfHeaderName = "X-CSRF-TOKEN";
  config.xsrfCookieName = "csrf_token";

  return config;
});

// 响应拦截器
request.interceptors.response.use((res: any) => {
  return res?.data;
});

export default request;
