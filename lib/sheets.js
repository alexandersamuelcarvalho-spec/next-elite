// lib/sheets.js
// Google Sheets integration for NextElite Website Data
// Uses google-spreadsheet library

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

// Sheet indices (0-based)
const SHEETS = {
  ALL_ACCOUNTS: 0,
  ALL_TEAMS: 1,
  ALL_LEAGUES: 2,
  ALL_LOCATIONS: 3,
  // League sheets start at index 4+
};

let doc = null;

async function getDoc() {
  if (doc) return doc;

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const newDoc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  await newDoc.loadInfo();
  doc = newDoc;
  return doc;
}

// ===== ACCOUNTS (Sheet 1) =====
export async function getAllAccounts() {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    accountName: row.get('Account Name'),
    phoneNumber: row.get('Phone Number'),
    loginType: row.get('Type of Login (FB or G)'),
    login: row.get('Login (FB or G)'),
    status: row.get('Status'),
    teams: extractTeamRoles(row),
  }));
}

function extractTeamRoles(row) {
  const teamsJson = row.get('Teams');
  if (!teamsJson) return [];
  try {
    return JSON.parse(teamsJson);
  } catch {
    return [];
  }
}

export async function updateAccountStatus(accountName, status) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('Account Name') === accountName);
  if (row) {
    row.set('Status', status);
    await row.save();
  }
}

export async function createAccount(accountData) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
  await sheet.addRow({
    'Account Name': accountData.name,
    'Phone Number': accountData.phone || '',
    'Type of Login (FB or G)': accountData.loginType,
    'Login (FB or G)': accountData.login,
    'Status': accountData.status || 'user',
    'Teams': JSON.stringify(accountData.teams || []),
  });
}

export async function updateAccountTeams(login, teams) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('Login (FB or G)') === login);
  if (row) {
    row.set('Teams', JSON.stringify(teams));
    await row.save();
  }
}

export async function updateAccountPhone(login, phone) {
  const doc = await getDoc();
  const accountsSheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
  const accountRows = await accountsSheet.getRows();
  const accountRow = accountRows.find(r => r.get('Login (FB or G)') === login);
  if (!accountRow) return;

  accountRow.set('Phone Number', phone);
  await accountRow.save();

  // Sync phone to Captains' # in ALL TEAMS for every team they captain
  const accountName = accountRow.get('Account Name');
  const teamsSheet = doc.sheetsByIndex[SHEETS.ALL_TEAMS];
  const teamRows = await teamsSheet.getRows();
  for (const teamRow of teamRows) {
    if (teamRow.get('Captains') === accountName) {
      teamRow.set("Captains' #", phone);
      await teamRow.save();
    }
  }
}

// ===== TEAMS (Sheet 2) =====
export async function getAllTeams() {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_TEAMS];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    name: row.get('Teams'),
    captain: row.get('Captains'),
    captainPhone: row.get("Captains' #"),
    leagues: row.get("(LEAGUE)'s")?.split(', ') || [],
    totalLeagues: parseInt(row.get('Total Leagues') || '0'),
    totalPlayed: parseInt(row.get('Total Games Played') || '0'),
    totalWins: parseInt(row.get('Total Wins') || '0'),
    totalDraws: parseInt(row.get('Total Draws') || '0'),
    totalLosses: parseInt(row.get('Total Losses') || '0'),
    totalGoalsDone: parseInt(row.get('Total Goals Done') || '0'),
    totalGoalsAgainst: parseInt(row.get('Total Goals Against') || '0'),
    totalGoalDiff: parseInt(row.get('Total Goal Difference') || '0'),
    totalPoints: parseInt(row.get('Total Points') || '0'),
  }));
}

export async function createTeam(teamData) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_TEAMS];
  // Must load headers before addRow so column names are mapped correctly
  await sheet.loadHeaderRow();
  await sheet.addRow({
    'Teams': teamData.name,
    'Captains': teamData.captain,
    "Captains' #": teamData.captainPhone,
    "(LEAGUE)'s": teamData.leagues?.join(', ') || '',
    'Total Leagues': '0',
    'Total Games Played': '0',
    'Total Wins': '0',
    'Total Draws': '0',
    'Total Losses': '0',
    'Total Goals Done': '0',
    'Total Goals Against': '0',
    'Total Goal Difference': '0',
    'Total Points': '0',
  });

  // Sync captain role to ALL ACCOUNTS
  if (teamData.captain) {
    const accountsSheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
    const accountRows = await accountsSheet.getRows();
    const accountRow = accountRows.find(r => r.get('Account Name') === teamData.captain);
    if (accountRow) {
      const teams = JSON.parse(accountRow.get('Teams') || '[]');
      const alreadyCaptain = teams.some(t => t.team === teamData.name && t.role?.toLowerCase() === 'captain');
      if (!alreadyCaptain) {
        teams.push({ team: teamData.name, role: 'Captain' });
        accountRow.set('Teams', JSON.stringify(teams));
        await accountRow.save();
      }
    }
  }
}

