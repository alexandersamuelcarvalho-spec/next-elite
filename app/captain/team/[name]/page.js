'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function CaptainTeamPage() {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.name || '');
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      setTeam(teams.find(t => t.name === teamName));
    }).catch(() => {});
  }, [teamName]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Team name with hamburger */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {teamName || '(TEAM)'}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* Captain info */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 6 }}>CAPTAIN</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>CAPTAIN #</div>
          </div>
          <div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', marginBottom: 4, borderRadius: 4, fontSize: 13 }}>{team?.captain || 'John Smith'}</div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 13 }}>{team?.captainPhone || '999-999-9999'}</div>
          </div>
        </div>

        {/* Leagues for this team */}
        {(team?.leagues || []).map(league => (
          <button
            key={league}
            onClick={() => router.push(`/captain/league/${encodeURIComponent(league)}`)}
            style={{
              width: '100%', padding: '18px 20px', fontSize: '18px', borderRadius: 999,
              background: '#fff', color: '#000', border: '2px solid #fff',
              fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
              fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {league}
          </button>
        ))}

        {(!team?.leagues || team.leagues.length === 0) && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily: 'Copperplate, serif', marginTop: 20 }}>NO LEAGUES</p>
        )}

        {/* TABLE and SCHEDULE buttons */}
        <div style={{ marginTop: 16 }}>
          <button onClick={() => router.push(`/captain/table/${encodeURIComponent(team?.leagues?.[0] || teamName)}`)} style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}>
            TABLE
          </button>
          <button onClick={() => router.push(`/schedule/${encodeURIComponent(team?.leagues?.[0] || teamName)}`)} style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}>
            SCHEDULE
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
