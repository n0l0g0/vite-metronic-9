import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeenIcon } from '@/components/keenicons';
import { useAuth } from '@/auth/context/auth-context';
import { ApiAdapter } from '@/auth/adapters/api-adapter';

/**
 * หน้า Login Success สำหรับ handle การกลับมาจาก SAML/SSO provider
 * ใช้ HttpOnly Cookies สำหรับจัดการ authentication แทน URL parameters
 * จะถูกเรียกใช้เมื่อ SAML Provider redirect กลับมาหลังจาก authentication สำเร็จ
 */
const LoginSuccessPage: React.FC = () => {
  // State สำหรับจัดการ UI และข้อมูล
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('กำลังตรวจสอบการเข้าสู่ระบบ...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, saveAuth } = useAuth();

  /**
   * useEffect สำหรับการจัดการ login success callback
   * ใช้ HttpOnly Cookies แทน URL parameters
   */
  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        console.log('LoginSuccessPage: Processing login success callback with HttpOnly cookies');

        // ตรวจสอบ error จาก query parameters
        const error = searchParams.get('error');
        if (error) {
          console.error('Login Success Error:', error);
          setMessage(
            decodeURIComponent(error) || 'เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ'
          );
          setStatus('error');
          
          // Redirect กลับไปหน้า login หลัง 4 วินาที
          setTimeout(() => navigate('/auth/api-signin'), 4000);
          return;
        }

        // ไม่ต้องตรวจสอบ token จาก URL แล้ว เพราะใช้ HttpOnly cookies
        setMessage('กำลังตรวจสอบสถานะการเข้าสู่ระบบด้วย HttpOnly cookies...');
        
        try {
          console.log('LoginSuccessPage: Verifying authentication with cookies');

          // ใช้ ApiAdapter เพื่อตรวจสอบสถานะการล็อกอินด้วย HttpOnly cookies
          // ไม่ต้องเรียก loginWithToken เพราะเป็นการ verify แทน
          const userProfile = await ApiAdapter.verify();
          
          if (userProfile) {
            // ตั้งค่า auth state (placeholder เพราะใช้ cookies)
            saveAuth({ access_token: 'cookie-based' });
            
            // ดึงข้อมูลผู้ใช้หลังจากล็อกอินสำเร็จ
            setUser(userProfile);

            setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำทางไปหน้าหลัก...');
            setStatus('success');

            // ดึง return URL จาก localStorage หรือใช้หน้าหลัก
            const returnUrl = localStorage.getItem('sso_return_url') || '/';
            localStorage.removeItem('sso_return_url');
            
            console.log('LoginSuccessPage: Login successful, redirecting to:', returnUrl);
            
            // Redirect ไปยังหน้าเป้าหมาย
            setTimeout(() => navigate(returnUrl), 1000);
          } else {
            throw new Error('Authentication verification failed');
          }
        } catch (authError: any) {
          console.error('LoginSuccessPage: Error during authentication:', authError);
          setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ หรือไม่พบข้อมูลการตรวจสอบสิทธิ์');
          setStatus('error');
          setTimeout(() => navigate('/auth/api-signin'), 3000);
        }
      } catch (error: any) {
        console.error('LoginSuccessPage: Unexpected error:', error);
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
        setStatus('error');
        setTimeout(() => navigate('/auth/api-signin'), 3000);
      }
    };

    // เรียก handleLoginSuccess เฉพาะครั้งแรก
    let hasRun = false;
    if (!hasRun) {
      hasRun = true;
      handleLoginSuccess();
    }
  }, []); // ใช้ empty dependency array เพื่อป้องกัน infinite loop

  /**
   * ฟังก์ชันสำหรับ redirect กลับไปหน้า login ทันที
   */
  const handleBackToLogin = () => {
    navigate('/auth/api-signin');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            การเข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            กำลังประมวลผลการตอบกลับจากระบบ SSO
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              {status === 'loading' && (
                <>
                  <KeenIcon icon="loading" className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-foreground">กำลังประมวลผล</span>
                </>
              )}
              {status === 'success' && (
                <>
                  <KeenIcon icon="check-circle" className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">สำเร็จ!</span>
                </>
              )}
              {status === 'error' && (
                <>
                  <KeenIcon icon="cross-circle" className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400">เกิดข้อผิดพลาด</span>
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              สถานะการเข้าสู่ระบบ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* แสดงข้อความสถานะ */}
            <div className="text-center">
              {status === 'success' && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
                  <KeenIcon icon="check-circle" className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant="destructive" className="dark:border-red-800 dark:bg-red-950/50">
                  <KeenIcon icon="cross-circle" className="h-4 w-4" />
                  <AlertDescription className="dark:text-red-200">{message}</AlertDescription>
                </Alert>
              )}

              {status === 'loading' && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
                    <KeenIcon icon="loading" className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">{message}</p>
                  <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded-md max-w-full overflow-hidden">
                    <div className="truncate">{window.location.href}</div>
                  </div>
                </div>
              )}
            </div>

            {/* ปุ่มสำหรับกรณี error */}
            {status === 'error' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  จะนำทางกลับไปหน้าเข้าสู่ระบบโดยอัตโนมัติ
                </p>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full"
                  variant="outline"
                >
                  <KeenIcon icon="arrow-left" className="mr-2 h-4 w-4" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </div>
            )}

            {/* ข้อมูลเพิ่มเติมสำหรับ success */}
            {status === 'success' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">กำลังนำทางไปหน้าหลัก...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 dark:bg-green-400 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ข้อมูลช่วยเหลือ */}
        <div className="text-center text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          <p>
            หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อ IT Support
            <br />
            หรือลองใหม่อีกครั้งในภายหลัง
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessPage; 