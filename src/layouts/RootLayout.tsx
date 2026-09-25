import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileBottomDock } from '../components/layout/MobileBottomDock';

export const RootLayout: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
      const timer = setTimeout(scrollToHash, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased">
      <Header />
      <main className="flex-1 w-full pt-20 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomDock />
    </div>
  );
};
