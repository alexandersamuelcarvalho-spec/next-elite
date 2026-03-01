'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../../../components/PageLayout';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sheets?type=locations').then(r => r.json()).then(setLocations).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!newLocation.trim()) return;
    setSaving(true);
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addLocation', data: { name: newLocation.toUpperCase() } }),
    });
    setLocations(prev => [...prev, newLocation.toUpperCase()].sort());
    setNewLocation('');
    setSaving(false);
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase' }}>
          LOCATIONS
        </div>

        {/* Add location */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            style={{ flex: 1, padding: '14px 16px', fontSize: '16px', borderRadius: 12, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', outline: 'none' }}
            placeholder="NEW LOCATION NAME"
            value={newLocation}
            onChange={e => setNewLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} disabled={saving} style={{ padding: '14px 20px', borderRadius: 12, background: saving ? '#888' : '#fff', color: '#000', border: 'none', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
            ADD
          </button>
        </div>

        {/* Location list (alphabetical) */}
        {[...locations].sort().map(loc => (
          <div
            key={loc}
            style={{ background: '#fff', borderRadius: 999, padding: '16px 20px', marginBottom: 12, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, fontSize: '16px', color: '#000', textTransform: 'uppercase' }}
          >
            {loc}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
