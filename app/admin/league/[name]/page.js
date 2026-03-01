'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';
import LeagueTable from '../../../../components/LeagueTable';
import BracketView from '../../../../components/BracketView';
import { AdminMatchCard } from '../../../../components/MatchCard';
import { HamburgerIcon } from '../../../../components/UIComponents';

export default function AdminLeagueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leagueName = decodeURIComponent(params.name || '');
  const [league, setLeague] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [bracket, setBracket] = useState({});
  const [view, setView] = useState('table'); // 'table' | 'bracket' | 'schedule'
  const [allTeams, setAllTeams] = useState([]);
  const [teamToAdd, setTeamToAdd] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(data => setLeague(data.find(l => l.name === leagueName))).catch(() => {});
    fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`).then(r => r.json()).then(setTableData).catch(() => {});
    fetch(`/api/sheets?type=matches&league=${encodeURIComponent(leagueName)}`).then(r => r.json()).then(setMatches).catch(() => {});
    fetch(`/api/sheets?type=bracket&league=${encodeURIComponent(leagueName)}`).then(r => r.json()).then(setBracket).catch(() => {});
    fetch('/api/sheets?type=teams').then(r => r.json()).then(setAllTeams).catch(() => {});
  }, [leagueName]);

  const apiPost = (body) => fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const handleAddTeam = async () => {
    if (!teamToAdd) return;
    setSaving(true);
    await apiPost({ action: 'addTeamToLeague', data: { leagueName, teamName: teamToAdd } });
    const res = await fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`);
    setTableData(await res.json());
    setTeamToAdd('');
    setSaving(false);
  };

  const handleMatchChange = (matchId, updated) => {
    setMatches(prev => prev.map(m => m.matchId === matchId ? { ...m, ...updated } : m));
  };

  const handleMatchSave = async (match) => {
    await apiPost({ action: 'updateMatch', data: { leagueName, matchId: match.matchId, updates: match } });
    const res = await fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`);
    setTableData(await res.json());
  };

  const handleMatchDelete = async (matchId) => {
    await apiPost({ action: 'deleteMatch', data: { leagueName, matchId } });
    setMatches(prev => prev.filter(m => m.matchId !== matchId));
  };

  const handleAddMatch = async () => {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const nowMonth = months[new Date().getMonth()];
    const newMatch = { matchId: `NEW${Date.now()}`, month: nowMonth, date: '', time: '', homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', type: 'League', _isNew: true };
    await apiPost({ action: 'addMatch', data: { leagueName, match: newMatch } });
    setMatches(prev => [...prev, newMatch]);
  };

  const handleToggleStatus = async () => {
    const newStatus = league?.status === 'On Going' ? 'Past' : 'On Going';
    await apiPost({ action: 'updateLeague', data: { leagueName, updates: { Status: newStatus } } });
    setLeague(prev => ({ ...prev, status: newStatus }));
  };

  const handleSetBracketWinner = async (box, winner, isChampion) => {
    await apiPost({ action: 'setBracketWinner', data: { leagueName, box, winner, isChampion: !isChampion } });
    const res = await fetch(`/api/sheets?type=bracket&league=${encodeURIComponent(leagueName)}`);
    setBracket(await res.json());
  };

  const leagueTeams = tableData.map(t => t.team);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* League name with toggle for status */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {leagueName}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* League details */}
        {league && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 16, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', color: '#000' }}>
            {[['LOCATION', league.location], ['DAY', league.day], ['DIVISION', league.division], ['MONTH', league.month], ['PRICE', `$${league.price}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee', fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>{k}</span>
                <span style={{ background: '#000', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>STATUS</span>
              <button onClick={handleToggleStatus} style={{ background: league.status === 'On Going' ? '#22c55e' : '#888', color: '#fff', padding: '3px 10px', borderRadius: 4, border: 'none', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: 12, textTransform: 'uppercase' }}>
                {league.status}
              </button>
            </div>
          </div>
        )}

        {/* Add team to league */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <select value={teamToAdd} onChange={e => setTeamToAdd(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#000', color: '#fff', border: 'none', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontSize: 13, textTransform: 'uppercase' }}>
            <option value="">ADD TEAM TO LEAGUE</option>
            {allTeams.filter(t => !leagueTeams.includes(t.name)).map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <button onClick={handleAddTeam} disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '12px 16px', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontSize: 13 }}>
            ADD
          </button>
        </div>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['table','bracket','schedule'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: '12px', borderRadius: 999, background: view === v ? '#fff' : 'transparent', color: view === v ? '#000' : '#fff', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', fontSize: 12 }}>
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        {view === 'table' && <LeagueTable teams={tableData} />}

        {view === 'bracket' && (
          <BracketView
            teams={tableData.slice(0, 4)}
            bracket={bracket}
            onSetWinner={handleSetBracketWinner}
            isAdmin={true}
          />
        )}

        {view === 'schedule' && (
          <div>
            <button onClick={handleAddMatch} style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 16 }}>
              + ADD MATCH
            </button>
            {matches.map(match => (
              <div key={match.matchId}>
                <AdminMatchCard
                  match={match}
                  leagueTeams={leagueTeams}
                  onChange={updated => handleMatchChange(match.matchId, updated)}
                  onDelete={handleMatchDelete}
                />
                <button
                  onClick={() => handleMatchSave(matches.find(m => m.matchId === match.matchId))}
                  style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: 999, background: 'transparent', color: '#fff', border: '1px solid #555', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20 }}
                >
                  SAVE MATCH
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
