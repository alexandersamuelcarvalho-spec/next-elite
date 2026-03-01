'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function TeamPage() {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.name || '');
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch('/api/sheets?type=teams')
      .then(r => r.json())
      .then(teams => {
        const found = teams.find(t => t.name === teamName);
        setTeam(found);
      })
      .catch(() => {});
  }, [teamName]);

  const infoStyle = {
    background: '#fff',
    borderRadius: 16,
    padding: '16px 20px',
    marginBottom: 24,
    color: '#000',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Team title */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '18px 20px',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          textTransform: 'uppercase',
        }}>
          {teamName || '(TEAM)'}
        </div>

        {/* Captain info */}
        <div style={infoStyle}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>CAPTAIN</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>CAPTAIN #</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', marginBottom: 4, borderRadius: 4, fontSize: 14 }}>
              {team?.captain || 'John Smith'}
            </div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 14 }}>
              {team?.captainPhone || '999-999-9999'}
            </div>
          </div>
        </div>

        {/* Leagues the team is in */}
        {(team?.leagues || []).map(league => (
          <button
            key={league}
            onClick={() => router.push(`/league/${encodeURIComponent(league)}`)}
            style={{
              width: '100%',
              padding: '18px 20px',
              fontSize: '18px',
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
            }}
          >
            {league}
          </button>
        ))}
      </div>
    </PageLayout>
  );
}
