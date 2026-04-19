import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET() {
  const results = {};

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Step 1: try getting an access token
    try {
      const token = await auth.getAccessToken();
      results.tokenObtained = !!token?.token;
    } catch (err) {
      results.tokenError = err.message;
      return NextResponse.json(results);
    }

    // Step 2: try loading the spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, auth);
    try {
      await doc.loadInfo();
      results.docLoaded = true;
      results.docTitle = doc.title;
      results.sheetCount = doc.sheetCount;
    } catch (err) {
      results.docError = err.message;
      results.docErrorFull = JSON.stringify(err, Object.getOwnPropertyNames(err));
      return NextResponse.json(results);
    }

    // Step 3: try reading accounts
    try {
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      results.rowCount = rows.length;
    } catch (err) {
      results.readError = err.message;
    }

  } catch (err) {
    results.unexpectedError = err.message;
  }

  return NextResponse.json(results);
}
