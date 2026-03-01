'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DIVISIONS = ['OPEN','DIV1','DIV2','DIV3'];

export default function CreateLeaguePage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [day, setDay] = useState('');
  const [division, setDivision] = useState('');
  const [month, setMonth] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sheets?type=locations').then(r => r.json()).then(setLocations).catch(() => {});
  }, []);

  const generateName = () => {
    if (!location || !day || !division || !month) return '(NEW LEAGUE)';
    const loc = location.substring(0, 3).toUpperCase();
    const d = day.substring(0, 3).toUpperCase();
    const div = division.toUpperCase();
    const m = month.substring(0, 3).toUpperCase();
    return `${loc} ${d} ${div} ${m}`;
  };

  const handleCreate = async () => {
    if (!location || !day || !division || !month) return alert('Please fill all fields');
    setSaving(true);
    const leagueName = generateName();
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createLeague', data: { name: leagueName, location, day, division, month, price: parseFloat(price) || 0, status: 'On Going' } }),
      });
      router.push('/admin/leagues');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: 12,
    background: '#000',
    color: '#fff',
    border: 'none',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    textTransform: 'uppercase',
    marginBottom: 14,
    cursor: 'pointer',
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 24, fontSize: '20px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', textAlign: 'center' }}>
          {generateName()}
        </div>

        <select style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
          <option value="">LOCATION</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select style={selectStyle} value={day} onChange={e => setDay(e.target.value)}>
          <option value="">DAY</option>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select style={selectStyle} value={division} onChange={e => setDivision(e.target.value)}>
          <option value="">DIVISION</option>
          {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select style={selectStyle} value={month} onChange={e => setMonth(e.target.value)}>
          <option value="">MONTH</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <input
          style={{ ...selectStyle, background: '#fff', color: '#000' }}
          placeholder="PRICE ($)"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <button
          onClick={handleCreate}
          disabled={saving}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: saving ? '#888' : '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', marginTop: 8 }}
        >
          {saving ? 'SAVING...' : 'CREATE LEAGUE'}
        </button>
      </div>
    </PageLayout>
  );
}
