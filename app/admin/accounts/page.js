'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../../../components/PageLayout';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('/api/sheets?type=accounts').then(r => r.json()).then(setAccounts).catch(() => {});
  }, []);

  const handleToggleAdmin = async (accountName, currentStatus) => {
    const newStatus = currentStatus === 'Admin' ? 'user' : 'Admin';
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAccountStatus', data: { accountName, status: newStatus } }),
    });
    setAccounts(prev => prev.map(a => a.accountName === accountName ? { ...a, status: newStatus } : a));
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#000', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', textTransform: 'uppercase' }}>
          ACCOUNTS
        </div>

        {accounts.map(acc => (
          <div key={acc.accountName} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 14, fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', color: '#000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{acc.accountName}</span>
              <button
                onClick={() => handleToggleAdmin(acc.accountName, acc.status)}
                style={{ background: acc.status === 'Admin' ? '#000' : '#e8e8e8', color: acc.status === 'Admin' ? '#fff' : '#000', border: 'none', borderRadius: 6, padding: '4px 12px', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: 12, textTransform: 'uppercase' }}
              >
                {acc.status === 'Admin' ? 'ADMIN' : 'USER'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{acc.phoneNumber}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{acc.loginType}: {acc.login}</div>
            {(acc.teams || []).map(t => (
              <div key={t.team} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderTop: '1px solid #eee', fontSize: 12 }}>
                <span>{t.team}</span>
                <span style={{ background: t.role === 'Captain' ? '#000' : '#e8e8e8', color: t.role === 'Captain' ? '#fff' : '#000', padding: '1px 8px', borderRadius: 4 }}>{t.role}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
