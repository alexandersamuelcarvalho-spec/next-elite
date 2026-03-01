'use client';

// Hamburger icon
export function HamburgerIcon({ color = 'currentColor', size = 18 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
      <span style={{ display: 'block', width: size, height: 2.5, background: color, borderRadius: 2 }} />
      <span style={{ display: 'block', width: size, height: 2.5, background: color, borderRadius: 2 }} />
      <span style={{ display: 'block', width: size, height: 2.5, background: color, borderRadius: 2 }} />
    </div>
  );
}

// Arrow icon
export function ArrowIcon({ color = '#fff', size = 24 }) {
  return (
    <span style={{ color, fontSize: size, lineHeight: 1, userSelect: 'none' }}>▶</span>
  );
}

// White rounded button
export function WhiteButton({ children, onClick, style, disabled }) {
  return (
    <button
      className="btn-white"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 20px',
        fontSize: '20px',
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Black rounded button (solid)
export function BlackButton({ children, onClick, style, disabled }) {
  return (
    <button
      className="btn-black"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 20px',
        fontSize: '20px',
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Outline button (dark bg, white border)
export function OutlineButton({ children, onClick, style, disabled }) {
  return (
    <button
      className="btn-outline"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 20px',
        fontSize: '20px',
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Team/League button with payment dot
export function TeamButton({ label, paid, onClick, variant = 'white' }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px 20px',
        fontSize: '20px',
        borderRadius: 999,
        background: variant === 'white' ? '#fff' : '#000',
        color: variant === 'white' ? '#000' : '#fff',
        border: `2px solid ${variant === 'white' ? '#fff' : '#000'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
        fontWeight: 700,
        textTransform: 'uppercase',
        cursor: 'pointer',
        letterSpacing: '0.05em',
        transition: 'all 0.18s',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
        {label}
      </span>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: paid ? '#22c55e' : '#ef4444',
          flexShrink: 0,
          marginLeft: 10,
        }}
      />
    </button>
  );
}

// Scrollable select button (black with hamburger icon)
export function ScrollSelect({ value, options, onChange, placeholder = '(SELECT)', style }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange && onChange(e.target.value)}
      style={{
        background: '#000',
        color: '#fff',
        border: '2px solid #000',
        borderRadius: 999,
        padding: '10px 16px',
        fontSize: '16px',
        fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        flex: 1,
        appearance: 'none',
        WebkitAppearance: 'none',
        ...style,
      }}
    >
      <option value="">{placeholder}</option>
      {options?.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  );
}

// Scrollable button row (black button with hamburger + arrow button beside it)
export function ScrollWithArrow({ value, options, onChange, onArrow, placeholder = '(SELECT)', label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        flex: 1,
        background: '#000',
        color: '#fff',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: 999,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <HamburgerIcon color="#fff" />
        <select
          value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          style={{
            background: 'transparent',
            color: '#fff',
            border: 'none',
            outline: 'none',
            fontSize: '18px',
            fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            flex: 1,
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          <option value="">{label || placeholder}</option>
          {options?.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onArrow}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 32,
          cursor: 'pointer',
          padding: '0 4px',
          flexShrink: 0,
        }}
      >
        ▶
      </button>
    </div>
  );
}

// League scrollable selector (white box with hamburger, used at top of league pages)
export function LeagueSelector({ currentLeague, leagues, onChange }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    }}>
      <span style={{
        fontSize: '22px',
        fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
        fontWeight: 700,
        color: '#000',
        textTransform: 'uppercase',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {currentLeague || '(LEAGUE)'}
      </span>
      <select
        value={currentLeague || ''}
        onChange={e => onChange && onChange(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          marginLeft: 8,
          color: '#000',
        }}
        title="Switch League"
      >
        {leagues?.map(l => (
          <option key={l.name || l} value={l.name || l}>{l.name || l}</option>
        ))}
      </select>
      <HamburgerIcon color="#000" />
    </div>
  );
}

// Title box component
export function TitleBox({ children, style }) {
  return (
    <div className="title-box" style={{
      padding: '20px',
      fontSize: '28px',
      marginBottom: 24,
      letterSpacing: '0.05em',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Payment dot
export function PaymentDot({ paid, size = 22 }) {
  return (
    <span style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: paid ? '#22c55e' : '#ef4444',
      display: 'inline-block',
      flexShrink: 0,
    }} />
  );
}
