import { NextResponse } from 'next/server';

export async function GET() {
  const results = {};

  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  results.keyStartsWith = rawKey.substring(0, 30);
  results.keyEndsWith = rawKey.substring(rawKey.length - 30);
  results.keyLength = rawKey.length;
  results.keyHasLiteralBackslashN = rawKey.includes('\\n');
  results.keyHasRealNewlines = rawKey.includes('\n');
  results.keyHasBeginHeader = rawKey.includes('BEGIN PRIVATE KEY');

  try {
    const { getAllAccounts } = await import('../../../lib/sheets');
    const accounts = await getAllAccounts();
    results.connected = true;
    results.accountCount = accounts.length;
  } catch (err) {
    results.connected = false;
    results.error = err.message;
  }

  return NextResponse.json(results);
}
