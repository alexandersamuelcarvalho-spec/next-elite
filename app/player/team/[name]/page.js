'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import PageLayout from '../../../../components/PageLayout';
import LeagueTable from '../../../../components/LeagueTable';

export default function PlayerTeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.name || '');
  const { userAccount } = useApp();
  const [team, setTeam] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      const t = teams.find(t => t.name === teamName);
      setTeam(t);
      if (t?.leagues?.length > 0) {
        setSelectedLeague(t.leagues[0]);
      }
    }).catch(() => {});
  }, [teamName]);

  useEffect(() => {
    if (!selectedLeague) return;
    fetch(`/api/sheets?type=table&league=${encodeURIComponent(selectedLeague)}`)
      .then(r => r.json()).then(setTableData).catch(() => {});
  }, [selectedLeague]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Player name */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase',
        }}>
          {userAccount?.accountName || '(PLAYER)'}
        </div>

        {/* Player info box */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 6 }}>PLAYER</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>PLAYER #</div>
          </div>
          <div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', marginBottom: 4, borderRadius: 4, fontSize: 13 }}>{userAccount?.name || 'John Smith'}</div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 13 }}>{userAccount?.phone || '999-999-9999'}</div>
          </div>
        </div>

        {/* TEAMS button */}
        <button
          onClick={() => router.push('/player/teams')}
          style={{ width: '100%', padding: '18px', fontSize: '20px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}
        >
          TEAMS
        </button>

        {/* SCHEDULE button */}
        <button
          onClick={() => router.push(`/schedule/${encodeURIComponent(selectedLeague || teamName)}`)}
          style={{ width: '100%', padding: '18px', fontSize: '20px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}
        >
          SCHEDULE
        </button>
      </div>
    </PageLayout>
  );
}
