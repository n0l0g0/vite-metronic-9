import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Component สำหรับป้องกันเส้นทางที่ต้องการการตรวจสอบสิทธิ์
 * หากผู้ใช้ไม่ได้รับการตรวจสอบสิทธิ์ จะ redirect ไปยังหน้า login
 */
export const RequireAuth = () => {
  const { auth, verify, loading: globalLoading } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // หากยังไม่ได้ initialize หรือ global loading ยังไม่เสร็จ
      if (!isInitialized && !globalLoading && !verificationStarted.current) {
        verificationStarted.current = true;
        
        try {
          // ถ้าไม่มี auth state ให้ลอง verify ก่อน
          if (!auth?.access_token) {
            console.log('RequireAuth: No auth token, attempting verification');
            await verify();
          }
        } catch (error) {
          console.error('RequireAuth: Authentication verification failed:', error);
        } finally {
          setIsInitialized(true);
          verificationStarted.current = false;
        }
      } else if (auth?.access_token && !isInitialized) {
        // ถ้ามี auth token แล้ว ให้ถือว่า initialized
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, [auth?.access_token, verify, globalLoading, isInitialized]);

  // แสดง screen loader ขณะที่กำลัง initialize หรือ global loading
  if (globalLoading || !isInitialized) {
    return <ScreenLoader />;
  }

  // หากไม่ได้รับการตรวจสอบสิทธิ์แล้ว ให้ redirect ไปหน้า login
  if (!auth?.access_token) {
    console.log('RequireAuth: No authentication found, redirecting to login');
    return (
      <Navigate
        to={`/auth/api-signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // หากได้รับการตรวจสอบสิทธิ์แล้ว ให้แสดง child routes
  return <Outlet />;
};
