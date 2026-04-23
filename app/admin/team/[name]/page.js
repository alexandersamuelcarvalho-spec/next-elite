'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';
import { HamburgerIcon } from '../../../../components/UIComponents';

const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

export default function AdminTeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamName = decodeURIComponent(params.name || '');
  const [team, setTeam] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [allLeagues, setAllLeagues] = useState([]);
  const [selectedLeagueToAdd, setSelectedLeagueToAdd] = useState('');
  const [saving, setSaving] = useState(false);

  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switcherSearch, setSwitcherSearch] = useState('');
  const switcherRef = useRef(null);

  useEffect(() => {
    fetch('/api/sheets?type=teams').then(r => r.json()).then(teams => {
      setAllTeams(teams);
      setTeam(teams.find(t => t.name === teamName));
    }).catch(() => {});
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(setAllLeagues).catch(() => {});
  }, [teamName]);

  // Close switcher when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setShowSwitcher(false);
        setSwitcherSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTeams = allTeams.filter(t =>
    t.name?.toLowerCase().includes(switcherSearch.toLowerCase())
  );

  const handleSwitchTeam = (name) => {
    setShowSwitcher(false);
    setSwitcherSearch('');
    router.push(`/admin/team/${encodeURIComponent(name)}`);
  };

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
        {/* Team name + hamburger switcher */}
        <div ref={switcherRef} style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#000', fontFamily, textTransform: 'uppercase', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {teamName}
            </span>
            <button
              onClick={() => { setShowSwitcher(prev => !prev); setSwitcherSearch(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <HamburgerIcon color="#000" />
            </button>
          </div>

          {showSwitcher && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: 12,
              marginTop: 4,
              zIndex: 100,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}>
              {/* Search input */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>
                <input
                  autoFocus
                  value={switcherSearch}
                  onChange={e => setSwitcherSearch(e.target.value)}
                  placeholder="SEARCH TEAMS..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontFamily,
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Team list */}
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {filteredTeams.map(t => (
                  <div
                    key={t.name}
                    onMouseDown={() => handleSwitchTeam(t.name)}
                    style={{
                      padding: '13px 16px',
                      cursor: 'pointer',
                      fontFamily,
                      fontSize: 14,
                      fontWeight: 700,
                      color: t.name === teamName ? '#fff' : '#000',
                      background: t.name === teamName ? '#000' : '#fff',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {t.name}
                  </div>
                ))}
                {filteredTeams.length === 0 && (
                  <div style={{ padding: '16px', color: '#888', fontFamily, fontSize: 13, textAlign: 'center' }}>
                    NO TEAMS FOUND
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Captain info */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, fontFamily }}>
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
            style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#000', color: '#fff', border: 'none', fontFamily, fontSize: 14, textTransform: 'uppercase' }}
          >
            <option value="">ADD TO LEAGUE</option>
            {allLeagues.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
          <button
            onClick={handleAddToLeague}
            disabled={saving}
            style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '12px 18px', fontFamily, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', fontSize: 14 }}
          >
            {saving ? '...' : 'ADD'}
          </button>
        </div>

        {/* Current leagues */}
        {(team?.leagues || []).map(league => (
          <button
            key={league}
            onClick={() => router.push(`/admin/league/${encodeURIComponent(league)}`)}
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {league}
          </button>
        ))}

        {/* Stats */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginTop: 8, fontFamily, color: '#000' }}>
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
