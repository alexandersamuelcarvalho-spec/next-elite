'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import PageLayout from '../../components/PageLayout';

export default function RolePage() {
  const router = useRouter();
  const { t, setUserRole } = useApp();

  const handleRole = (role) => {
    setUserRole(role);
    router.push('/home');
  };

  const btnStyle = {
    width: '100%',
    padding: '20px',
    fontSize: '22px',
    borderRadius: 999,
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all 0.18s',
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          ROLE
        </div>

        <button style={btnStyle} onClick={() => handleRole('captain')}>
          CAPTAIN
        </button>
        <button style={btnStyle} onClick={() => handleRole('player')}>
          PLAYER
        </button>
      </div>
    </PageLayout>
  );
}
