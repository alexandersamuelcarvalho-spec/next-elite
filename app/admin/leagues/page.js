'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

export default function AdminLeaguesPage() {
  const router = useRouter();
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(setLeagues).catch(() => {});
  }, []);

  const ongoing = leagues.filter(l => l.status === 'On Going');
  const past = leagues.filter(l => l.status === 'Past');

  const LeagueBtn = ({ league }) => (
    <button
      onClick={() => router.push(`/admin/league/${encodeURIComponent(league.name)}`)}
      style={{ width: '100%', padding: '16px 20px', fontSize: '16px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
    >
      {league.name}
    </button>
  );

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase' }}>
          ALL LEAGUES
        </div>

        <button onClick={() => router.push('/admin/leagues/create')} style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20 }}>
          + CREATE LEAGUE
        </button>

        {ongoing.length > 0 && (
          <>
            <div style={{ color: '#aaa', fontSize: 12, fontFamily: 'Copperplate, serif', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>ON GOING</div>
            {ongoing.map(l => <LeagueBtn key={l.name} league={l} />)}
          </>
        )}

        {past.length > 0 && (
          <>
            <div style={{ color: '#aaa', fontSize: 12, fontFamily: 'Copperplate, serif', textTransform: 'uppercase', marginBottom: 10, marginTop: 8, letterSpacing: '0.1em' }}>PAST</div>
            {past.map(l => <LeagueBtn key={l.name} league={l} />)}
          </>
        )}
      </div>
    </PageLayout>
  );
}
