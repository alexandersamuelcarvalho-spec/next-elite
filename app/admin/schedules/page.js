'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

export default function AdminSchedulesPage() {
  const router = useRouter();
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(setLeagues).catch(() => {});
  }, []);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase' }}>
          SCHEDULES
        </div>

        <p style={{ color: '#aaa', fontSize: 12, textAlign: 'center', fontFamily: 'Copperplate, serif', marginBottom: 20 }}>SELECT A LEAGUE TO MANAGE ITS SCHEDULE</p>

        {leagues.map(league => (
          <button
            key={league.name}
            onClick={() => router.push(`/admin/league/${encodeURIComponent(league.name)}`)}
            style={{ width: '100%', padding: '16px 20px', fontSize: '16px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {league.name}
          </button>
        ))}
      </div>
    </PageLayout>
  );
}
