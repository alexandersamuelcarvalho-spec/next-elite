'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';
import { HamburgerIcon } from '../../../../components/UIComponents';

export default function AdminTeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.name || '');
  const [team, setTeam] = useState(null);
  const [allLeagues, setAllLeagues] = useState([]);
  const [selectedLeagueToAdd, setSelectedLeagueToAdd] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => setTeam(teams.find(t => t.name === teamName))).catch(() => {});
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(setAllLeagues).catch(() => {});
  }, [teamName]);

  const handleAddToLeague = async () => {
    if (!selectedLeagueToAdd) return;
    setSaving(true);
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addTeamToLeague', data: { leagueName: selectedLeagueToAdd, teamName } }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Team name */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {teamName}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* Captain info */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 6 }}>CAPTAIN</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>CAPTAIN #</div>
          </div>
          <div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', marginBottom: 4, borderRadius: 4, fontSize: 13 }}>{team?.captain || '-'}</div>
            <div style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 13 }}>{team?.captainPhone || '-'}</div>
          </div>
        </div>

        {/* Add to league */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <select
            value={selectedLeagueToAdd}
            onChange={e => setSelectedLeagueToAdd(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#000', color: '#fff', border: 'none', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontSize: 14, textTransform: 'uppercase' }}
          >
            <option value="">ADD TO LEAGUE</option>
            {allLeagues.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
          <button
            onClick={handleAddToLeague}
            disabled={saving}
            style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '12px 18px', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', fontSize: 14 }}
          >
            {saving ? '...' : 'ADD'}
          </button>
        </div>

        {/* Current leagues */}
        {(team?.leagues || []).map(league => (
          <button
            key={league}
            onClick={() => router.push(`/admin/league/${encodeURIComponent(league)}`)}
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {league}
          </button>
        ))}

        {/* Stats */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginTop: 8, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', color: '#000' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            {[
              ['LEAGUES', team?.totalLeagues || 0],
              ['GAMES', team?.totalPlayed || 0],
              ['WINS', team?.totalWins || 0],
              ['DRAWS', team?.totalDraws || 0],
              ['LOSSES', team?.totalLosses || 0],
              ['POINTS', team?.totalPoints || 0],
              ['G+', team?.totalGoalsDone || 0],
              ['G-', team?.totalGoalsAgainst || 0],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #ddd' }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{label}</span>
                <span style={{ fontWeight: 400, fontSize: 12 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
