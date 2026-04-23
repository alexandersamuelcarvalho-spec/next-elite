'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import PageLayout from '../../components/PageLayout';

export default function HomePage() {
  const router = useRouter();
  const { t, userRole } = useApp();

  const BtnStyle = {
    width: '100%',
    padding: '20px',
    fontSize: '22px',
    borderRadius: 999,
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #fff',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all 0.18s',
  };

  const handleNav = (path) => router.push(path);

  // Determine which home to show based on role
  if (userRole === 'admin') {
    return (
      <PageLayout>
        <div style={{ paddingTop: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '28px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
            {t('admin')}
          </div>
          {[
            { label: t('allTeams'), path: '/admin/teams' },
            { label: t('allLeagues'), path: '/admin/leagues' },
            { label: t('schedules'), path: '/admin/schedules' },
            { label: t('locations'), path: '/admin/locations' },
            { label: t('accounts'), path: '/admin/accounts' },
          ].map(item => (
            <button key={item.path} style={BtnStyle} onClick={() => handleNav(item.path)}>
              {item.label}
            </button>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (userRole === 'captain') {
    return (
      <PageLayout>
        <div style={{ paddingTop: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '28px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
            {t('captain')}
          </div>
          {[
            { label: t('teams'), path: '/captain/teams' },
            { label: t('schedules'), path: '/captain/schedules' },
            { label: t('locations'), path: '/captain/locations' },
            { label: t('payments'), path: '/captain/payments' },
          ].map(item => (
            <button key={item.path} style={BtnStyle} onClick={() => handleNav(item.path)}>
              {item.label}
            </button>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (userRole === 'player') {
    return (
      <PageLayout>
        <div style={{ paddingTop: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '28px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif' }}>
            {t('player')}
          </div>
          {[
            { label: t('teams'), path: '/player/teams' },
            { label: t('schedules'), path: '/player/schedules' },
            { label: t('locations'), path: '/player/locations' },
          ].map(item => (
            <button key={item.path} style={BtnStyle} onClick={() => handleNav(item.path)}>
              {item.label}
            </button>
          ))}
        </div>
      </PageLayout>
    );
  }

  // Guest / not logged in home
  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Logo big display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="Next Elite Soccer" style={{ width: 180, height: 180, objectFit: 'contain' }} />
        </div>

        <button style={BtnStyle} onClick={() => handleNav('/welcome')}>
          {t('welcome')}
        </button>
        <button style={BtnStyle} onClick={() => handleNav('/find-my-team')}>
          {t('findMyTeam')}
        </button>
        <button style={BtnStyle} onClick={() => handleNav('/login')}>
          {t('logIn')}
        </button>

      </div>
    </PageLayout>
  );
}
