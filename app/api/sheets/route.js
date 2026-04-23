import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Generic sheets data endpoint
// GET /api/sheets?type=leagues|teams|locations|accounts|table&league=name&matches=true

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const leagueName = searchParams.get('league');
    const includeMatches = searchParams.get('matches') === 'true';

    // Use mock data in development if sheets not configured
    if (!process.env.GOOGLE_SHEETS_ID) {
      const { mockLeagues, mockTeams, mockLocations, mockAccounts, mockTableData, mockMatches, mockBrackets } = await import('../../../lib/mockData');
      
      if (type === 'leagues') return NextResponse.json(mockLeagues);
      if (type === 'teams') return NextResponse.json(mockTeams);
      if (type === 'locations') return NextResponse.json(mockLocations);
      if (type === 'accounts') return NextResponse.json(mockAccounts);
      if (type === 'table' && leagueName) return NextResponse.json(mockTableData[leagueName] || []);
      if (type === 'matches' && leagueName) return NextResponse.json(mockMatches[leagueName] || []);
      if (type === 'bracket' && leagueName) return NextResponse.json(mockBrackets[leagueName] || {});
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    const { getAllLeagues, getAllTeams, getAllLocations, getAllAccounts, getLeagueTable, getLeagueMatches, getBracketWinners } = await import('../../../lib/sheets');

    if (type === 'leagues') return NextResponse.json(await getAllLeagues());
    if (type === 'teams') return NextResponse.json(await getAllTeams());
    if (type === 'locations') return NextResponse.json(await getAllLocations());
    if (type === 'accounts') return NextResponse.json(await getAllAccounts());
    if (type === 'table' && leagueName) return NextResponse.json(await getLeagueTable(leagueName));
    if (type === 'matches' && leagueName) return NextResponse.json(await getLeagueMatches(leagueName));
    if (type === 'bracket' && leagueName) return NextResponse.json(await getBracketWinners(leagueName));

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (err) {
    console.error('Sheets API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const { action } = body;

    if (!process.env.GOOGLE_SHEETS_ID) {
      return NextResponse.json({ success: true, message: 'Mock mode - no actual changes made' });
    }

    const sheets = await import('../../../lib/sheets');

    if (action === 'createTeam') {
      await sheets.createTeam(body.data);
    } else if (action === 'createLeague') {
      await sheets.createLeague(body.data);
    } else if (action === 'addLocation') {
      await sheets.addLocation(body.data.name);
    } else if (action === 'addTeamToLeague') {
      await sheets.addTeamToLeague(body.data.leagueName, body.data.teamName);
    } else if (action === 'addMatch') {
      await sheets.addMatchToLeague(body.data.leagueName, body.data.match);
    } else if (action === 'updateMatch') {
      await sheets.updateMatch(body.data.leagueName, body.data.matchId, body.data.updates);
    } else if (action === 'deleteMatch') {
      await sheets.deleteMatch(body.data.leagueName, body.data.matchId);
    } else if (action === 'updateLeague') {
      await sheets.updateLeague(body.data.leagueName, body.data.updates);
    } else if (action === 'updateAccountStatus') {
      await sheets.updateAccountStatus(body.data.accountName, body.data.status);
    } else if (action === 'updateAccountTeams') {
      await sheets.updateAccountTeams(body.data.login, body.data.teams);
    } else if (action === 'setBracketWinner') {
      await sheets.setBracketWinner(body.data.leagueName, body.data.box, body.data.winner, body.data.isChampion);
    } else if (action === 'updateTeam') {
      await sheets.updateTeam(body.data.teamName, body.data.updates);
    } else if (action === 'updateAccountPhone') {
      await sheets.updateAccountPhone(body.data.login, body.data.phone);
    } else if (action === 'updateLeaguePaid') {
      await sheets.updateLeaguePaid(body.data.leagueName, body.data.teamName);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Sheets POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
