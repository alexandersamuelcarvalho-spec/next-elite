'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function LanguagePage() {
  const router = useRouter();
  const { switchLanguage } = useApp();

  const handleSelect = (lang) => {
    switchLanguage(lang);
    router.push('/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 60 }}>
        <img
          src="/logo.png"
          alt="Next Elite Soccer"
          style={{ width: 220, height: 220, objectFit: 'contain' }}
        />
      </div>

      {/* English Button */}
      <button
        onClick={() => handleSelect('en')}
        style={{
          width: '100%',
          padding: '22px 20px',
          fontSize: '28px',
          borderRadius: 16,
          background: '#ffffff',
          color: '#000000',
          border: '2px solid #ffffff',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          marginBottom: 16,
          transition: 'all 0.18s',
        }}
        onMouseDown={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
        onMouseUp={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
        onTouchStart={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
        onTouchEnd={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
      >
        ENGLISH
      </button>

      {/* Spanish Button */}
      <button
        onClick={() => handleSelect('es')}
        style={{
          width: '100%',
          padding: '22px 20px',
          fontSize: '28px',
          borderRadius: 16,
          background: '#ffffff',
          color: '#000000',
          border: '2px solid #ffffff',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.18s',
        }}
        onMouseDown={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
        onMouseUp={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
        onTouchStart={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
        onTouchEnd={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
      >
        ESPAÑOL
      </button>
    </div>
  );
}