export async function updateTeam(teamName, updates) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_TEAMS];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('Teams') === teamName);
  if (!row) return;

  const oldCaptainName = row.get('Captains');
  Object.entries(updates).forEach(([key, val]) => row.set(key, val));
  await row.save();

  // Sync captain change to ALL ACCOUNTS
  if (updates['Captains'] !== undefined) {
    const newCaptainName = updates['Captains'];
    const accountsSheet = doc.sheetsByIndex[SHEETS.ALL_ACCOUNTS];
    const accountRows = await accountsSheet.getRows();

    // Remove Captain role for this team from old captain's account
    if (oldCaptainName && oldCaptainName !== newCaptainName) {
      const oldRow = accountRows.find(r => r.get('Account Name') === oldCaptainName);
      if (oldRow) {
        const teams = JSON.parse(oldRow.get('Teams') || '[]');
        const updated = teams.filter(t => !(t.team === teamName && t.role?.toLowerCase() === 'captain'));
        oldRow.set('Teams', JSON.stringify(updated));
        await oldRow.save();
      }
    }

    // Add Captain role for this team to new captain's account
    if (newCaptainName) {
      const newRow = accountRows.find(r => r.get('Account Name') === newCaptainName);
      if (newRow) {
        const teams = JSON.parse(newRow.get('Teams') || '[]');
        const existingIdx = teams.findIndex(t => t.team === teamName && t.role?.toLowerCase() === 'captain');
        if (existingIdx < 0) {
          teams.push({ team: teamName, role: 'Captain' });
          newRow.set('Teams', JSON.stringify(teams));
          await newRow.save();
        }
      }
    }
  }
}

// ===== LEAGUES (Sheet 3) =====
export async function getAllLeagues() {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_LEAGUES];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    name: row.get('League'),
    location: row.get('Location'),
    day: row.get('Day'),
    division: row.get('Division'),
    month: row.get('Month'),
    status: row.get('Status'), // 'On Going' | 'Past'
    price: parseFloat(row.get('Price') || '0'),
  }));
}

export async function createLeague(leagueData) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_LEAGUES];
  await sheet.addRow({
    'League': leagueData.name,
    'Location': leagueData.location,
    'Day': leagueData.day,
    'Division': leagueData.division,
    'Month': leagueData.month,
    'Status': leagueData.status || 'On Going',
    'Price': leagueData.price || '0',
  });
  // Create a new sheet for this league
  await createLeagueSheet(leagueData.name);
}

export async function updateLeague(leagueName, updates) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_LEAGUES];
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('League') === leagueName);
  if (row) {
    Object.entries(updates).forEach(([key, val]) => row.set(key, val));
    await row.save();
  }
}

// ===== LOCATIONS (Sheet 4) =====
export async function getAllLocations() {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_LOCATIONS];
  const rows = await sheet.getRows();
  return rows.map(row => row.get('Locations')).filter(Boolean);
}

export async function addLocation(locationName) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[SHEETS.ALL_LOCATIONS];
  const rows = await sheet.getRows();
  // Keep alphabetical order
  await sheet.addRow({ 'Locations': locationName });
}

// ===== LEAGUE SHEET (Sheet 5+) =====
async function getLeagueSheet(leagueName) {
  const doc = await getDoc();
  return doc.sheetsByTitle[leagueName];
}

async function createLeagueSheet(leagueName) {
  const doc = await getDoc();
  const newSheet = await doc.addSheet({ title: leagueName });
  await newSheet.setHeaderRow([
    'Teams', 'Played', 'Wins', 'Draws', 'Losses', 'Goals Done', 'Goals Against', 'Goal Difference', 'Points', 'Paid',
    'DIVIDER',
    'MatchID', 'Month', 'Date', 'Time', 'Home Team', 'Home Score', 'Away Team', 'Away Score', 'Winner', 'Loser', 'League or Final'
  ]);
  return newSheet;
}

