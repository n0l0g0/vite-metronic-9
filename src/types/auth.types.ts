/**
 * ประเภทของข้อมูลสำหรับการเข้าสู่ระบบ
 * LoginCredentials interface สำหรับรับข้อมูล username และ password
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * ประเภทของ Response ที่ได้รับจาก API หลังจากล็อกอินสำเร็จ
 * AuthResponse interface ที่ประกอบด้วย token, user data และข้อมูล Duo authentication
 */
export interface AuthResponse {
  token: string;
  user: ApiUser;
  requiresDuo?: boolean;
  duoAuthUrl?: string;
}

/**
 * ประเภทของข้อมูลผู้ใช้จาก API
 * ApiUser interface สำหรับข้อมูลผู้ใช้ที่ได้รับจาก backend API
 */
export interface ApiUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: string;
}

/**
 * ประเภทของข้อมูลสำหรับ Duo authentication และ SAML/SSO
 * DuoAuthData interface สำหรับการจัดการ Duo two-factor authentication และ Single Sign-On
 */
export interface DuoAuthData {
  token: string;
  duo_code?: string;
}

/**
 * ประเภทของข้อมูลสำหรับ SAML/SSO Callback
 * SamlCallbackData interface ใช้เมื่อ SAML Provider redirect กลับมา
 */
export interface SamlCallbackData {
  token?: string;
  error?: string;
  state?: string;
}

/**
 * ประเภทของการกำหนดค่า SAML
 * SamlConfig interface สำหรับกำหนดค่าระบบ SAML
 */
export interface SamlConfig {
  entryPoint: string; // URL ของ SAML Provider
  callbackUrl: string; // URL ที่ SAML Provider จะ redirect กลับมา
  issuer: string; // ชื่อระบบที่ส่ง SAML Request
} 