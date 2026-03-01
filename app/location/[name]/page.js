'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function LocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationName = decodeURIComponent(params.name || '');
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=leagues')
      .then(r => r.json())
      .then(data => setLeagues(data.filter(l => l.location === locationName)))
      .catch(() => {});
  }, [locationName]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Location title with hamburger */}
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
            {locationName || '(LOCATION)'}
          </span>
          <HamburgerIcon color="#000" />
        </div>

        {/* League buttons */}
        {leagues.map(league => (
          <button
            key={league.name}
            onClick={() => router.push(`/league/${encodeURIComponent(league.name)}`)}
            style={{
              width: '100%',
              padding: '18px 20px',
              fontSize: '20px',
              borderRadius: 999,
              background: '#fff',
              color: '#000',
              border: '2px solid #fff',
              fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              marginBottom: 14,
              transition: 'all 0.18s',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {league.name}
          </button>
        ))}

        {leagues.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily: 'Copperplate, serif', marginTop: 40 }}>
            NO LEAGUES FOUND
          </p>
        )}
      </div>
    </PageLayout>
  );
}
