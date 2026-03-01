'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import BracketView from '../../../components/BracketView';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function BracketPage() {
  const router = useRouter();
  const params = useParams();
  const leagueName = decodeURIComponent(params.league || '');
  const [tableData, setTableData] = useState([]);
  const [bracket, setBracket] = useState({});

  useEffect(() => {
    fetch(`/api/sheets?type=table&league=${encodeURIComponent(leagueName)}`)
      .then(r => r.json()).then(setTableData).catch(() => {});
    fetch(`/api/sheets?type=bracket&league=${encodeURIComponent(leagueName)}`)
      .then(r => r.json()).then(setBracket).catch(() => {});
  }, [leagueName]);

  const top4 = tableData.slice(0, 4);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* League header */}
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
            {leagueName || '(TEAM)'}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* Bracket */}
        <BracketView teams={top4} bracket={bracket} />

        {/* League Table button */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => router.push(`/league/${encodeURIComponent(leagueName)}`)}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              borderRadius: 999,
              background: '#fff',
              color: '#000',
              border: '2px solid #fff',
              fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            LEAGUE TABLE
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
