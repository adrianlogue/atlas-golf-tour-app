/* PGA of Atlantica — shared chrome + UI primitives. Exposes window.PGAUI. */
(function () {
  const { useState, useEffect, useRef } = React;
  const I = window.PGAIcons;
  const D = window.PGA_DATA;

  /* ---------- status bar ---------- */
  function StatusBar({ dark }) {
    const col = dark ? '#fff' : '#16201A';
    return (
      <div className="statusbar" style={{ color: col }}>
        <div className="tabnums">9:41</div>
        <div className="sb-right">
          {/* cellular */}
          <svg width="18" height="12" viewBox="0 0 18 12" fill={col}>
            <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0.5" width="3" height="11.5" rx="1" />
          </svg>
          {/* wifi */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill={col}>
            <path d="M8.5 2.2c2.7 0 5.2 1 7 2.8l-1.5 1.6A7.7 7.7 0 0 0 8.5 4.4 7.7 7.7 0 0 0 3 6.6L1.5 5A9.9 9.9 0 0 1 8.5 2.2Z" />
            <path d="M8.5 6.1c1.6 0 3.1.6 4.2 1.7l-1.6 1.6a3.7 3.7 0 0 0-5.2 0L4.3 7.8A6 6 0 0 1 8.5 6.1Z" />
            <circle cx="8.5" cy="10.4" r="1.5" />
          </svg>
          {/* battery */}
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
            <rect x="0.6" y="0.6" width="22" height="11.8" rx="3.2" stroke={col} strokeOpacity="0.4" />
            <rect x="2.2" y="2.2" width="17" height="8.6" rx="1.8" fill={col} />
            <rect x="24" y="4" width="1.6" height="5" rx="0.8" fill={col} fillOpacity="0.4" />
          </svg>
        </div>
      </div>
    );
  }

  /* ---------- header with tour switcher chip ---------- */
  function Header({ title, big, tour, onTourPress, onBack, right, transparent, accentDark, subtitle }) {
    const fg = accentDark ? '#fff' : 'var(--text)';
    return (
      <div style={{
        flex: '0 0 auto',
        paddingTop: 54,
        background: transparent ? 'transparent' : (accentDark ? 'var(--ink)' : 'var(--cream)'),
        borderBottom: transparent || accentDark ? 'none' : '1px solid var(--border)',
        position: 'relative', zIndex: 5,
      }}>
        <div style={{ height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            {onBack && (
              <div className="row-press" onClick={onBack} style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentDark ? '#fff' : 'var(--brand)' }}>
                <I.ChevronLeft size={26} sw={2.1} />
              </div>
            )}
            {tour && (
              <div className="row-press" onClick={onTourPress} style={{
                display: 'flex', alignItems: 'center', gap: 5, marginLeft: onBack ? 0 : 12,
                background: accentDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.03)',
                padding: '4px 9px 4px 5px', borderRadius: 10,
                border: accentDark ? '1px solid rgba(255,255,255,.12)' : '1px solid var(--border)',
              }}>
                <window.PGATourLogo tourId={tour.id} height={22} />
                <I.ChevronDown size={15} sw={2.4} style={{ color: accentDark ? 'rgba(255,255,255,.7)' : 'var(--brand-600)' }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: accentDark ? '#fff' : 'var(--brand)' }}>{right}</div>
        </div>
        {big && (
          <div style={{ padding: '2px 18px 14px' }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -.6, color: fg }}>{big}</div>
            {subtitle && <div style={{ fontSize: 13.5, color: accentDark ? 'rgba(255,255,255,.7)' : 'var(--muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
        )}
      </div>
    );
  }

  function HeaderAction({ icon, onClick, badge }) {
    return (
      <div className="row-press" onClick={onClick} style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {icon}
        {badge && <div style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, background: 'var(--gold)', border: '1.5px solid var(--cream)' }} />}
      </div>
    );
  }

  /* ---------- tab bar ---------- */
  /* ---------- tab bar (mode-aware) ---------- */
  function TabBar({ active, onTab, mode }) {
    const fanTabs = [
      { id: 'home', label: 'Home', icon: I.Home },
      { id: 'leaderboards', label: 'Leaderboards', icon: I.Trophy },
      { id: 'schedule', label: 'Schedule', icon: I.Calendar },
      { id: 'rankings', label: 'Rankings', icon: I.Trending },
      { id: 'more', label: 'More', icon: I.More },
    ];
    const memberTabs = [
      { id: 'portal', label: 'My Events', icon: I.Flag },
      { id: 'leaderboards', label: 'Scores', icon: I.Trophy },
      { id: 'rankings', label: 'Rankings', icon: I.Trending },
      { id: 'hub', label: 'Info Hub', icon: I.Info },
      { id: 'profile', label: 'Profile', icon: I.User },
    ];
    const isMember = mode === 'member';
    const tabs = isMember ? memberTabs : fanTabs;
    const accent = isMember ? 'var(--gold-deep)' : 'var(--brand)';
    return (
      <div className="tabbar" style={isMember ? { borderTop: '1px solid var(--gold)', boxShadow: '0 -1px 0 rgba(195,154,78,.25)' } : null}>
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <div key={t.id} className="tab" onClick={() => onTab(t.id)} style={{ color: on ? accent : 'var(--muted-2)' }}>
              <t.icon size={25} sw={on ? 2.2 : 1.9} />
              <span>{t.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- score text (color-coded to par) ---------- */
  function scoreColor(v) {
    if (v == null) return 'var(--even)';
    if (v < 0) return 'var(--under)';
    if (v > 0) return 'var(--over)';
    return 'var(--even)';
  }
  function fmtScore(v) {
    if (v == null) return '—';
    if (v === 0) return 'E';
    return v > 0 ? '+' + v : String(v);
  }
  function Score({ v, size = 16, weight = 800 }) {
    return <span className="tabnums" style={{ color: scoreColor(v), fontWeight: weight, fontSize: size, letterSpacing: -.2 }}>{fmtScore(v)}</span>;
  }

  /* ---------- player avatar (initials w/ deterministic tint or photo placeholder) ---------- */
  const AV_TINTS = [['#E8EEF6', '#134A82'], ['#F4EAD4', '#9F7C32'], ['#E6EDF2', '#2E5C82'], ['#F1E7EC', '#8a4a63'], ['#EAEFE6', '#4a6b39']];
  function Avatar({ player, name, size = 44, photo }) {
    const label = player ? D.initials(player) : (name ? name.split(' ').map((s) => s[0]).slice(0, 2).join('') : '?');
    const seed = (label.charCodeAt(0) + (label.charCodeAt(1) || 0)) % AV_TINTS.length;
    const [bg, fg] = AV_TINTS[seed];
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', flex: '0 0 auto', overflow: 'hidden', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,.05)' }}>
        {photo
          ? <div className="img-ph" style={{ width: '100%', height: '100%', fontSize: size > 70 ? 10 : 8 }}>photo</div>
          : <span style={{ color: fg, fontWeight: 700, fontSize: size * 0.36, letterSpacing: .3 }}>{label}</span>}
      </div>
    );
  }

  /* ---------- pills ---------- */
  function StatusPill({ status }) {
    const map = {
      live: { bg: 'rgba(214,51,42,.1)', fg: 'var(--live)', label: 'LIVE', dot: true },
      upcoming: { bg: 'var(--brand-tint)', fg: 'var(--brand)', label: 'UPCOMING' },
      recent: { bg: 'var(--cream-2)', fg: 'var(--muted)', label: 'FINISHED' },
    };
    const s = map[status] || map.recent;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: s.bg, color: s.fg, fontSize: 10.5, fontWeight: 800, letterSpacing: .6, padding: '4px 9px', borderRadius: 999 }}>
        {s.dot && <LiveDot />}{s.label}
      </span>
    );
  }
  function LiveDot() {
    return <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--live)', display: 'inline-block', boxShadow: '0 0 0 0 rgba(214,51,42,.5)', animation: 'pulse 1.6s infinite' }} />;
  }

  /* ---------- buttons ---------- */
  function Button({ children, onClick, variant = 'primary', full, icon, size = 'md', disabled }) {
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--ui)', fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
      borderRadius: 999, border: 'none', width: full ? '100%' : 'auto',
      letterSpacing: .1, transition: 'transform .1s, opacity .15s, background .15s',
      opacity: disabled ? 0.45 : 1,
      padding: size === 'lg' ? '16px 22px' : size === 'sm' ? '9px 15px' : '13px 20px',
      fontSize: size === 'lg' ? 16 : size === 'sm' ? 13 : 15,
    };
    const variants = {
      primary: { background: 'var(--brand)', color: '#fff' },
      gold: { background: 'var(--gold)', color: '#2c2008' },
      dark: { background: 'var(--ink)', color: '#fff' },
      outline: { background: 'transparent', color: 'var(--brand)', boxShadow: 'inset 0 0 0 1.5px var(--brand)' },
      ghost: { background: 'var(--brand-tint)', color: 'var(--brand)' },
      subtle: { background: 'var(--cream-2)', color: 'var(--text)' },
    };
    return (
      <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}
        onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(.97)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        {icon}{children}
      </button>
    );
  }

  /* ---------- section header ---------- */
  function SectionHeader({ title, action, onAction, serif }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px 10px' }}>
        <div style={{ fontSize: serif ? 21 : 13, fontWeight: serif ? 700 : 800, letterSpacing: serif ? -.3 : .6, textTransform: serif ? 'none' : 'uppercase', color: serif ? 'var(--text)' : 'var(--muted)', fontFamily: serif ? 'var(--serif)' : 'var(--ui)' }}>{title}</div>
        {action && <span className="row-press" onClick={onAction} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>{action}</span>}
      </div>
    );
  }

  /* ---------- position-change indicator ---------- */
  function PosChange({ v }) {
    if (v == null || v === 0) return <span style={{ color: 'var(--muted-2)', fontSize: 12 }}>–</span>;
    const up = v > 0;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', color: up ? 'var(--under)' : 'var(--over)', fontSize: 11, fontWeight: 700 }} className="tabnums">
        {up ? <I.ArrowUp size={12} sw={2.6} /> : <I.ArrowDown size={12} sw={2.6} />}{Math.abs(v)}
      </span>
    );
  }

  /* ---------- thru / tee-time formatter ---------- */
  function fmtThru(r) {
    if (r.status === 'completed' || r.thru === 'F') return 'F';
    if (typeof r.thru === 'number') return r.thru;
    return r.thru || '—';
  }

  /* ---------- image placeholder ---------- */
  function ImgPlaceholder({ label, height, radius = 0, style }) {
    return <div className="img-ph" style={{ height, borderRadius: radius, ...style }}>{label}</div>;
  }

  /* ---------- live countdown ---------- */
  function Countdown({ target, style }) {
    const [, force] = useState(0);
    useEffect(() => { const t = setInterval(() => force((n) => n + 1), 1000); return () => clearInterval(t); }, []);
    const now = new Date();
    const tgt = new Date(target + 'T08:00:00');
    let diff = Math.max(0, tgt - now);
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    const Unit = ({ n, l }) => (
      <div style={{ textAlign: 'center' }}>
        <div className="tabnums" style={{ fontSize: 26, fontWeight: 800, letterSpacing: -.5, ...style }}>{String(n).padStart(2, '0')}</div>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: .6, marginTop: 1 }}>{l}</div>
      </div>
    );
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Unit n={d} l="Days" /><Unit n={h} l="Hrs" /><Unit n={m} l="Min" /><Unit n={s} l="Sec" />
      </div>
    );
  }

  /* ---------- pull to refresh wrapper (PGA branded ring) ---------- */
  function PullToRefresh({ children, onRefresh, refreshing }) {
    const ref = useRef(null);
    const [pull, setPull] = useState(0);
    const start = useRef(null);
    const armed = useRef(false);

    function onStart(e) {
      const sc = ref.current;
      if (sc && sc.scrollTop <= 0) { start.current = e.touches ? e.touches[0].clientY : e.clientY; armed.current = true; }
    }
    function onMove(e) {
      if (!armed.current || start.current == null) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const dy = y - start.current;
      if (dy > 0) { setPull(Math.min(110, dy * 0.55)); }
      else { setPull(0); }
    }
    function onEnd() {
      if (pull > 64 && !refreshing) { onRefresh && onRefresh(); }
      armed.current = false; start.current = null; setPull(0);
    }
    const showPull = refreshing ? 70 : pull;
    const prog = Math.min(1, showPull / 70);
    return (
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: showPull, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1, opacity: prog }}>
          <RefreshRing spinning={refreshing} progress={prog} />
        </div>
        <div ref={ref} className="scroll"
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
          onMouseDown={onStart} onMouseMove={(e) => armed.current && onMove(e)} onMouseUp={onEnd} onMouseLeave={() => { if (armed.current) onEnd(); }}
          style={{ transform: `translateY(${showPull}px)`, transition: armed.current ? 'none' : 'transform .3s cubic-bezier(.32,.72,0,1)' }}>
          {children}
        </div>
      </div>
    );
  }
  function RefreshRing({ spinning, progress }) {
    const r = 13, c = 2 * Math.PI * r;
    return (
      <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
        <svg width="30" height="30" viewBox="0 0 30 30" style={{ animation: spinning ? 'spin .9s linear infinite' : 'none' }}>
          <circle cx="15" cy="15" r={r} fill="none" stroke="var(--brand-tint-2)" strokeWidth="3" />
          <circle cx="15" cy="15" r={r} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={spinning ? c * 0.25 : c * (1 - progress)} transform="rotate(-90 15 15)" />
        </svg>
      </div>
    );
  }

  /* ---------- skeleton leaderboard rows ---------- */
  function LeaderboardSkeleton() {
    return (
      <div style={{ padding: '4px 0' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid var(--divider)' }}>
            <div className="skel" style={{ width: 18, height: 16 }} />
            <div className="skel" style={{ width: 40, height: 40, borderRadius: 20 }} />
            <div style={{ flex: 1 }}><div className="skel" style={{ width: '55%', height: 13, marginBottom: 7 }} /><div className="skel" style={{ width: '32%', height: 10 }} /></div>
            <div className="skel" style={{ width: 34, height: 18 }} />
          </div>
        ))}
      </div>
    );
  }

  // keyframes for live dot pulse
  const st = document.createElement('style');
  st.textContent = '@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(214,51,42,.5)}70%{box-shadow:0 0 0 6px rgba(214,51,42,0)}100%{box-shadow:0 0 0 0 rgba(214,51,42,0)}}';
  document.head.appendChild(st);

  window.PGAUI = {
    StatusBar, Header, HeaderAction, TabBar, Score, scoreColor, fmtScore, Avatar,
    StatusPill, LiveDot, Button, SectionHeader, PosChange, fmtThru, ImgPlaceholder,
    Countdown, PullToRefresh, RefreshRing, LeaderboardSkeleton,
  };
})();
