'use client';

export default function LeagueTable({ teams = [] }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 12,
      overflow: 'hidden',
      marginBottom: 20,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif', color: '#000' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 4px', borderBottom: '3px solid #000', borderRight: '3px solid #000', fontSize: '12px', fontWeight: 900 }}>TEAM</th>
            {['PL','W','D','L','G+','G-','GD','PTS'].map(col => (
              <th key={col} style={{ textAlign: 'center', padding: '4px 2px', borderBottom: '3px solid #000', fontSize: '11px', fontWeight: 900 }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.length === 0 ? (
            // Show 6 empty rows
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} style={{ height: 32 }}>
                <td style={{ borderRight: '3px solid #000', borderBottom: '1px solid #ccc', background: i % 2 === 0 ? '#e8e8e8' : '#fff', padding: '4px' }}></td>
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} style={{ borderBottom: '1px solid #ccc', background: i % 2 === 0 ? '#e8e8e8' : '#fff' }}></td>
                ))}
              </tr>
            ))
          ) : (
            teams.map((row, i) => (
              <tr key={row.team || i}>
                <td style={{
                  textAlign: 'left',
                  padding: '5px 4px',
                  borderRight: '3px solid #000',
                  borderBottom: '1px solid #ccc',
                  background: i % 2 === 0 ? '#e8e8e8' : '#fff',
                  fontWeight: 600,
                  fontSize: '11px',
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {(row.team || '').length > 6 ? (row.team || '').substring(0, 6) + '...' : row.team}
                </td>
                {[row.played, row.wins, row.draws, row.losses, row.goalsDone, row.goalsAgainst, row.goalDiff, row.points].map((val, j) => (
                  <td key={j} style={{
                    textAlign: 'center',
                    padding: '5px 2px',
                    borderBottom: '1px solid #ccc',
                    background: i % 2 === 0 ? '#e8e8e8' : '#fff',
                    fontSize: '11px',
                    fontWeight: j === 7 ? 900 : 400,
                  }}>
                    {val ?? ''}
                  </td>
                ))}
              </tr>
            ))
          )}
          {/* Fill remaining empty rows if fewer than 6 teams */}
          {teams.length > 0 && teams.length < 6 && Array.from({ length: 6 - teams.length }).map((_, i) => (
            <tr key={`empty-${i}`} style={{ height: 32 }}>
              <td style={{ borderRight: '3px solid #000', borderBottom: '1px solid #ccc', background: (teams.length + i) % 2 === 0 ? '#e8e8e8' : '#fff' }}></td>
              {Array.from({ length: 8 }).map((_, j) => (
                <td key={j} style={{ borderBottom: '1px solid #ccc', background: (teams.length + i) % 2 === 0 ? '#e8e8e8' : '#fff' }}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
