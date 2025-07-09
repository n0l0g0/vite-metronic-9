import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import LoginSuccessPage from '@/auth/pages/login-success-page';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { Demo2Layout } from '@/layouts/demo2/layout';
import { Demo3Layout } from '@/layouts/demo3/layout';
import { Demo4Layout } from '@/layouts/demo4/layout';
import { Demo5Layout } from '@/layouts/demo5/layout';
import { Demo6Layout } from '@/layouts/demo6/layout';
import { Demo7Layout } from '@/layouts/demo7/layout';
import { Demo8Layout } from '@/layouts/demo8/layout';
import { Demo9Layout } from '@/layouts/demo9/layout';
import { Demo10Layout } from '@/layouts/demo10/layout';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import { Navigate, Route, Routes } from 'react-router';
import { AircraftPage } from '@/pages/data-management/aircraft';
import { EnginePage } from '@/pages/data-management/engine';
import { OilConsumptionPage } from '@/pages/data-management/oil-consumption';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/aircraft" element={<AircraftPage />} />
          <Route path="/engine" element={<EnginePage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/oil-consumption" element={<OilConsumptionPage />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      
      {/* Legacy URL Support for SAML Callback */}
      <Route path="login/success" element={<LoginSuccessPage />} />
      
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
