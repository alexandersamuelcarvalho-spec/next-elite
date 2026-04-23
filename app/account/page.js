'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useApp } from '../../context/AppContext';
import PageLayout from '../../components/PageLayout';

const fontFamily = 'Copperplate, "Copperplate Gothic Light", Cinzel, serif';

const btnStyle = {
  width: '100%',
  padding: '22px 20px',
  fontSize: '22px',
  borderRadius: 999,
  background: '#ffffff',
  color: '#000000',
  border: '2px solid #fff',
  fontFamily,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  marginBottom: 18,
};

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { userAccount } = useApp();

  const userName = session?.user?.name || userAccount?.name || '';
  const [phone, setPhone] = useState(session?.user?.phone || userAccount?.phone || '');

  const handleSavePhone = async () => {
    const login = session?.user?.email;
    if (!login || !phone) return;
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountPhone', data: { login, phone } }),
    });
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        {/* Title */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          fontFamily,
        }}>
          Account
        </div>

        {/* Player info card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 16, color: '#000', width: 120, textTransform: 'uppercase' }}>
              Player
            </span>
            <span style={{
              background: '#000',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 6,
              fontFamily,
              fontWeight: 700,
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>
              {userName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 16, color: '#000', width: 120, textTransform: 'uppercase' }}>
              Player #
            </span>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onBlur={handleSavePhone}
              placeholder="999-999-9999"
              style={{
                background: '#000',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: 6,
                fontFamily,
                fontWeight: 700,
                fontSize: 16,
                flex: 1,
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <button style={btnStyle} onClick={() => router.push('/captain/teams')}>
          Captain
        </button>
        <button style={btnStyle} onClick={() => router.push('/player/teams')}>
          Player
        </button>
        <button style={btnStyle} onClick={() => router.push('/schedule')}>
          Schedule
        </button>
      </div>
    </PageLayout>
  );
}
