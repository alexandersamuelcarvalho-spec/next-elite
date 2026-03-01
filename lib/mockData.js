// lib/mockData.js
// Mock data for development - replace with Google Sheets API calls in production

export const mockLocations = [
  'CROSSBAR DENTON',
  'CROSSBAR FORT WORTH',
  'STRIKEZONE DALLAS',
];

export const mockLeagues = [
  { name: 'CBD THU OPEN JAN', location: 'CROSSBAR DENTON', day: 'THURSDAY', division: 'OPEN', month: 'JANUARY', status: 'On Going', price: 500 },
  { name: 'CBD MON DIV1 FEB', location: 'CROSSBAR DENTON', day: 'MONDAY', division: 'DIV1', month: 'FEBRUARY', status: 'On Going', price: 600 },
  { name: 'CBF WED OPEN SEP', location: 'CROSSBAR FORT WORTH', day: 'WEDNESDAY', division: 'OPEN', month: 'SEPTEMBER', status: 'Past', price: 450 },
  { name: 'SZD SAT DIV2 OCT', location: 'STRIKEZONE DALLAS', day: 'SATURDAY', division: 'DIV2', month: 'OCTOBER', status: 'Past', price: 400 },
];

export const mockTeams = [
  { name: 'FC ELITE', captain: 'JOHN SMITH', captainPhone: '999-999-9999', leagues: ['CBD THU OPEN JAN'], paid: true },
  { name: 'DENTON UNITED', captain: 'MARIA GARCIA', captainPhone: '888-888-8888', leagues: ['CBD THU OPEN JAN', 'CBF WED OPEN SEP'], paid: false },
  { name: 'FORT WORTH FC', captain: 'JAMES BROWN', captainPhone: '777-777-7777', leagues: ['CBD MON DIV1 FEB'], paid: true },
  { name: 'DALLAS STARS', captain: 'SARAH LEE', captainPhone: '666-666-6666', leagues: ['CBD THU OPEN JAN', 'SZD SAT DIV2 OCT'], paid: false },
];

export const mockAccounts = [
  { accountName: 'johnsmit', phoneNumber: '999-999-9999', loginType: 'G', login: 'john.smith@gmail.com', status: 'Admin', teams: [{ team: 'FC ELITE', role: 'Captain' }] },
  { accountName: 'mariagar', phoneNumber: '888-888-8888', loginType: 'FB', login: 'maria.garcia', status: 'user', teams: [{ team: 'DENTON UNITED', role: 'Captain' }, { team: 'FORT WORTH FC', role: 'Player' }] },
  { accountName: 'jamesbro', phoneNumber: '777-777-7777', loginType: 'G', login: 'james.brown@gmail.com', status: 'user', teams: [{ team: 'FORT WORTH FC', role: 'Captain' }] },
];

export const mockTableData = {
  'CBD THU OPEN JAN': [
    { team: 'FC ELITE', played: 22, wins: 22, draws: 0, losses: 0, goalsDone: 88, goalsAgainst: 10, goalDiff: 78, points: 66 },
    { team: 'DENTON UNITED', played: 22, wins: 0, draws: 0, losses: 22, goalsDone: 10, goalsAgainst: 88, goalDiff: -78, points: 0 },
    { team: 'DALLAS STARS', played: 10, wins: 5, draws: 2, losses: 3, goalsDone: 20, goalsAgainst: 15, goalDiff: 5, points: 17 },
    { team: 'FORT WORTH FC', played: 10, wins: 3, draws: 1, losses: 6, goalsDone: 12, goalsAgainst: 18, goalDiff: -6, points: 10 },
  ],
};

export const mockMatches = {
  'CBD THU OPEN JAN': [
    { matchId: 'CBDTHUOPEN0101', month: 'JAN', date: '30', time: '12:12', homeTeam: 'FC ELITE', homeScore: '3', awayTeam: 'DENTON UNITED', awayScore: '0', winner: 'FC ELITE', loser: 'DENTON UNITED', type: 'League' },
    { matchId: 'CBDTHUOPEN0102', month: 'JAN', date: '30', time: '12:15', homeTeam: 'DALLAS STARS', homeScore: '2', awayTeam: 'FORT WORTH FC', awayScore: '2', winner: 'Draw', loser: 'Draw', type: 'League' },
    { matchId: 'CBDTHUOPEN0201', month: 'FEB', date: '6', time: '19:00', homeTeam: 'FC ELITE', homeScore: '', awayTeam: 'DALLAS STARS', awayScore: '', winner: '', loser: '', type: 'League' },
  ],
};

export const mockBrackets = {
  'CBD THU OPEN JAN': {
    box5Winner: 'FC ELITE',
    box6Winner: 'DALLAS STARS',
    champion: 'FC ELITE',
  },
};

export function getLeagueLabel(league) {
  // Format: first 3 chars of location, day, division
  const loc = (league.location || '').substring(0, 3).toUpperCase();
  const day = (league.day || '').substring(0, 3).toUpperCase();
  const div = (league.division || '').substring(0, 3).toUpperCase();
  return `${loc}, ${day}, ${div}`;
}

export function isPaid(teamName, leagueName, leagues) {
  // Mock: alternating
  const idx = mockTeams.findIndex(t => t.name === teamName);
  return idx % 2 === 0;
}
