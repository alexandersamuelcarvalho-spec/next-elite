'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';

export default function PlayerPastPage() {
  const router = useRouter();
  const [pastTeams, setPastTeams] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      // In production, filter by userAccount and only show teams in past leagues
      setPastTeams(teams.slice(0, 2));
    }).catch(() => {});
  }, []);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase',
        }}>
          PAST
        </div>
        {pastTeams.map(team => (
          <button
            key={team.name}
            onClick={() => router.push(`/player/team/${encodeURIComponent(team.name)}`)}
            style={{
              width: '100%', padding: '18px 20px', fontSize: '20px', borderRadius: 999,
              background: '#fff', color: '#000', border: '2px solid #fff',
              fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
              fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {team.name}
          </button>
        ))}
        {pastTeams.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily: 'Copperplate, serif', marginTop: 40 }}>NO PAST TEAMS</p>
        )}
      </div>
    </PageLayout>
  );
}
