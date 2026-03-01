'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import PageLayout from '../../../components/PageLayout';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function CaptainTeamsPage() {
  const router = useRouter();
  const { userAccount } = useApp();
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      // In production, filter teams where user is captain
      setMyTeams(teams.slice(0, 3));
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
          CAPTAIN'S TEAMS
        </div>

        {myTeams.map(team => (
          <button
            key={team.name}
            onClick={() => router.push(`/captain/team/${encodeURIComponent(team.name)}`)}
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
      </div>
    </PageLayout>
  );
}
