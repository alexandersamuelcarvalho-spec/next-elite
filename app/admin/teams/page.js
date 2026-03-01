'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

export default function AdminTeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(setTeams).catch(() => {});
  }, []);

  const filtered = teams.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24,
          textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase',
        }}>
          ALL TEAMS
        </div>

        {/* Create Team */}
        <button
          onClick={() => router.push('/admin/teams/create')}
          style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20 }}
        >
          + CREATE TEAM
        </button>

        {/* Team list */}
        {filtered.map(team => (
          <button
            key={team.name}
            onClick={() => router.push(`/admin/team/${encodeURIComponent(team.name)}`)}
            style={{
              width: '100%', padding: '16px 20px', fontSize: '18px', borderRadius: 999,
              background: '#fff', color: '#000', border: '2px solid #fff',
              fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
              fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12,
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
