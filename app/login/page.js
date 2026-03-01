'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import PageLayout from '../../components/PageLayout';

export default function LoginPage() {
  const router = useRouter();
  const { t, setUserRole } = useApp();

  // In production this calls NextAuth signIn
  const handleFacebook = async () => {
    try {
      const { signIn } = await import('next-auth/react');
      await signIn('facebook', { callbackUrl: '/role' });
    } catch {
      // Dev mode: simulate login
      setUserRole('captain');
      router.push('/role');
    }
  };

  const handleGoogle = async () => {
    try {
      const { signIn } = await import('next-auth/react');
      await signIn('google', { callbackUrl: '/role' });
    } catch {
      // Dev mode: simulate login
      setUserRole('captain');
      router.push('/role');
    }
  };

  const handleHomePage = () => router.push('/home');

  const btnStyle = {
    width: '100%',
    padding: '22px 20px',
    fontSize: '20px',
    borderRadius: 16,
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    transition: 'all 0.18s',
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 24 }}>
        {/* Facebook */}
        <button style={btnStyle} onClick={handleFacebook}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </div>
          <span>CONNECT WITH FACEBOOK</span>
        </button>

        {/* Google */}
        <button style={btnStyle} onClick={handleGoogle}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 24, fontFamily: 'Arial, sans-serif' }}>G</span>
          </div>
          <span>CONNECT WITH GOOGLE</span>
        </button>

        {/* Home page (browse as guest) */}
        <button
          style={{ ...btnStyle, marginTop: 8 }}
          onClick={handleHomePage}
        >
          HOME PAGE
        </button>
      </div>
    </PageLayout>
  );
}
