'use client';
import PageLayout from '../../components/PageLayout';

export default function WelcomePage() {
  const handleInstagram = () => window.open('https://instagram.com/nextelitesoccer', '_blank');
  const handleFacebook = () => window.open('https://facebook.com/nextelitesoccer', '_blank');
  const handleCaptain = () => window.location.href = '/login';

  const iconBtn = {
    background: '#fff',
    border: '2px solid #fff',
    borderRadius: 12,
    width: 90,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.18s',
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Welcome box */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px 20px',
          marginBottom: 28,
          color: '#000',
        }}>
          <h1 style={{
            fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
            fontWeight: 900,
            fontSize: '28px',
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            WELCOME
          </h1>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            textAlign: 'center',
            lineHeight: 1.7,
            textTransform: 'none',
            color: '#000',
          }}>
            Welcome to Next Elite Soccer! We're taking over DFW with our Monday through Sunday Soccer Leagues. New Team Captains please register a new account by clicking the Captain icon below on the left. Then contact us. If you're a new Player or Team wondering how to join us or wanting more information please contact us at our Instagram or email us. Click the icon in the middle to redirect you to our Instagram or the icon on the right to copy our email address.
          </p>
        </div>

        {/* Bottom action row */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {/* Captain button */}
          <button
            onClick={handleCaptain}
            style={iconBtn}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
                fontWeight: 900,
                fontSize: '13px',
                color: '#000',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                CAPTAIN
              </div>
            </div>
          </button>

          {/* Instagram */}
          <button onClick={handleInstagram} style={iconBtn}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            style={iconBtn}
            title="Copy email"
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#000">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
