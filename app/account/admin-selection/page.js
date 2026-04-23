'use client';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

const btnStyle = {
  width: '100%',
  padding: '22px 20px',
  fontSize: '22px',
  borderRadius: 999,
  background: '#ffffff',
  color: '#000000',
  border: '2px solid #fff',
  fontFamily,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  marginBottom: 18,
};

export default function AdminSelectionPage() {
  const router = useRouter();

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
          fontFamily,
        }}>
          Admin Selection
        </div>

        <button style={btnStyle} onClick={() => router.push('/home')}>
          Admin Page
        </button>

        <button style={btnStyle} onClick={() => router.push('/account')}>
          Personal
        </button>
      </div>
    </PageLayout>
  );
}
