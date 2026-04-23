'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';

const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

export default function CreateTeamPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('/api/sheets?type=accounts').then(r => r.json()).then(setAccounts).catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = accounts.filter(a => {
    const displayName = a.accountName || a.name || '';
    return displayName.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (account) => {
    const displayName = account.accountName || account.name || '';
    setCaptain(displayName);
    setSearch(displayName);
    setCaptainPhone(account.phoneNumber || '');
    setShowDropdown(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: 12,
    background: '#fff',
    color: '#000',
    border: '2px solid #fff',
    fontFamily,
    textTransform: 'uppercase',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert('Team name required');
    setSaving(true);
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createTeam', data: { name: name.toUpperCase(), captain, captainPhone } }),
      });
      router.push('/admin/teams');
    } catch (err) {
      alert('Error creating team: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily, textTransform: 'uppercase' }}>
          CREATE TEAM
        </div>

        <input
          style={{ ...inputStyle, marginBottom: 14 }}
          placeholder="TEAM NAME"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        {/* Searchable captain dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 14 }}>
          <input
            style={inputStyle}
            placeholder="SEARCH CAPTAIN"
            value={search}
            onChange={e => { setSearch(e.target.value); setCaptain(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filtered.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: 12,
              marginTop: 4,
              maxHeight: 220,
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              {filtered.map(account => {
                const displayName = account.accountName || account.name || '';
                return (
                  <div
                    key={account.login}
                    onMouseDown={() => handleSelect(account)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontFamily,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#000',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{displayName}</span>
                    {account.phoneNumber && (
                      <span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>{account.phoneNumber}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Phone — auto-filled, still editable */}
        <input
          style={{ ...inputStyle, marginBottom: 24 }}
          placeholder="CAPTAIN PHONE"
          value={captainPhone}
          onChange={e => setCaptainPhone(e.target.value)}
        />

        <button
          onClick={handleCreate}
          disabled={saving}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: saving ? '#888' : '#fff', color: '#000', border: '2px solid #fff', fontFamily, fontWeight: 700, textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </PageLayout>
  );
}
