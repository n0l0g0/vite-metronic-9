import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeenIcon } from '@/components/keenicons';
import { useAuth } from '@/auth/context/auth-context';
import { ApiAdapter } from '@/auth/adapters/api-adapter';

/**
 * หน้า Callback สำหรับรับ token จาก SAML Provider
 * จะถูกเรียกใช้เมื่อ SAML Provider redirect กลับมา
 */
const SamlCallbackPage: React.FC = () => {
  // State สำหรับจัดการ UI และข้อมูล
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('กำลังตรวจสอบการยืนยันตัวตน...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  /**
   * useEffect สำหรับการจัดการ callback จาก SAML
   * จะทำงานเมื่อ component mount และมีข้อมูลใน URL parameters
   */
  useEffect(() => {
    const handleSamlCallback = async () => {
      try {
        // ตรวจสอบ error จาก query parameters
        const error = searchParams.get('error');
        if (error) {
          console.error('SAML Error:', error);
          setMessage(
            decodeURIComponent(error) || 'เกิดข้อผิดพลาดระหว่างการยืนยันตัวตน'
          );
          setStatus('error');
          
          // Redirect กลับไปหน้า login หลัง 4 วินาที
          setTimeout(() => navigate('/auth/api-signin'), 4000);
          return;
        }

        // ตรวจสอบ token จาก query parameters
        const token = searchParams.get('token');
        
        if (token && typeof token === 'string') {
          setMessage('พบ token แล้ว กำลังตรวจสอบ session...');
          
          try {
            console.log('Processing SAML token:', token);

            // ใช้ ApiAdapter เพื่อล็อกอินด้วย token
            const authResult = await ApiAdapter.loginWithToken();
            
            if (authResult.access_token) {
              // ดึงข้อมูลผู้ใช้หลังจากล็อกอินสำเร็จ
              const user = await ApiAdapter.getUserProfile();
              setUser(user);

              setMessage('การยืนยันตัวตนสำเร็จ! กำลังนำทางไปหน้าหลัก...');
              setStatus('success');

              // ดึง return URL จาก localStorage หรือใช้หน้าหลัก
              const returnUrl = localStorage.getItem('sso_return_url') || '/';
              localStorage.removeItem('sso_return_url');
              
              // Redirect ไปยังหน้าเป้าหมาย
              setTimeout(() => navigate(returnUrl), 1000);
            }
          } catch (authError: any) {
            console.error('Error during SAML authentication:', authError);
            setMessage('เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้ง');
            setStatus('error');
            setTimeout(() => navigate('/auth/api-signin'), 3000);
          }
        } else {
          // ไม่พบ token ใน URL
          console.error('No token found in URL');
          setMessage('ไม่พบ token ในการตอบกลับจาก SAML Provider');
          setStatus('error');
          setTimeout(() => navigate('/auth/api-signin'), 3000);
        }
      } catch (error: any) {
        console.error('Unexpected error in SAML callback:', error);
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
        setStatus('error');
        setTimeout(() => navigate('/auth/api-signin'), 3000);
      }
    };

    // เรียก handleSamlCallback เมื่อ router พร้อมใช้งาน
    if (searchParams) {
      handleSamlCallback();
    }
  }, [searchParams, navigate, setUser]);

  /**
   * ฟังก์ชันสำหรับ redirect กลับไปหน้า login ทันที
   */
  const handleBackToLogin = () => {
    navigate('/auth/api-signin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            การยืนยันตัวตน SSO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            กำลังประมวลผลการตอบกลับจาก SAML Provider
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              {status === 'loading' && (
                <>
                  <KeenIcon icon="loading" className="h-5 w-5 animate-spin text-blue-600" />
                  <span>กำลังประมวลผล</span>
                </>
              )}
              {status === 'success' && (
                <>
                  <KeenIcon icon="check-circle" className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">สำเร็จ!</span>
                </>
              )}
              {status === 'error' && (
                <>
                  <KeenIcon icon="cross-circle" className="h-5 w-5 text-red-600" />
                  <span className="text-red-600">เกิดข้อผิดพลาด</span>
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              สถานะการประมวลผลการยืนยันตัวตน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* แสดงข้อความสถานะ */}
            <div className="text-center">
              {status === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <KeenIcon icon="check-circle" className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant="destructive">
                  <KeenIcon icon="cross-circle" className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {status === 'loading' && (
                <div className="flex flex-col items-center space-y-4">
                  <KeenIcon icon="loading" className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
              )}
            </div>

            {/* ปุ่มสำหรับกรณี error */}
            {status === 'error' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">
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
              <div className="text-center text-sm text-gray-500">
                <p>กำลังนำทางไปหน้าหลัก...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ข้อมูลช่วยเหลือ */}
        <div className="text-center text-sm text-gray-500">
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

export default SamlCallbackPage; 