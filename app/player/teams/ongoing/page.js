'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import PageLayout from '../../../../components/PageLayout';

export default function PlayerOngoingPage() {
  const router = useRouter();
  const { userAccount } = useApp();
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      // Filter teams the logged-in player is on (role = player) with ongoing leagues
      // In production, filter by userAccount.teams
      setMyTeams(teams.filter(t => t.leagues?.length > 0).slice(0, 4));
    }).catch(() => {});
  }, []);

  const btnStyle = (label) => ({
    width: '100%',
    padding: '18px 20px',
    fontSize: '20px',
    borderRadius: 999,
    background: '#fff',
    color: '#000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginBottom: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase',
        }}>
          ON GOING
        </div>
        {myTeams.map(team => (
          <button
            key={team.name}
            style={btnStyle(team.name)}
            onClick={() => router.push(`/player/team/${encodeURIComponent(team.name)}`)}
          >
            {team.name}
          </button>
        ))}
        {myTeams.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily: 'Copperplate, serif', marginTop: 40 }}>NO ONGOING TEAMS</p>
        )}
      </div>
    </PageLayout>
  );
}