export async function getLeagueTable(leagueName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return [];
  const rows = await sheet.getRows();
  return rows
    .filter(row => row.get('Teams'))
    .map(row => ({
      team: row.get('Teams'),
      played: parseInt(row.get('Played') || '0'),
      wins: parseInt(row.get('Wins') || '0'),
      draws: parseInt(row.get('Draws') || '0'),
      losses: parseInt(row.get('Losses') || '0'),
      goalsDone: parseInt(row.get('Goals Done') || '0'),
      goalsAgainst: parseInt(row.get('Goals Against') || '0'),
      goalDiff: parseInt(row.get('Goal Difference') || '0'),
      points: parseInt(row.get('Points') || '0'),
      paid: row.get('Paid'),
    }))
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsDone - a.goalsDone);
}

export async function getLeagueMatches(leagueName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return [];
  const rows = await sheet.getRows();
  return rows
    .filter(row => row.get('MatchID'))
    .map(row => ({
      matchId: row.get('MatchID'),
      month: row.get('Month'),
      date: row.get('Date'),
      time: row.get('Time'),
      homeTeam: row.get('Home Team'),
      homeScore: row.get('Home Score') || '00',
      awayTeam: row.get('Away Team'),
      awayScore: row.get('Away Score') || '00',
      winner: row.get('Winner'),
      loser: row.get('Loser'),
      type: row.get('League or Final') || 'League',
    }))
    .sort((a, b) => {
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return (months.indexOf(a.month) - months.indexOf(b.month)) || (parseInt(a.date) - parseInt(b.date)) || a.time?.localeCompare(b.time);
    });
}

export async function updateLeaguePaid(leagueName, teamName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('Teams') === teamName);
  if (row) {
    row.set('Paid', 'Paid');
    await row.save();
  }
}

export async function addMatchToLeague(leagueName, matchData) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  
  // Generate MatchID
  const matchId = generateMatchId(matchData);
  
  await sheet.addRow({
    'MatchID': matchId,
    'Month': matchData.month,
    'Date': matchData.date,
    'Time': matchData.time,
    'Home Team': matchData.homeTeam,
    'Home Score': matchData.homeScore || '',
    'Away Team': matchData.awayTeam,
    'Away Score': matchData.awayScore || '',
    'Winner': matchData.winner || '',
    'Loser': matchData.loser || '',
    'League or Final': matchData.type || 'League',
  });
  
  // Update table stats if scores are entered
  if (matchData.homeScore !== '' && matchData.awayScore !== '') {
    await updateLeagueTableStats(leagueName);
  }
}

export async function updateMatch(leagueName, matchId, matchData) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('MatchID') === matchId);
  if (row) {
    // Map frontend camelCase keys to sheet column names
    if (matchData.month !== undefined) row.set('Month', matchData.month);
    if (matchData.date !== undefined) row.set('Date', matchData.date);
    if (matchData.time !== undefined) row.set('Time', matchData.time);
    if (matchData.homeTeam !== undefined) row.set('Home Team', matchData.homeTeam);
    if (matchData.awayTeam !== undefined) row.set('Away Team', matchData.awayTeam);
    if (matchData.homeScore !== undefined) row.set('Home Score', matchData.homeScore);
    if (matchData.awayScore !== undefined) row.set('Away Score', matchData.awayScore);
    if (matchData.type !== undefined) row.set('League or Final', matchData.type);

    // Auto-calculate winner/loser only if scores are entered
    const homeScoreStr = matchData.homeScore ?? row.get('Home Score');
    const awayScoreStr = matchData.awayScore ?? row.get('Away Score');
    if (homeScoreStr !== '' && homeScoreStr != null && awayScoreStr !== '' && awayScoreStr != null) {
      const homeScore = parseInt(homeScoreStr);
      const awayScore = parseInt(awayScoreStr);
      const homeTeam = matchData.homeTeam || row.get('Home Team');
      const awayTeam = matchData.awayTeam || row.get('Away Team');
      if (homeScore > awayScore) { row.set('Winner', homeTeam); row.set('Loser', awayTeam); }
      else if (awayScore > homeScore) { row.set('Winner', awayTeam); row.set('Loser', homeTeam); }
      else { row.set('Winner', 'Draw'); row.set('Loser', 'Draw'); }
    }

    await row.save();
    await updateLeagueTableStats(leagueName);
  }
}

export async function deleteMatch(leagueName, matchId) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  const rows = await sheet.getRows();
  const row = rows.find(r => r.get('MatchID') === matchId);
  if (row) {
    await row.delete();
    await updateLeagueTableStats(leagueName);
  }
}

