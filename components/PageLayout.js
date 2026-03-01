'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '../context/AppContext';

export default function PageLayout({ children, showHeader = true }) {
  const router = useRouter();
  const { t } = useApp();

  const handleBack = () => {
    router.back();
  };

  const handleAccount = () => {
    // Navigate to account home based on role
    router.push('/home');
  };

  const handleLogo = () => {
    router.push('/home');
  };

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
