'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import PageLayout from '../../components/PageLayout';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const league = searchParams.get('league');
  const team = searchParams.get('team');

  useEffect(() => {
    // In production, update the Paid column in Google Sheets here
    // via a server action or API call
  }, []);

  return (
    <PageLayout>
      <div style={{ paddingTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>✅</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 24, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>PAYMENT SUCCESSFUL</h2>
          {team && <p style={{ fontSize: 14, marginBottom: 8 }}>TEAM: {team}</p>}
          {league && <p style={{ fontSize: 14 }}>LEAGUE: {league}</p>}
        </div>
        <button
          onClick={() => router.push('/home')}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
        >
          HOME
        </button>
      </div>
    </PageLayout>
  );
}
