'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLayout from '../../../components/PageLayout';

const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

function PaymentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusTeam = searchParams.get('team');
  const { data: session } = useSession();

  const [myTeams, setMyTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [paidStatus, setPaidStatus] = useState({});
  const [paying, setPaying] = useState(null);

  // Load teams filtered to what this captain owns
  useEffect(() => {
    if (!session) return;
    const captainTeamNames = Array.isArray(session?.user?.teams)
      ? session.user.teams.filter(t => t.role?.toLowerCase() === 'captain').map(t => t.team)
      : [];
    fetch('/api/sheets?type=teams')
      .then(r => r.json())
      .then(all => setMyTeams(Array.isArray(all) ? all.filter(t => captainTeamNames.includes(t.name)) : []))
      .catch(() => {});
    fetch('/api/sheets?type=leagues')
      .then(r => r.json())
      .then(all => setLeagues(Array.isArray(all) ? all : []))
      .catch(() => {});
  }, [session]);

  // Fetch paid status once myTeams is loaded
  useEffect(() => {
    if (myTeams.length === 0) return;
    const leagueNames = [...new Set(myTeams.flatMap(t => Array.isArray(t.leagues) ? t.leagues : []))];
    leagueNames.forEach(leagueName => {
      fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`)
        .then(r => r.json())
        .then(table => {
          if (!Array.isArray(table)) return;
          setPaidStatus(prev => ({
            ...prev,
            [leagueName]: Object.fromEntries(table.map(row => [row.team, row.paid === 'Paid'])),
          }));
        })
        .catch(() => {});
    });
  }, [myTeams]);

  const handlePay = async (teamName, leagueName, price) => {
    const key = `${teamName}|${leagueName}`;
    setPaying(key);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, leagueName, amount: price, returnUrl: '/captain/payments' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Payment failed: ' + data.error);
    } finally {
      setPaying(null);
    }
  };

  const sortedTeams = focusTeam
    ? [...myTeams].sort((a, b) => (a.name === focusTeam ? -1 : b.name === focusTeam ? 1 : 0))
    : myTeams;

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily, textTransform: 'uppercase',
        }}>
          PAYMENTS
        </div>

        {sortedTeams.map(team => (
          <div key={team.name} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#000', fontFamily, textTransform: 'uppercase', marginBottom: 12, borderBottom: '2px solid #000', paddingBottom: 8 }}>
              {team.name}
            </div>

            {(team.leagues || []).length === 0 && (
              <p style={{ color: '#888', fontSize: 13, fontFamily }}>NO LEAGUES</p>
            )}

            {(team.leagues || []).map(leagueName => {
              const league = leagues.find(l => l.name === leagueName);
              const paid = paidStatus[leagueName]?.[team.name] ?? false;
              const key = `${team.name}|${leagueName}`;
              return (
                <div key={leagueName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #eee' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#000', fontFamily, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leagueName}
                    </div>
                    <div style={{ fontSize: 12, color: '#555', fontFamily }}>
                      ${league?.price ?? '--'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: paid ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                    {paid ? (
                      <span style={{ fontSize: 12, fontFamily, fontWeight: 700, color: '#22c55e' }}>PAID</span>
                    ) : (
                      <button
                        onClick={() => handlePay(team.name, leagueName, league?.price || 0)}
                        disabled={paying === key}
                        style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontFamily, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
                      >
                        {paying === key ? '...' : `PAY $${league?.price || 0}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {myTeams.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily, marginTop: 40 }}>NO TEAMS</p>
        )}
      </div>
    </PageLayout>
  );
}

export default function CaptainPaymentsPage() {
  return (
    <Suspense>
      <PaymentsContent />
    </Suspense>
  );
}
