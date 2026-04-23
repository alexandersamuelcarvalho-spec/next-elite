'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useApp } from '../context/AppContext';

export default function PageLayout({ children, showHeader = true }) {
  const router = useRouter();
  const { t, userRole } = useApp();
  const { data: session, status } = useSession();

  const handleBack = () => {
    router.back();
  };

  const handleAccount = () => {
    if (status === 'authenticated') {
      const accountStatus = session?.user?.status?.toLowerCase();
      if (accountStatus === 'admin') {
        router.push('/account/admin-selection');
      } else {
        router.push('/account');
      }
      return;
    }
    // Dev / unauthenticated fallback using context role
    if (userRole === 'admin') {
      router.push('/account/admin-selection');
    } else if (userRole) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };

  const handleLogo = () => router.push('/home');

  return (
    <div className="page-container">
      {showHeader && (
        <div className="page-header">
          <button
            className="btn-white"
            style={{ padding: '6px 16px', fontSize: '14px', fontWeight: 700, minWidth: 80 }}
            onClick={handleBack}
          >
            {t('back')}
          </button>

          <button className="logo-btn" onClick={handleLogo} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <img
              src="/logo.png"
              alt="Next Elite Soccer"
              style={{ width: 64, height: 64, objectFit: 'contain', filter: 'invert(0)' }}
            />
          </button>

          <button
            className="btn-white"
            style={{ padding: '6px 16px', fontSize: '14px', fontWeight: 700, minWidth: 80 }}
            onClick={handleAccount}
          >
            {t('account')}
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