async function updateLeagueTableStats(leagueName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  const allRows = await sheet.getRows();
  
  // Get all teams from table side
  const teamRows = allRows.filter(r => r.get('Teams') && !r.get('MatchID'));
  const matchRows = allRows.filter(r => r.get('MatchID') && r.get('League or Final') !== 'Final');
  
  for (const teamRow of teamRows) {
    const teamName = teamRow.get('Teams');
    let played = 0, wins = 0, draws = 0, losses = 0, goalsDone = 0, goalsAgainst = 0;
    
    for (const match of matchRows) {
      const homeScoreStr = match.get('Home Score');
      const awayScoreStr = match.get('Away Score');

      // Skip unplayed matches — only count if both scores have been entered
      if (homeScoreStr === '' || homeScoreStr == null || awayScoreStr === '' || awayScoreStr == null) continue;

      const homeTeam = match.get('Home Team');
      const awayTeam = match.get('Away Team');
      const homeScore = parseInt(homeScoreStr);
      const awayScore = parseInt(awayScoreStr);

      if (homeTeam === teamName) {
        played++;
        goalsDone += homeScore;
        goalsAgainst += awayScore;
        if (homeScore > awayScore) wins++;
        else if (homeScore === awayScore) draws++;
        else losses++;
      } else if (awayTeam === teamName) {
        played++;
        goalsDone += awayScore;
        goalsAgainst += homeScore;
        if (awayScore > homeScore) wins++;
        else if (awayScore === homeScore) draws++;
        else losses++;
      }
    }
    
    teamRow.set('Played', played.toString());
    teamRow.set('Wins', wins.toString());
    teamRow.set('Draws', draws.toString());
    teamRow.set('Losses', losses.toString());
    teamRow.set('Goals Done', goalsDone.toString());
    teamRow.set('Goals Against', goalsAgainst.toString());
    teamRow.set('Goal Difference', (goalsDone - goalsAgainst).toString());
    teamRow.set('Points', (wins * 3 + draws).toString());
    await teamRow.save();
  }
}

function generateMatchId(matchData) {
  const loc = (matchData.location || 'LOC').substring(0, 3).toUpperCase();
  const day = (matchData.day || 'MON').substring(0, 3).toUpperCase();
  const div = (matchData.division || 'OPN').replace(/\s/g, '').toUpperCase();
  const month = String(matchData.date || '01').padStart(2, '0');
  const num = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
  return `${loc}${day}${div}${month}${num}`;
}

export async function addTeamToLeague(leagueName, teamName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  
  // Add team to table side
  await sheet.addRow({ 'Teams': teamName, 'Played': '0', 'Wins': '0', 'Draws': '0', 'Losses': '0', 'Goals Done': '0', 'Goals Against': '0', 'Goal Difference': '0', 'Points': '0', 'Paid': '0/0' });
  
  // Update All Teams sheet
  const doc = await getDoc();
  const allTeamsSheet = doc.sheetsByIndex[SHEETS.ALL_TEAMS];
  const teamRows = await allTeamsSheet.getRows();
  const teamRow = teamRows.find(r => r.get('Teams') === teamName);
  if (teamRow) {
    const currentLeagues = teamRow.get("(LEAGUE)'s") || '';
    const leagueList = currentLeagues ? currentLeagues.split(', ') : [];
    if (!leagueList.includes(leagueName)) {
      leagueList.push(leagueName);
      teamRow.set("(LEAGUE)'s", leagueList.join(', '));
      teamRow.set('Total Leagues', leagueList.length.toString());
      await teamRow.save();
    }
  }
}

// ===== BRACKET =====
export async function getBracketWinners(leagueName) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return { box5Winner: null, box6Winner: null, champion: null };
  const rows = await sheet.getRows();
  const bracketRow = rows.find(r => r.get('MatchID') === 'BRACKET');
  if (!bracketRow) return { box5Winner: null, box6Winner: null, champion: null };
  return {
    box5Winner: bracketRow.get('Box5Winner'),
    box6Winner: bracketRow.get('Box6Winner'),
    champion: bracketRow.get('Champion'),
  };
}

export async function setBracketWinner(leagueName, box, winner, isChampion) {
  const sheet = await getLeagueSheet(leagueName);
  if (!sheet) return;
  const rows = await sheet.getRows();
  let bracketRow = rows.find(r => r.get('MatchID') === 'BRACKET');
  if (!bracketRow) {
    await sheet.addRow({ 'MatchID': 'BRACKET' });
    const updatedRows = await sheet.getRows();
    bracketRow = updatedRows.find(r => r.get('MatchID') === 'BRACKET');
  }
  if (box === 5) bracketRow.set('Box5Winner', winner);
  if (box === 6) bracketRow.set('Box6Winner', winner);
  if (isChampion !== undefined) bracketRow.set('Champion', isChampion ? winner : '');
  await bracketRow.save();
}
