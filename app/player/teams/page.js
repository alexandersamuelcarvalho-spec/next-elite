'use client';
import { useRouter } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';

export default function PlayerTeamsPage() {
  const router = useRouter();
  const btnStyle = {
    width: '100%',
    padding: '20px',
    fontSize: '22px',
    borderRadius: 999,
    background: '#fff',
    color: '#000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all 0.18s',
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          textTransform: 'uppercase',
        }}>
          PLAYER'S TEAMS
        </div>
        <button style={btnStyle} onClick={() => router.push('/player/teams/ongoing')}>ON GOING</button>
        <button style={btnStyle} onClick={() => router.push('/player/teams/past')}>PAST</button>
      </div>
    </PageLayout>
  );
}
