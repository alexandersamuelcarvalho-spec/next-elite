'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

export default function CaptainPaymentsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(setTeams).catch(() => {});
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(setLeagues).catch(() => {});
  }, []);

  const handlePay = async (teamName, leagueName, price) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName, leagueName, amount: price, returnUrl: '/captain/payments' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert('Payment failed: ' + data.error);
  };

  const myTeams = teams.slice(0, 2); // In production, filter by captain's teams

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase',
        }}>
          PAYMENTS
        </div>

        {myTeams.map(team => (
          <div key={team.name} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', marginBottom: 12 }}>
              {team.name}
            </div>
            {(team.leagues || []).map(leagueName => {
              const league = leagues.find(l => l.name === leagueName);
              const paid = Math.random() > 0.5; // In production, check from sheet
              return (
                <div key={leagueName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{leagueName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: paid ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                    {!paid && (
                      <button
                        onClick={() => handlePay(team.name, leagueName, league?.price || 0)}
                        style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', cursor: 'pointer', textTransform: 'uppercase' }}
                      >
                        PAY ${league?.price || 0}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
