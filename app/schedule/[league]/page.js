'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import { MatchCard } from '../../../components/MatchCard';
import { HamburgerIcon } from '../../../components/UIComponents';

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const leagueName = decodeURIComponent(params.league || '');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(`/api/sheets?type=matches&league=${encodeURIComponent(leagueName)}`)
      .then(r => r.json())
      .then(setMatches)
      .catch(() => setMatches([]));
  }, [leagueName]);

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* League name header */}
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

        {/* Match cards */}
        {matches.map(match => (
          <MatchCard key={match.matchId} match={match} />
        ))}

        {matches.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontFamily: 'Copperplate, serif', marginTop: 40 }}>
            NO MATCHES SCHEDULED
          </p>
        )}
      </div>
    </PageLayout>
  );
}
