import { Outlet, Route, Routes } from 'react-router-dom';
import { BrandedLayout } from '@/auth/layouts/branded';
import ApiSigninPage from '@/auth/pages/api-signin-page';
import SamlCallbackPage from '@/auth/pages/saml-callback-page';

/**
 * Auth Routes Component
 * จัดการ routing สำหรับหน้าต่างๆ ที่เกี่ยวข้องกับ authentication
 * รองรับทั้ง Supabase และ API authentication
 */
export function AuthRoutes() {
  return (
    <Routes>
      <Route element={<BrandedLayout />}>
        <Route path="/" element={<Outlet />}>
          {/* API Authentication Routes */}
          <Route path="api-signin" element={<ApiSigninPage />} />
          <Route path="saml-callback" element={<SamlCallbackPage />} />
          
          {/* Default redirect to API signin */}
          <Route index element={<ApiSigninPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
