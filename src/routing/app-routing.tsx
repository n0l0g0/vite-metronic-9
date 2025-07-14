import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { useLocation } from 'react-router';
import { useLoadingBar } from 'react-top-loading-bar';
import { AppRoutingSetup } from './app-routing-setup';

export function AppRouting() {
  const { start, complete } = useLoadingBar({
    color: 'var(--color-primary)',
    shadow: false,
    waitingTime: 400,
    transitionTime: 200,
    height: 2,
  });

  const { verify, setLoading } = useAuth();
  const [previousLocation, setPreviousLocation] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();
  const path = location.pathname.trim();

  // *** DEMO MODE: Comment out auth verification ***
  // useEffect(() => {
  //   if (firstLoad) {
  //     verify().finally(() => {
  //       setLoading(false);
  //       setFirstLoad(false);
  //     });
  //   }
  // }, [firstLoad, verify, setLoading]);

  // *** DEMO MODE: Mock initialization without auth verification ***
  useEffect(() => {
    if (firstLoad) {
      console.log('AppRouting: DEMO MODE - Skipping auth verification');
      setLoading(false);
      setFirstLoad(false);
    }
  }, [firstLoad, setLoading]);

  useEffect(() => {
    if (!firstLoad && path !== previousLocation) {
      start('static');
      setPreviousLocation(path);
      complete();
    }
  }, [location, firstLoad, path, previousLocation, start, complete]);

  useEffect(() => {
    if (!CSS.escape(window.location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [previousLocation]);

  return <AppRoutingSetup />;
}
