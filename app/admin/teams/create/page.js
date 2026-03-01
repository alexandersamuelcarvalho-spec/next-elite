'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';

export default function CreateTeamPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: 12,
    background: '#fff',
    color: '#000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    textTransform: 'uppercase',
    outline: 'none',
    marginBottom: 14,
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
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase' }}>
          CREATE TEAM
        </div>

        <input style={inputStyle} placeholder="TEAM NAME" value={name} onChange={e => setName(e.target.value)} />
        <input style={inputStyle} placeholder="CAPTAIN NAME" value={captain} onChange={e => setCaptain(e.target.value)} />
        <input style={inputStyle} placeholder="CAPTAIN PHONE" value={captainPhone} onChange={e => setCaptainPhone(e.target.value)} />

        <button
          onClick={handleCreate}
          disabled={saving}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: saving ? '#888' : '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </PageLayout>
  );
}
