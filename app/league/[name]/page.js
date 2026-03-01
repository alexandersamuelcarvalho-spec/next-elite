'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import LeagueTable from '../../../components/LeagueTable';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function LeaguePage() {
  const router = useRouter();
  const params = useParams();
  const leagueName = decodeURIComponent(params.name || '');
  const [tableData, setTableData] = useState([]);
  const [league, setLeague] = useState(null);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(data => {
      setLeagues(data);
      setLeague(data.find(l => l.name === leagueName));
    }).catch(() => {});

    fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`)
      .then(r => r.json())
      .then(setTableData)
      .catch(() => {});
  }, [leagueName]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* League title with hamburger */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '18px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#000',
            fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {leagueName || '(LEAGUE)'}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* League info */}
        {league && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 20, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>LOCATION</span>
              <span style={{ background: '#000', color: '#fff', padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>{league.location}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>DAY</span>
              <span style={{ background: '#000', color: '#fff', padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>{league.day}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>DIVISION</span>
              <span style={{ background: '#000', color: '#fff', padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>{league.division}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>MONTH</span>
              <span style={{ background: '#000', color: '#fff', padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>{league.month}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>STATUS</span>
              <span style={{ background: league.status === 'On Going' ? '#22c55e' : '#888', color: '#fff', padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>{league.status}</span>
            </div>
          </div>
        )}

        {/* League Table */}
        <LeagueTable teams={tableData} />

        {/* Navigation buttons */}
        <button
          onClick={() => router.push(`/bracket/${encodeURIComponent(leagueName)}`)}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}
        >
          PLAYOFF BRACKET
        </button>
        <button
          onClick={() => router.push(`/schedule/${encodeURIComponent(leagueName)}`)}
          style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: 999, background: '#fff', color: '#000', border: '2px solid #fff', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14 }}
        >
          SCHEDULE
        </button>
      </div>
    </PageLayout>
  );
}
