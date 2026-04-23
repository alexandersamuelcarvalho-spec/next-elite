'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLayout from '../../../../components/PageLayout';

export default function PlayerOngoingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/sheets?type=teams').then(r => r.json()),
      fetch('/api/sheets?type=leagues').then(r => r.json()),
    ]).then(([allTeams, allLeagues]) => {
      const ongoingLeagueNames = new Set(
        allLeagues.filter(l => l.status === 'On Going').map(l => l.name)
      );
      const playerTeamNames = (session?.user?.teams || [])
        .filter(t => t.role?.toLowerCase() === 'player')
        .map(t => t.team);
      setMyTeams(allTeams.filter(t =>
        playerTeamNames.includes(t.name) &&
        (t.leagues || []).some(l => ongoingLeagueNames.has(l))
      ));
    }).catch(() => {});
  }, [session]);

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
