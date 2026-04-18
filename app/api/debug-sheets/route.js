import { NextResponse } from 'next/server';

export async function GET() {
  const results = {};

  results.hasSheetId = !!process.env.GOOGLE_SHEETS_ID;
  results.hasServiceEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  results.hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;

  try {
    const { getAllAccounts } = await import('../../../lib/sheets');
    const accounts = await getAllAccounts();
    results.connected = true;
    results.accountCount = accounts.length;
  } catch (err) {
    results.connected = false;
    results.error = err.message;
  }

  // Test write
  try {
    const { createAccount } = await import('../../../lib/sheets');
    await createAccount({
      name: 'TEST_ACCOUNT',
      phone: '',
      loginType: 'G',
      login: 'test@debug.com',
      status: 'user',
      teams: [],
    });
    results.writeSuccess = true;
  } catch (err) {
    results.writeSuccess = false;
    results.writeError = err.message;
  }

  return NextResponse.json(results);
}
