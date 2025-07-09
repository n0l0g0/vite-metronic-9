import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthModel, UserModel } from '@/auth/lib/models';
import { ApiAdapter } from '@/auth/adapters/api-adapter';
import { AuthContext } from '@/auth/context/auth-context';

/**
 * Props สำหรับ ApiAuthProvider component
 * กำหนด props ที่ ApiAuthProvider รับเข้ามา
 */
interface ApiAuthProviderProps {
  children: ReactNode;
}

/**
 * ApiAuthProvider Component
 * ให้บริการ authentication context ที่ใช้ backend API
 * 
 * @param children - React child components
 * @returns JSX Element ที่ wrap ด้วย authentication context
 */
export function ApiAuthProvider({ children }: ApiAuthProviderProps) {
  // State variables สำหรับจัดการ authentication state
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuth] = useState<AuthModel | undefined>();
  const [user, setUser] = useState<UserModel | undefined>();

  // ใช้ useCallback สำหรับ setUser เพื่อป้องกัน infinite loop
  const setUserCallback = useCallback((userData: React.SetStateAction<UserModel | undefined>) => {
    setUser(userData);
  }, []);

  /**
   * ฟังก์ชันสำหรับบันทึกข้อมูล authentication
   * ไม่ต้องจัดการ localStorage แล้ว เพราะใช้ HttpOnly cookies
   * @param authData - ข้อมูล authentication ที่ได้จากการล็อกอิน
   */
  const saveAuth = useCallback((authData: AuthModel | undefined) => {
    setAuth(authData);
    // HttpOnly cookies จะถูกจัดการโดย server อัตโนมัติ
  }, []);

  /**
   * ฟังก์ชันสำหรับล็อกเอาท์
   * ลบข้อมูล authentication และรีเซ็ต state
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await ApiAdapter.logout();
    } catch (error: any) {
      console.warn('Logout API error:', error);
    } finally {
      setAuth(undefined);
      setUser(undefined);
      setLoading(false);
    }
  };

  /**
   * ฟังก์ชันสำหรับตรวจสอบสถานะการล็อกอิน
   * ใช้ HttpOnly cookies แทน localStorage
   */
  const verify = async (): Promise<void> => {
    console.log('ApiProvider: Starting verify()');
    
    try {
      const userProfile = await ApiAdapter.verify();
      if (userProfile) {
        // ตั้งค่า auth state (placeholder เพราะใช้ cookies)
        if (!auth) {
          setAuth({ access_token: 'cookie-based' });
        }
        
        // ดึงข้อมูลผู้ใช้หากยังไม่มี
        if (!user) {
          setUser(userProfile);
        }
      } else {
        // ถ้า verification ไม่สำเร็จ ให้รีเซ็ต state
        setAuth(undefined);
        setUser(undefined);
      }
    } catch (error: any) {
      console.error('Verify error:', error);
      // รีเซ็ต state เมื่อเกิด auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuth(undefined);
        setUser(undefined);
      }
    }
  };

  /**
   * ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
   * @returns true ถ้าผู้ใช้เป็น admin
   */
  const isAdmin = user?.is_admin || false;

  // ตรวจสอบสถานะการล็อกอินเมื่อ component mount
  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินด้วย HttpOnly cookies
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // ตรวจสอบสถานะการล็อกอิน
        await verify();
      } catch (error) {
        console.error('Initialize auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // ใช้ empty dependency array เพื่อให้รันเฉพาะครั้งแรก

  // ค่า context ที่จะส่งให้ children components
  const contextValue = {
    loading,
    setLoading,
    auth,
    saveAuth,
    user,
    setUser: setUserCallback,
    logout,
    verify,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
} 