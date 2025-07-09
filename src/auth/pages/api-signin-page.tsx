import React, { useState } from 'react';
import { ApiAdapter } from '@/auth/adapters/api-adapter';
import { AlertCircle, LoaderCircleIcon } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { KeenIcon } from '@/components/keenicons';

/**
 * หน้าเข้าสู่ระบบแบบ SSO/SAML Authentication
 * รองรับการเข้าสู่ระบบผ่าน SAML provider และรับ token กลับมา
 */
const ApiSignInPage: React.FC = () => {
  // ตัวแปรสำหรับจัดการ state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * ฟังก์ชันสำหรับเริ่มกระบวนการ SSO/SAML login
   * จะ redirect ไปยัง SAML provider ผ่าน backend
   */
  const handleSsoLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting SSO login process...');

      // บันทึก current URL เพื่อ redirect กลับมาหลัง login
      const returnUrl = window.location.pathname + window.location.search;
      localStorage.setItem('sso_return_url', returnUrl);

      // เริ่มกระบวนการ SSO (จะ redirect ออกไป)
      await ApiAdapter.login();
    } catch (error: any) {
      console.error('SSO login error:', error);
      if (!error.message.includes('Redirecting')) {
        setError(error.message || 'เกิดข้อผิดพลาดในการเริ่มต้น SSO');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="block w-full space-y-5">
      <div className="text-center space-y-1 pb-3">
        <h1 className="text-2xl font-semibold tracking-tight">เข้าสู่ระบบ</h1>
        <p className="text-sm text-muted-foreground">
          ยินดีต้อนรับ! เข้าสู่ระบบด้วย Single Sign-On (SSO)
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <Button
          variant="outline"
          type="button"
          onClick={handleSsoLogin}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoaderCircleIcon className="size-4! animate-spin" />{' '}
              กำลังเชื่อมต่อ SSO...
            </span>
          ) : (
            <>
              <KeenIcon icon="security-user" /> เข้าสู่ระบบด้วย SSO
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          appearance="light"
          onClose={() => setError(null)}
        >
          <AlertIcon>
            <AlertCircle />
          </AlertIcon>
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {successMessage && (
        <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
          <AlertIcon>
            <AlertCircle className="text-green-600" />
          </AlertIcon>
          <AlertTitle>{successMessage}</AlertTitle>
        </Alert>
      )}
      {/* ข้อมูลเพิ่มเติม */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p>
          ระบบจะเชื่อมต่อไปยัง SAML Provider ของบริษัท
          <br />
          หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อ IT Support
        </p>
      </div>
    </div>
  );
};

export default ApiSignInPage;
