'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../../components/PageLayout';
import LeagueTable from '../../../../components/LeagueTable';
import { HamburgerIcon } from '../../../../components/UIComponents';

export default function PlayerTablePage() {
  const router = useRouter();
  const params = useParams();
  const leagueName = decodeURIComponent(params.league || '');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`)
      .then(r => r.json()).then(setTableData).catch(() => {});
  }, [leagueName]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {leagueName || '(TEAM)'}
          </span>
          <HamburgerIcon color="#000" />
        </div>
        <LeagueTable teams={tableData} />
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
