import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * ตั้งค่า base URL จาก environment variables
 * ต้องตั้งค่า VITE_API_URL ในไฟล์ .env
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("API Base URL:", API_BASE_URL);

/**
 * สร้าง axios instance สำหรับเรียกใช้ API
 * กำหนดค่าเริ่มต้นสำหรับการเชื่อมต่อ API
 * เปิดใช้งาน withCredentials เพื่อส่ง HttpOnly cookies
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // เปิดใช้งานเพื่อส่ง cookies ใน request
});

/**
 * Interceptor สำหรับ request - ไม่ต้องเพิ่ม Authorization header แล้ว
 * เนื่องจากใช้ HttpOnly cookies ซึ่งจะถูกส่งอัตโนมัติ
 */
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // HttpOnly cookies จะถูกส่งอัตโนมัติด้วย withCredentials: true
    // ไม่ต้องจัดการ Authorization header เอง
    
    if (!config) {
      throw new Error("AxiosRequestConfig is undefined");
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor สำหรับ response - จัดการ error และ unauthorized access
 * ตรวจสอบ response และจัดการกรณี 401 Unauthorized
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (!response) {
      throw new Error("AxiosResponse is undefined");
    }
    return response;
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // ไม่ต้องลบข้อมูลจาก localStorage แล้ว เพราะใช้ HttpOnly cookies
        // HttpOnly cookies จะถูกลบโดย server เมื่อ logout
        console.error("Unauthorized access - Token expired or invalid.");
        
        // สามารถเพิ่มการ redirect ไปหน้า login ได้ที่นี่
        // window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

export { api }; 