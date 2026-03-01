'use client';

// Bracket view for both read-only (captain/player) and editable (admin) modes
export default function BracketView({ teams = [], bracket = {}, onSetWinner, isAdmin = false }) {
  const place1 = teams[0]?.team || teams[0] || '';
  const place2 = teams[1]?.team || teams[1] || '';
  const place3 = teams[2]?.team || teams[2] || '';
  const place4 = teams[3]?.team || teams[3] || '';

  const box5Winner = bracket.box5Winner || '';
  const box6Winner = bracket.box6Winner || '';
  const champion = bracket.champion || '';

  const truncate = (str, len = 8) => str && str.length > len ? str.substring(0, len) + '...' : str;

  return (
    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {/* Top row: 1st vs 4th */}
      <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'space-between' }}>
        <BracketBox num={1} label={truncate(place1, 10)} />
        <BracketBox num={4} label={truncate(place4, 10)} />
      </div>

      {/* Connector lines */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%', height: 20 }}>
        <svg width="100%" height="20" viewBox="0 0 300 20" preserveAspectRatio="none">
          <line x1="75" y1="0" x2="75" y2="20" stroke="white" strokeWidth="2"/>
          <line x1="225" y1="0" x2="225" y2="20" stroke="white" strokeWidth="2"/>
          <line x1="75" y1="20" x2="150" y2="20" stroke="white" strokeWidth="2"/>
          <line x1="225" y1="20" x2="150" y2="20" stroke="white" strokeWidth="2"/>
          <line x1="150" y1="20" x2="150" y2="20" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Box 5: Winner of 1 vs 4 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onSetWinner && onSetWinner(5, box5Winner, champion === box5Winner)}
              style={{
                width: 18,
                height: 18,
                border: '2px solid #fff',
                background: champion === box5Winner && box5Winner ? '#fff' : 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <div style={{
              background: '#000',
              color: '#fff',
              borderRadius: 4,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 120,
            }}>
              {champion === box5Winner && box5Winner ? (
                <CrownIcon />
              ) : (
                <div style={{ width: 20, height: 20, background: '#333', borderRadius: 2 }} />
              )}
              <select
                value={box5Winner}
                onChange={e => onSetWinner && onSetWinner(5, e.target.value, false)}
                style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase' }}
              >
                <option value="">-</option>
                <option value={place1}>{truncate(place1)}</option>
                <option value={place4}>{truncate(place4)}</option>
              </select>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 18, border: '2px solid #fff', background: champion === box5Winner && box5Winner ? '#fff' : 'transparent' }} />
            <div style={{
              background: champion === box5Winner && box5Winner ? '#000' : '#000',
              color: '#fff',
              borderRadius: 4,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 120,
            }}>
              {champion === box5Winner && box5Winner ? <CrownIcon /> : <div style={{ width: 20, height: 20, background: '#333', borderRadius: 2 }} />}
              <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>{truncate(box5Winner) || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Center connector */}
      <div style={{ height: 20, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg width="60%" height="20" viewBox="0 0 200 20" preserveAspectRatio="none">
          <line x1="100" y1="0" x2="100" y2="10" stroke="white" strokeWidth="2"/>
          <line x1="100" y1="10" x2="100" y2="20" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Box 6: Winner of 2 vs 3 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onSetWinner && onSetWinner(6, box6Winner, champion === box6Winner)}
              style={{
                width: 18,
                height: 18,
                border: '2px solid #fff',
                background: champion === box6Winner && box6Winner ? '#fff' : 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <div style={{
              background: '#000',
              color: '#fff',
              borderRadius: 4,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 120,
            }}>
              {champion === box6Winner && box6Winner ? (
                <CrownIcon />
              ) : (
                <div style={{ width: 20, height: 20, background: '#333', borderRadius: 2 }} />
              )}
              <select
                value={box6Winner}
                onChange={e => onSetWinner && onSetWinner(6, e.target.value, false)}
                style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase' }}
              >
                <option value="">-</option>
                <option value={place2}>{truncate(place2)}</option>
                <option value={place3}>{truncate(place3)}</option>
              </select>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 18, border: '2px solid #fff', background: champion === box6Winner && box6Winner ? '#fff' : 'transparent' }} />
            <div style={{
              background: '#000',
              color: '#fff',
              borderRadius: 4,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 120,
            }}>
              {champion === box6Winner && box6Winner ? <CrownIcon /> : <div style={{ width: 20, height: 20, background: '#333', borderRadius: 2 }} />}
              <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>{truncate(box6Winner) || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom connector */}
      <div style={{ height: 20, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg width="100%" height="20" viewBox="0 0 300 20" preserveAspectRatio="none">
          <line x1="75" y1="20" x2="75" y2="0" stroke="white" strokeWidth="2"/>
          <line x1="225" y1="20" x2="225" y2="0" stroke="white" strokeWidth="2"/>
          <line x1="75" y1="0" x2="150" y2="0" stroke="white" strokeWidth="2"/>
          <line x1="225" y1="0" x2="150" y2="0" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Bottom row: 2nd and 3rd */}
      <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'space-between' }}>
        <BracketBox num={2} label={truncate(place2, 10)} />
        <BracketBox num={3} label={truncate(place3, 10)} />
      </div>
    </div>
  );
}

function BracketBox({ num, label }) {
  return (
    <div style={{
      background: '#fff',
      border: '2px solid #fff',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      height: 40,
      overflow: 'hidden',
    }}>
      <div style={{
        background: '#000',
        color: '#fff',
        width: 32,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 18,
        flexShrink: 0,
      }}>
        {num}
      </div>
      <span style={{
        padding: '0 8px',
        color: '#000',
        fontWeight: 700,
        fontSize: '13px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
}

function CrownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"/>
    </svg>
  );
}
