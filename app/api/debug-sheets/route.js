import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

export async function GET() {
  const raw = process.env.GOOGLE_PRIVATE_KEY || '';
  const replaced = raw.replace(/\\n/g, '\n');

  const results = {
    rawLength: raw.length,
    rawFirst50: raw.substring(0, 50),
    rawLast30: raw.substring(raw.length - 30),
    hasLiteralBackslashN: raw.includes('\\n'),
    hasRealNewlines: raw.includes('\n'),
    hasBeginHeader: raw.includes('BEGIN PRIVATE KEY'),
    hasEndFooter: raw.includes('END PRIVATE KEY'),
    replacedLength: replaced.length,
  };

  // Try with raw key
  try {
    const auth1 = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: raw,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    await auth1.getAccessToken();
    results.rawKeyWorks = true;
  } catch (err) {
    results.rawKeyWorks = false;
    results.rawKeyError = err.message;
  }

  // Try with replaced key
  try {
    const auth2 = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: replaced,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    await auth2.getAccessToken();
    results.replacedKeyWorks = true;
  } catch (err) {
    results.replacedKeyWorks = false;
    results.replacedKeyError = err.message;
  }

  return NextResponse.json(results);
}
