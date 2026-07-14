/* PGA of Atlantica — app shell: navigation, fan/member mode, transitions, sheets, overlays, rail. */
(function () {
  const { useState, useEffect, useRef, useCallback } = React;
  const D = window.PGA_DATA;
  const D2 = window.PGA_DATA2;
  const U = window.PGAUI;
  const S = window.PGAScreens;
  const S2 = window.PGAScreens2;
  const R = window.PGARankings;
  const MB = window.PGAMember;

  // Pushed nav layer with a setTimeout-driven enter transition (survives tab backgrounding).
  function NavLayer({ children, zIndex }) {
    const [enter, setEnter] = useState(() => typeof document !== 'undefined' && document.hidden);
    useEffect(() => {
      if (enter) return;
      const t = setTimeout(() => setEnter(true), 20);
      return () => clearTimeout(t);
    }, []);
    return (
      <div className="nav-layer" style={{
        zIndex,
        transform: enter ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .34s cubic-bezier(.32,.72,0,1)',
        boxShadow: enter ? 'none' : '-12px 0 30px rgba(0,0,0,.12)',
      }}>{children}</div>
    );
  }

  function App() {
    const [booted, setBooted] = useState(false);
    const [mode, setMode] = useState('fan');           // 'fan' | 'member'
    const [tab, setTab] = useState('home');
    const [stack, setStack] = useState([]);
    const [popping, setPopping] = useState(null);
    const [activeTour, setActiveTour] = useState('atlas');
    const [tier, setTier] = useState({ fan: false, member: false });
    const [pinned, setPinned] = useState([]);
    const [following, setFollowing] = useState([]);
    const [sheet, setSheet] = useState(null);
    const [sheetShow, setSheetShow] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const toastTimer = useRef(null);

    const tour = D.tourById(activeTour);

    // Per-tour colour themes. The splash and the member Player Portal use the
    // PGA of Atlantica master brand (navy); fan mode follows the active tour.
    useEffect(() => {
      const theme = (!booted || mode === 'member') ? D.brandTheme : ((tour && tour.theme) || D.brandTheme);
      const el = document.documentElement;
      Object.entries(theme).forEach(([k, v]) => el.style.setProperty(k, v));
    }, [booted, mode, tour]);

    const toast = useCallback((msg) => {
      setToastMsg(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastMsg(null), 2300);
    }, []);

    const push = useCallback((screen, params) => {
      setStack((s) => [...s, { key: Date.now() + Math.random(), screen, params: params || {} }]);
    }, []);
    const pop = useCallback(() => {
      setStack((s) => {
        if (!s.length) return s;
        const top = s[s.length - 1];
        setPopping(top);
        setTimeout(() => setPopping(null), 320);
        return s.slice(0, -1);
      });
    }, []);
    const switchTab = useCallback((t) => { setStack([]); setPopping(null); setTab(t); }, []);

    const enterMember = useCallback(() => { setStack([]); setPopping(null); setMode('member'); setTab('portal'); }, []);
    const exitMember = useCallback(() => { setStack([]); setPopping(null); setMode('fan'); setTab('home'); toast('Browsing as a fan · your portal is in More'); }, [toast]);

    const openSheet = useCallback((obj) => {
      setSheet(obj); setSheetShow(false);
      setTimeout(() => setSheetShow(true), 30);
    }, []);
    const closeSheet = useCallback(() => {
      setSheetShow(false);
      setTimeout(() => setSheet(null), 430);
    }, []);

    const setTour = useCallback((id) => {
      setActiveTour(id);
      const t = D.tourById(id);
      closeSheet();
      setTimeout(() => toast(`Now following the ${t.short}`), 250);
    }, [toast, closeSheet]);

    const togglePin = useCallback((id) => setPinned((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);
    const toggleFollow = useCallback((id) => setFollowing((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);

    const reset = useCallback(() => {
      setBooted(false); setMode('fan'); setTab('home'); setStack([]); setPopping(null);
      setActiveTour('atlas'); setTier({ fan: false, member: false });
      setPinned([]); setFollowing([]); setSheet(null); setSheetShow(false);
    }, []);

    const signOutMember = useCallback(() => { setTier((t) => ({ ...t, member: false })); setMode('fan'); setStack([]); setTab('home'); toast('Signed out of Player Portal'); }, [toast]);

    const nav = {
      push, pop, switchTab, openSheet, closeSheet, setTour, toast, enterMember, exitMember,
      tier, setTier, mode,
    };

    // imperative API for the control rail / jump menu
    useEffect(() => {
      window.__pgaApp = {
        go({ boot, mode: m, tab: t, tour: tr, push: pushTo, sheet: openS, tier: setT, reset: doReset }) {
          if (doReset) { reset(); return; }
          setSheet(null); setSheetShow(false); setPopping(null);
          if (boot) setBooted(true);
          if (tr) setActiveTour(tr);
          if (setT) setTier((prev) => ({ ...prev, ...setT }));
          if (m) setMode(m);
          if (t) { setStack([]); setTab(t); }
          if (pushTo) setTimeout(() => setStack([{ key: Date.now(), screen: pushTo.screen, params: pushTo.params || {} }]), 30);
          if (openS) setTimeout(() => openSheet(openS), 70);
        },
        reset,
      };
    }, [reset, openSheet]);

    function renderScreen(screen, params) {
      switch (screen) {
        // fan
        case 'home': return <S.HomeScreen nav={nav} tour={tour} tier={tier} />;
        case 'leaderboards': return <S.LeaderboardsScreen nav={nav} tour={tour} tier={tier} pinned={pinned} onPin={togglePin} />;
        case 'schedule': return <S2.ScheduleScreen nav={nav} tour={tour} />;
        case 'rankings': return <R.RankingsScreen nav={nav} tour={tour} mode={mode} />;
        case 'more': return <S2.MoreScreen nav={nav} tier={tier} onSignOut={() => { setTier((t) => ({ ...t, fan: false })); setFollowing([]); toast('Signed out'); }} />;
        case 'players': return <S2.PlayersScreen nav={nav} tour={tour} />;
        case 'tournament': return <S2.TournamentDetailScreen nav={nav} params={params} tour={tour} />;
        case 'player': return <S2.PlayerProfileScreen nav={nav} params={params} tier={tier} following={following} onFollow={toggleFollow} />;
        case 'notifications': return <R.NotificationsScreen nav={nav} mode={mode} onBack={pop} />;
        // auth
        case 'memberAuth': return <S2.MemberAuthScreen nav={nav} onComplete={() => { setTier((t) => ({ ...t, member: true })); enterMember(); }} />;
        case 'signup': return <S2.SignupScreen nav={nav} mode={params.mode} onComplete={() => { setTier((t) => ({ ...t, fan: true })); setStack([]); setTimeout(() => toast('Welcome to the PGA of Atlantica'), 200); }} />;
        // member portal
        case 'portal': return <MB.PortalScreen nav={nav} />;
        case 'eventHub': return <MB.EventHubScreen nav={nav} params={params} />;
        case 'hub': return <MB.InfoHubScreen nav={nav} />;
        case 'infoDetail': return <MB.InfoDetailScreen nav={nav} params={params} />;
        case 'profile': return <MB.ProfileScreen nav={nav} onExitMember={exitMember} onSignOut={signOutMember} />;
        case 'invoice': return <MB.InvoiceScreen nav={nav} />;
        case 'accreditation': return <MB.AccreditationScreen nav={nav} />;
        default: return null;
      }
    }

    const topScreen = stack.length ? stack[stack.length - 1].screen : tab;
    const showTabBar = booted && stack.length === 0;
    const darkHeader = ['portal', 'profile', 'hub', 'eventHub', 'tournament', 'player', 'memberAuth'];
    const statusDark = !booted || darkHeader.includes(topScreen);

    return (
      <>
        <U.StatusBar dark={statusDark} />
        {/* base tab root */}
        <div className="nav-layer" style={{ zIndex: 1 }}>{renderScreen(tab)}</div>

        {/* pushed layers */}
        {stack.map((l, i) => (
          <NavLayer key={l.key} zIndex={10 + i}>{renderScreen(l.screen, l.params)}</NavLayer>
        ))}
        {popping && <div className="nav-layer layer-out" style={{ zIndex: 9 }}>{renderScreen(popping.screen, popping.params)}</div>}

        {/* tab bar */}
        {showTabBar && <U.TabBar active={tab} onTab={switchTab} mode={mode} />}

        {/* sheet */}
        {sheet && (
          <>
            <div className={'sheet-scrim' + (sheetShow ? ' show' : '')} style={{ zIndex: 1000 }} onClick={closeSheet} />
            <div className={'sheet' + (sheetShow ? ' show' : '')}>
              {sheet.type === 'tourSwitcher' && <S.TourSwitcherSheet activeTour={activeTour} onSelect={setTour} onClose={closeSheet} />}
              {sheet.type === 'scorecard' && <S.ScorecardSheet data={{ ...sheet, nav }} onClose={closeSheet} />}
              {sheet.type === 'oomBreakdown' && <R.OomBreakdownSheet pid={sheet.pid} nav={nav} onClose={closeSheet} />}
              {sheet.type === 'exemptions' && <R.ExemptionsSheet onClose={closeSheet} />}
              {sheet.type === 'signinPrompt' && <S2.SigninPromptSheet ctx={sheet} onClose={closeSheet}
                onCreate={() => { closeSheet(); setTimeout(() => push('signup', { mode: 'create' }), 280); }}
                onSignin={() => { closeSheet(); setTimeout(() => push('signup', { mode: 'signin' }), 280); }} />}
            </div>
          </>
        )}

        {/* toast */}
        {toastMsg && <div className={'toast show'}><span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--gold)', flex: '0 0 auto' }} />{toastMsg}</div>}

        {/* welcome */}
        {!booted && <S.WelcomeScreen onStart={() => setBooted(true)} />}
      </>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('app-root'));
  root.render(<App />);

  /* ---------------- control rail + overlays ---------------- */
  const liveRoot = ReactDOM.createRoot(document.getElementById('liveView'));
  const styleRoot = ReactDOM.createRoot(document.getElementById('styleView'));
  const O = window.PGAOverlays;

  function showOverlay(which) {
    const el = document.getElementById(which === 'live' ? 'liveView' : 'styleView');
    const r = which === 'live' ? liveRoot : styleRoot;
    const View = which === 'live' ? O.LiveActivityView : O.StyleGuideView;
    r.render(React.createElement(View, { onClose: () => el.classList.remove('show') }));
    el.classList.add('show');
  }

  function wire(id, fn) { const b = document.getElementById(id); if (b) b.onclick = fn; }

  const jump = document.getElementById('jump');
  const jumpData = [
    ['Fans — anonymous', [
      ['First-run welcome', { reset: true }],
      ['Home — tournament live', { boot: true, mode: 'fan', tour: 'atlas', tab: 'home' }],
      ['Home — between events', { boot: true, mode: 'fan', tour: 'golden', tab: 'home' }],
      ['Leaderboard — live + star to follow', { boot: true, mode: 'fan', tour: 'atlas', tab: 'leaderboards' }],
      ['Leaderboard — empty state', { boot: true, mode: 'fan', tour: 'golden', tab: 'leaderboards' }],
      ['Schedule — full season', { boot: true, mode: 'fan', tour: 'atlas', tab: 'schedule' }],
      ['Tournament — rich event page', { boot: true, mode: 'fan', tour: 'atlas', tab: 'schedule', push: { screen: 'tournament', params: { id: 't-atlasopen' } } }],
      ['Rankings — Order of Merit', { boot: true, mode: 'fan', tour: 'atlas', tab: 'rankings' }],
      ['Player profile + career history', { boot: true, mode: 'fan', tab: 'home', push: { screen: 'player', params: { id: 'p-csutherland' } } }],
      ['More', { boot: true, mode: 'fan', tab: 'more' }],
    ]],
    ['Key interactions', [
      ['Tour switcher', { boot: true, mode: 'fan', tab: 'home', sheet: { type: 'tourSwitcher' } }],
      ['Hole-by-hole scorecard', { boot: true, mode: 'fan', tour: 'atlas', tab: 'leaderboards', sheet: { type: 'scorecard', playerId: 'p-csutherland', row: D.leaderboard[0], tournament: D.tournaments.find((t) => t.id === 't-meridian') } }],
      ['OoM points breakdown', { boot: true, mode: 'fan', tab: 'rankings', sheet: { type: 'oomBreakdown', pid: 'p-csutherland' } }],
      ['Exemption cut-offs', { boot: true, mode: 'fan', tab: 'rankings', sheet: { type: 'exemptions' } }],
      ['Notifications — fan', { boot: true, mode: 'fan', tab: 'home', push: { screen: 'notifications' } }],
    ]],
    ['Fan account (Tier 2)', [
      ['Sign-up prompt', { boot: true, mode: 'fan', tab: 'more', sheet: { type: 'signinPrompt', context: 'more' } }],
      ['Signed in — favourites pinned', { boot: true, mode: 'fan', tour: 'atlas', tab: 'leaderboards', tier: { fan: true } }],
    ]],
    ['Member / Player Portal (Tier 3)', [
      ['Member sign-in (GG redirect)', { boot: true, mode: 'fan', tab: 'more', push: { screen: 'memberAuth' } }],
      ['Portal — My Tournaments', { boot: true, mode: 'member', tier: { member: true }, tab: 'portal' }],
      ['Event hub — player view', { boot: true, mode: 'member', tier: { member: true }, tab: 'portal', push: { screen: 'eventHub', params: { id: 't-atlasopen' } } }],
      ['Profile — self-service', { boot: true, mode: 'member', tier: { member: true }, tab: 'profile' }],
      ['Billing — invoice & pay', { boot: true, mode: 'member', tier: { member: true }, tab: 'profile', push: { screen: 'invoice' } }],
      ['Accreditation passes', { boot: true, mode: 'member', tier: { member: true }, tab: 'profile', push: { screen: 'accreditation' } }],
      ['Info Hub', { boot: true, mode: 'member', tier: { member: true }, tab: 'hub' }],
      ['Notifications — tournament office', { boot: true, mode: 'member', tier: { member: true }, tab: 'portal', push: { screen: 'notifications' } }],
    ]],
  ];

  function buildJump() {
    jumpData.forEach(([group, items]) => {
      const g = document.createElement('div'); g.className = 'jump-group'; g.textContent = group; jump.appendChild(g);
      items.forEach(([label, action]) => {
        const it = document.createElement('div'); it.className = 'jump-item'; it.textContent = label;
        it.onclick = () => { window.__pgaApp.go(action); jump.classList.remove('show'); jumpOpen = false; };
        jump.appendChild(it);
      });
    });
  }
  buildJump();

  let jumpOpen = false;
  wire('btnJump', () => { jumpOpen = !jumpOpen; jump.classList.toggle('show', jumpOpen); });
  wire('btnLive', () => showOverlay('live'));
  wire('btnStyle', () => showOverlay('style'));
  wire('btnReset', () => { window.__pgaApp.reset(); jump.classList.remove('show'); jumpOpen = false; });
  wire('btnHide', () => { document.getElementById('rail').classList.add('hidden'); document.getElementById('railShow').classList.add('show'); jump.classList.remove('show'); jumpOpen = false; });
  wire('railShow', () => { document.getElementById('rail').classList.remove('hidden'); document.getElementById('railShow').classList.remove('show'); });

  document.addEventListener('click', (e) => {
    if (jumpOpen && !jump.contains(e.target) && e.target.id !== 'btnJump') { jump.classList.remove('show'); jumpOpen = false; }
  });
})();
