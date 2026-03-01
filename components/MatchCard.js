'use client';
import { HamburgerIcon } from './UIComponents';

// Read-only match card (for captain/player/guest views)
export function MatchCard({ match }) {
  const month = match.month || 'JAN';
  const date = match.date || '--';
  const time = match.time || '--:--';
  const homeTeam = match.homeTeam || 'TEAM A';
  const awayTeam = match.awayTeam || 'TEAM B';
  const homeScore = match.homeScore !== undefined && match.homeScore !== '' ? match.homeScore : '00';
  const awayScore = match.awayScore !== undefined && match.awayScore !== '' ? match.awayScore : '00';

  const truncate = (str, len = 8) => str && str.length > len ? str.substring(0, len) + '...' : (str || '');

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '14px 16px',
      marginBottom: 14,
    }}>
      {/* Top row: Month, Day, Time */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center' }}>
        {[month.substring(0,3).toUpperCase(), date, time].map((val, i) => (
          <div key={i} style={{
            background: '#000',
            color: '#fff',
            borderRadius: 6,
            padding: '5px 10px',
            fontWeight: 700,
            fontSize: '14px',
            fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {val}
          </div>
        ))}
      </div>

      {/* Bottom row: Team A | Score | Team B */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <div style={{
          flex: 1,
          background: '#000',
          color: '#fff',
          borderRadius: 6,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '12px',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          <HamburgerIcon color="#fff" size={14} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncate(homeTeam, 8)}</span>
        </div>

        <div style={{
          background: '#000',
          color: '#fff',
          borderRadius: 6,
          padding: '6px 8px',
          fontWeight: 700,
          fontSize: '13px',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          minWidth: 30,
          textAlign: 'center',
        }}>{homeScore}</div>

        <div style={{
          color: '#000',
          fontWeight: 900,
          fontSize: '16px',
        }}>•</div>

        <div style={{
          background: '#000',
          color: '#fff',
          borderRadius: 6,
          padding: '6px 8px',
          fontWeight: 700,
          fontSize: '13px',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          minWidth: 30,
          textAlign: 'center',
        }}>{awayScore}</div>

        <div style={{
          flex: 1,
          background: '#000',
          color: '#fff',
          borderRadius: 6,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '12px',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          justifyContent: 'flex-end',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncate(awayTeam, 8)}</span>
          <HamburgerIcon color="#fff" size={14} />
        </div>
      </div>
    </div>
  );
}

// Admin match card - editable
export function AdminMatchCard({ match, teams = [], onChange, onDelete, leagueTeams = [] }) {
  const isLeague = match.type !== 'Final';
  const isDeleting = match._deleting;

  const inputStyle = {
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '5px 8px',
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '14px 16px',
      marginBottom: 14,
      position: 'relative',
    }}>
      {/* Top row controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
        {/* League/Final toggle (circle) */}
        <button
          onClick={() => onChange({ ...match, type: isLeague ? 'Final' : 'League' })}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid #000',
            background: isLeague ? '#000' : '#fff',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />

        {/* Month */}
        <select
          value={match.month || ''}
          onChange={e => onChange({ ...match, month: e.target.value })}
          style={{ ...inputStyle, padding: '5px 6px', fontSize: '12px' }}
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Date */}
        <input
          type="text"
          value={match.date || ''}
          onChange={e => onChange({ ...match, date: e.target.value })}
          placeholder="30"
          maxLength={2}
          style={{ ...inputStyle, width: 40, textAlign: 'center' }}
        />

        {/* Time */}
        <input
          type="text"
          value={match.time || ''}
          onChange={e => onChange({ ...match, time: e.target.value })}
          placeholder="12:00"
          maxLength={5}
          style={{ ...inputStyle, width: 60, textAlign: 'center' }}
        />

        {/* Delete checkbox + arrow */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => onChange({ ...match, _deleting: !isDeleting })}
            style={{
              width: 20,
              height: 20,
              border: '2px solid #000',
              background: isDeleting ? '#000' : '#fff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          {isDeleting && (
            <button
              onClick={() => onDelete && onDelete(match.matchId)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#000',
                fontSize: 22,
                cursor: 'pointer',
              }}
            >
              ▶
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: teams and scores */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {/* Team A */}
        <div style={{ flex: 1, background: '#000', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 14, height: 2, background: '#fff', borderRadius: 1 }} />)}
          </div>
          <select
            value={match.homeTeam || ''}
            onChange={e => onChange({ ...match, homeTeam: e.target.value })}
            style={{ ...inputStyle, background: 'transparent', flex: 1, fontSize: '11px', padding: '2px 0' }}
          >
            <option value="">TEAM A</option>
            {leagueTeams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Home Score */}
        <input
          type="text"
          value={match.homeScore || ''}
          onChange={e => onChange({ ...match, homeScore: e.target.value })}
          placeholder="00"
          maxLength={2}
          style={{ ...inputStyle, width: 32, textAlign: 'center', padding: '6px 4px' }}
        />

        <span style={{ color: '#000', fontWeight: 900, fontSize: 14 }}>•</span>

        {/* Away Score */}
        <input
          type="text"
          value={match.awayScore || ''}
          onChange={e => onChange({ ...match, awayScore: e.target.value })}
          placeholder="00"
          maxLength={2}
          style={{ ...inputStyle, width: 32, textAlign: 'center', padding: '6px 4px' }}
        />

        {/* Team B */}
        <div style={{ flex: 1, background: '#000', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <select
            value={match.awayTeam || ''}
            onChange={e => onChange({ ...match, awayTeam: e.target.value })}
            style={{ ...inputStyle, background: 'transparent', flex: 1, fontSize: '11px', padding: '2px 0' }}
          >
            <option value="">TEAM B</option>
            {leagueTeams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 14, height: 2, background: '#fff', borderRadius: 1 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
