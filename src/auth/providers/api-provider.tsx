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
 * *** DEMO MODE: Mocked auth state for demo purposes ***
 * 
 * @param children - React child components
 * @returns JSX Element ที่ wrap ด้วย authentication context
 */
export function ApiAuthProvider({ children }: ApiAuthProviderProps) {
  // *** DEMO MODE: Mock auth state ***
  const [loading, setLoading] = useState<boolean>(false); // Set to false for demo
  const [auth, setAuth] = useState<AuthModel | undefined>({
    access_token: 'demo-token', // Mock token
    refresh_token: undefined,
  });
  const [user, setUser] = useState<UserModel | undefined>({
    username: 'demo-user',
    email: 'demo@example.com',
    first_name: 'Demo',
    last_name: 'User',
    fullname: 'Demo User',
    is_admin: true, // Set as admin for demo
  });

  // ใช้ useCallback สำหรับ setUser เพื่อป้องกัน infinite loop
  const setUserCallback = useCallback((userData: React.SetStateAction<UserModel | undefined>) => {
    setUser(userData);
  }, []);

  /**
   * ฟังก์ชันสำหรับบันทึกข้อมูล authentication
   * *** DEMO MODE: Mock implementation ***
   * @param authData - ข้อมูล authentication ที่ได้จากการล็อกอิน
   */
  const saveAuth = useCallback((authData: AuthModel | undefined) => {
    console.log('ApiProvider: DEMO MODE - Mock saveAuth called');
    setAuth(authData);
  }, []);

  /**
   * ฟังก์ชันสำหรับล็อกเอาท์
   * *** DEMO MODE: Mock implementation ***
   */
  const logout = async (): Promise<void> => {
    console.log('ApiProvider: DEMO MODE - Mock logout called');
    setLoading(true);
    try {
      // *** DEMO MODE: Comment out actual API call ***
      // await ApiAdapter.logout();
      console.log('ApiProvider: DEMO MODE - Skipping actual logout API call');
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
   * *** DEMO MODE: Mock implementation ***
   */
  const verify = async (): Promise<void> => {
    console.log('ApiProvider: DEMO MODE - Mock verify() called');
    
    // *** DEMO MODE: Comment out actual API call ***
    // try {
    //   const userProfile = await ApiAdapter.verify();
    //   if (userProfile) {
    //     // ตั้งค่า auth state (placeholder เพราะใช้ cookies)
    //     if (!auth) {
    //       setAuth({ access_token: 'cookie-based' });
    //     }
        
    //     // ดึงข้อมูลผู้ใช้หากยังไม่มี
    //     if (!user) {
    //       setUser(userProfile);
    //     }
    //   } else {
    //     // ถ้า verification ไม่สำเร็จ ให้รีเซ็ต state
    //     setAuth(undefined);
    //     setUser(undefined);
    //   }
    // } catch (error: any) {
    //   console.error('Verify error:', error);
    //   // รีเซ็ต state เมื่อเกิด auth error
    //   if (error.response?.status === 401 || error.response?.status === 403) {
    //     setAuth(undefined);
    //     setUser(undefined);
    //   }
    // }

    // *** DEMO MODE: Always return success with mock data ***
    console.log('ApiProvider: DEMO MODE - Always returning success with mock data');
    return Promise.resolve();
  };

  /**
   * ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
   * @returns true ถ้าผู้ใช้เป็น admin
   */
  const isAdmin = user?.is_admin || false;

  // *** DEMO MODE: Comment out initialization logic ***
  // ตรวจสอบสถานะการล็อกอินเมื่อ component mount
  // useEffect(() => {
  //   // ตรวจสอบสถานะการล็อกอินด้วย HttpOnly cookies
  //   const initializeAuth = async () => {
  //     setLoading(true);
  //     try {
  //       // ตรวจสอบสถานะการล็อกอิน
  //       await verify();
  //     } catch (error) {
  //       console.error('Initialize auth error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  // *** DEMO MODE: Mock initialization ***
  useEffect(() => {
    console.log('ApiProvider: DEMO MODE - Mock initialization completed');
    setLoading(false);
  }, []);

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