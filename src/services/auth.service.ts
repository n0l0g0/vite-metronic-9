import { api } from "@/services/api";
import { AuthResponse, LoginCredentials, ApiUser, DuoAuthData } from "@/types/auth.types";

/**
 * Auth API endpoint base URL
 * กำหนด base URL สำหรับ API endpoints ที่เกี่ยวข้องกับการ authentication
 */
const authUrl = "/api/auth";

/**
 * ฟังก์ชันสำหรับเริ่มต้น SAML/SSO authentication
 * เปลี่ยนเส้นทางไปยัง backend เพื่อเริ่มกระบวนการ SAML
 */
export const initiateSamlLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  window.location.href = `${apiUrl}${authUrl}/saml`;
};

/**
 * ฟังก์ชันสำหรับตรวจสอบ token ที่ได้จาก SAML/SSO callback
 * ใช้ endpoint /api/auth/me เพื่อตรวจสอบความถูกต้องของ token และดึงข้อมูลผู้ใช้
 * ใช้ HttpOnly cookies แทนการส่ง token ใน header
 * @returns Promise ที่ resolve เป็นข้อมูลผู้ใช้
 */
export const validateTokenAndGetUser = () =>
  api.get<{ user: ApiUser }>(`${authUrl}/me`);

/**
 * ฟังก์ชันสำหรับการล็อกอินด้วย username และ password (ปิดใช้งาน)
 * @param data - ข้อมูลการเข้าสู่ระบบ (username, password)
 * @returns Promise ที่ resolve เป็น AuthResponse
 */
export const postAuthLogin = (data: LoginCredentials) =>
  api.post<AuthResponse>(`${authUrl}/login`, data);

/**
 * ฟังก์ชันสำหรับการล็อกเอาท์
 * ใช้ HttpOnly cookies แทนการส่ง token ใน header
 * @returns Promise ที่ resolve เมื่อล็อกเอาท์สำเร็จ
 */
export const postAuthLogout = async () => {
  return api.post(`${authUrl}/logout`, {});
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
 * ใช้ HttpOnly cookies แทนการส่ง token ใน header
 * @returns Promise ที่ resolve เป็นข้อมูลผู้ใช้
 */
export const getAuthMe = () => {
  return api.get<{ user: ApiUser }>(`${authUrl}/me`);
};

/**
 * ฟังก์ชันสำหรับการ authentication ด้วย Duo (two-factor authentication)
 * @param data - ข้อมูล Duo authentication (token, duo_code)
 * @returns Promise ที่ resolve เป็น AuthResponse
 */
export const postDuoAuth = (data: DuoAuthData) =>
  api.post<AuthResponse>(`${authUrl}/duo`, data);

/**
 * ฟังก์ชันสำหรับการขอรีเซ็ตรหัสผ่าน (ไม่ใช้ในระบบ SSO)
 * @param email - อีเมลของผู้ใช้
 * @returns Promise ที่ resolve เมื่อส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ
 */
export const postPasswordReset = (email: string) =>
  api.post(`${authUrl}/password-reset`, { email });

/**
 * ฟังก์ชันสำหรับการรีเซ็ตรหัสผ่าน (ไม่ใช้ในระบบ SSO)
 * @param token - token สำหรับการรีเซ็ตรหัสผ่าน
 * @param password - รหัสผ่านใหม่
 * @param password_confirmation - การยืนยันรหัสผ่านใหม่
 * @returns Promise ที่ resolve เมื่อรีเซ็ตรหัสผ่านสำเร็จ
 */
export const postPasswordResetConfirm = (
  token: string,
  password: string,
  password_confirmation: string
) =>
  api.post(`${authUrl}/password-reset/confirm`, {
    token,
    password,
    password_confirmation,
  }); 