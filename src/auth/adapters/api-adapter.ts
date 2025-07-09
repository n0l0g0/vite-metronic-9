import { AuthModel, UserModel } from '@/auth/lib/models';
import { ApiUser } from '@/types/auth.types';
import {
  getAuthMe,
  initiateSamlLogin,
  postAuthLogout,
  validateTokenAndGetUser,
} from '@/services/auth.service';

/**
 * Helper function สำหรับแปลงข้อมูลผู้ใช้จาก API format เป็น UserModel
 * แปลงข้อมูลผู้ใช้จาก backend API format ให้เข้ากับ Metronic format
 */
const transformApiUserToUserModel = (apiUser: ApiUser): UserModel => {
  const nameParts = apiUser.name ? apiUser.name.split(' ') : ['', ''];
  return {
    username: apiUser.username,
    email: apiUser.email,
    first_name: nameParts[0] || '',
    last_name: nameParts.slice(1).join(' ') || '',
    fullname: apiUser.name,
    is_admin: apiUser.role === 'admin',
    roles: apiUser.role ? [apiUser.role === 'admin' ? 1 : 2] : [],
  };
};

/**
 * API Adapter สำหรับการจัดการ authentication ผ่าน SAML/SSO
 * ใช้ interface เดียวกันกับ SupabaseAdapter แต่เชื่อมต่อกับ SAML backend
 */

// ตัวแปรสำหรับ cache การเรียก API
let userProfile: UserModel | null = null;
let isVerifying = false;
let lastVerifyTime = 0;
const VERIFY_CACHE_DURATION = 30000; // 30 วินาที

export const ApiAdapter = {
  /**
   * ฟังก์ชันสำหรับเริ่มต้นการล็อกอินด้วย SAML/SSO
   * จะ redirect ไปยัง SAML provider ผ่าน backend
   */
  async login(): Promise<AuthModel> {
    console.log('ApiAdapter: Initiating SAML/SSO login');

    // เริ่มกระบวนการ SAML authentication
    initiateSamlLogin();

    // Return empty auth model (จะไม่เคยถึงจุดนี้เพราะจะ redirect ออกไป)
    throw new Error('Redirecting to SAML provider...');
  },

  /**
   * ฟังก์ชันสำหรับการตรวจสอบสถานะหลังจาก SAML callback
   * ไม่ต้องรับ token เพราะใช้ HttpOnly cookies แล้ว
   * @returns Promise ที่ resolve เป็น AuthModel
   */
  async loginWithToken(): Promise<AuthModel> {
    console.log('ApiAdapter: Verifying SAML authentication status');

    try {
      // ตรวจสอบสถานะการล็อกอินด้วย HttpOnly cookies
      const response = await validateTokenAndGetUser();

      if (!response.data.user) {
        throw new Error('Authentication failed or user not found');
      }

      console.log('ApiAdapter: SAML authentication verification successful');

      // ไม่ต้องเก็บ token ใน localStorage แล้ว เพราะใช้ HttpOnly cookies
      // แปลงเป็น AuthModel format (ไม่มี token เพราะเก็บในคุ้กกี้แล้ว)
      return {
        access_token: 'cookie-based', // placeholder เพื่อความเข้ากันได้
        refresh_token: undefined,
      };
    } catch (error: any) {
      console.error(
        'ApiAdapter: SAML authentication verification error:',
        error,
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'SAML authentication verification failed',
      );
    }
  },

  /**
   * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
   * ใช้ HttpOnly cookies แทน localStorage
   * @returns Promise ที่ resolve เป็นข้อมูลผู้ใช้
   */
  async getUserProfile(): Promise<UserModel> {
    console.log('ApiAdapter: Getting user profile');

    try {
      // เรียก API เพื่อดึงข้อมูลผู้ใช้ (ใช้ HttpOnly cookies)
      const response = await getAuthMe();

      if (!response.data.user) {
        throw new Error('No user data received from API');
      }

      console.log('ApiAdapter: User profile retrieved successfully');

      // แปลงข้อมูลและส่งกลับ
      return transformApiUserToUserModel(response.data.user);
    } catch (error: any) {
      console.error('ApiAdapter: Get user profile error:', error);

      // HttpOnly cookies จะถูกจัดการโดย server เมื่อ 401
      throw new Error(
        error.response?.data?.message || 'Failed to get user profile',
      );
    }
  },

  /**
   * ฟังก์ชันสำหรับล็อกเอาท์
   * ใช้ HttpOnly cookies แทน localStorage
   * @returns Promise ที่ resolve เมื่อล็อกเอาท์สำเร็จ
   */
  async logout(): Promise<void> {
    console.log('ApiAdapter: Logging out');

    try {
      // เรียก API logout เพื่อลบ HttpOnly cookies ที่ server
      await postAuthLogout();

      console.log('ApiAdapter: Logout completed');
    } catch (error: any) {
      console.error('ApiAdapter: Logout error:', error);
      // ถึงแม้จะ error ก็ยังถือว่า logout สำเร็จ เพราะ cookies จะหมดอายุ
    }
  },

  /**
   * ฟังก์ชันสำหรับตรวจสอบสถานะการล็อกอิน
   * ใช้ HttpOnly cookies แทน localStorage
   * @returns Promise ที่ resolve เป็น true ถ้ายังคงล็อกอินอยู่
   */
  async verify(): Promise<UserModel | null> {
    const now = Date.now();

    // ป้องกันการเรียก verify() หลายครั้งพร้อมกัน
    if (isVerifying) {
      console.log('ApiAdapter: Verify already in progress, waiting...');
      // รอให้ verification ปัจจุบันเสร็จ
      while (isVerifying) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // ส่งผลลัพธ์ล่าสุด (ไม่ใช้ cache time เพื่อให้ผลลัพธ์ถูกต้อง)
      return lastVerifyTime > 0 ? userProfile : null;
    }

    // ใช้ cache หาก verify เมื่อไม่นานมานี้ (เฉพาะเมื่อไม่ใช่การ verify ครั้งแรก)
    if (now - lastVerifyTime < VERIFY_CACHE_DURATION && lastVerifyTime > 0) {
      console.log('ApiAdapter: Using cached verify result');
      return userProfile;
    }

    isVerifying = true;
    console.log('ApiAdapter: Starting fresh verification');

    try {
      userProfile = await this.getUserProfile();
      lastVerifyTime = now;
      console.log('ApiAdapter: Verify successful');
      return userProfile;
    } catch (error: any) {
      console.log(
        'ApiAdapter: Verify failed:',
        error.response?.status || error.message,
      );
      // ลบ cache เมื่อ verify ล้มเหลว
      lastVerifyTime = 0;
      // HttpOnly cookies จะถูกจัดการโดย server เมื่อ 401
      return null;
    } finally {
      isVerifying = false;
    }
  },
};
