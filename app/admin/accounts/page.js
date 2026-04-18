'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../../../components/PageLayout';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [addingFor, setAddingFor] = useState(null); // login of account being edited
  const [newTeam, setNewTeam] = useState('');
  const [newRole, setNewRole] = useState('player');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sheets?type=accounts').then(r => r.json()).then(setAccounts).catch(() => {});
    fetch('/api/sheets?type=teams').then(r => r.json()).then(setAllTeams).catch(() => {});
  }, []);

  const handleToggleAdmin = async (accountName, currentStatus) => {
    const newStatus = currentStatus === 'Admin' ? 'user' : 'Admin';
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountStatus', data: { accountName, status: newStatus } }),
    });
    setAccounts(prev => prev.map(a => a.accountName === accountName ? { ...a, status: newStatus } : a));
  };

  const handleAddTeam = async (acc) => {
    if (!newTeam) return;
    const updated = [...(acc.teams || []), { team: newTeam, role: newRole }];
    setSaving(true);
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountTeams', data: { login: acc.login, teams: updated } }),
    });
    setAccounts(prev => prev.map(a => a.login === acc.login ? { ...a, teams: updated } : a));
    setNewTeam('');
    setNewRole('player');
    setAddingFor(null);
    setSaving(false);
  };

  const handleRemoveTeam = async (acc, teamName) => {
    const updated = (acc.teams || []).filter(t => t.team !== teamName);
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountTeams', data: { login: acc.login, teams: updated } }),
    });
    setAccounts(prev => prev.map(a => a.login === acc.login ? { ...a, teams: updated } : a));
  };

  const handleToggleTeamRole = async (acc, teamName) => {
    const updated = (acc.teams || []).map(t =>
      t.team === teamName ? { ...t, role: t.role === 'captain' ? 'player' : 'captain' } : t
    );
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountTeams', data: { login: acc.login, teams: updated } }),
    });
    setAccounts(prev => prev.map(a => a.login === acc.login ? { ...a, teams: updated } : a));
  };

  const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily, textTransform: 'uppercase' }}>
          ACCOUNTS
        </div>

        {accounts.map(acc => (
          <div key={acc.login} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 14, fontFamily, color: '#000' }}>

            {/* Header row: name + role badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{acc.name || acc.accountName}</span>
              <button
                onClick={() => handleToggleAdmin(acc.accountName, acc.status)}
                style={{ background: acc.status === 'Admin' ? '#000' : '#e8e8e8', color: acc.status === 'Admin' ? '#fff' : '#000', border: 'none', borderRadius: 6, padding: '4px 12px', fontFamily, fontWeight: 700, cursor: 'pointer', fontSize: 12, textTransform: 'uppercase' }}
              >
                {acc.status === 'Admin' ? 'ADMIN' : 'USER'}
              </button>
            </div>

            {/* Login info */}
            <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{acc.loginType}: {acc.login}</div>

            {/* Teams */}
            {(acc.teams || []).map(t => (
              <div key={t.team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderTop: '1px solid #eee' }}>
                <span style={{ fontSize: 13 }}>{t.team}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleToggleTeamRole(acc, t.team)}
                    style={{ background: t.role === 'captain' ? '#000' : '#e8e8e8', color: t.role === 'captain' ? '#fff' : '#000', border: 'none', borderRadius: 4, padding: '2px 10px', fontFamily, fontWeight: 700, fontSize: 11, cursor: 'pointer', textTransform: 'uppercase' }}
                  >
                    {t.role === 'captain' ? 'CAPTAIN' : 'PLAYER'}
                  </button>
                  <button
                    onClick={() => handleRemoveTeam(acc, t.team)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '2px 8px', fontFamily, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Add team row */}
            {addingFor === acc.login ? (
              <div style={{ display: 'flex', gap: 6, marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                <select
                  value={newTeam}
                  onChange={e => setNewTeam(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', fontFamily, fontSize: 12, textTransform: 'uppercase' }}
                >
                  <option value="">SELECT TEAM</option>
                  {allTeams
                    .filter(t => !(acc.teams || []).some(at => at.team === t.name))
                    .map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', fontFamily, fontSize: 12, textTransform: 'uppercase' }}
                >
                  <option value="player">PLAYER</option>
                  <option value="captain">CAPTAIN</option>
                </select>
                <button
                  onClick={() => handleAddTeam(acc)}
                  disabled={saving || !newTeam}
                  style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontFamily, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  {saving ? '...' : 'ADD'}
                </button>
                <button
                  onClick={() => { setAddingFor(null); setNewTeam(''); setNewRole('player'); }}
                  style={{ background: '#e8e8e8', color: '#000', border: 'none', borderRadius: 6, padding: '6px 10px', fontFamily, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAddingFor(acc.login); setNewTeam(''); setNewRole('player'); }}
                style={{ marginTop: 10, width: '100%', padding: '6px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: 6, fontFamily, fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', borderTop: '1px solid #eee' }}
              >
                + ADD TEAM
              </button>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
