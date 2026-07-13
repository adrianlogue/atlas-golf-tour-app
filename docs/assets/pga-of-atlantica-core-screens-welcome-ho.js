/* PGA of Atlantica — core screens: Welcome, Home, Leaderboards, Scorecard, Tour switcher. */
(function () {
  const { useState, useEffect, useRef } = React;
  const I = window.PGAIcons;
  const D = window.PGA_DATA;
  const U = window.PGAUI;
  const PAR = D.PAR;

  const money = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);

  // women's tour live board (Brookwater) — kept beside the men's board in data.js
  const CLOVER_BOARD = [
    { playerId: 'p-hgreen', name: 'Hannah Green', country: 'AUS', flag: '🇦🇺', position: '1', scoreToPar: -11, today: -3, thru: 13, totalStrokes: 205, positionChange: +1, status: 'in_progress' },
    { playerId: 'p-mjlee', name: 'Minjee Lee', country: 'AUS', flag: '🇦🇺', position: '2', scoreToPar: -9, today: -2, thru: 14, totalStrokes: 207, positionChange: -1, status: 'in_progress' },
    { playerId: 'p-skyriacou', name: 'Stephanie Kyriacou', country: 'AUS', flag: '🇦🇺', position: 'T3', scoreToPar: -7, today: -4, thru: 'F', totalStrokes: 209, positionChange: +3, status: 'completed' },
    { playerId: 'p-kdavidson', name: 'Karis Davidson', country: 'AUS', flag: '🇦🇺', position: 'T3', scoreToPar: -7, today: -1, thru: 12, totalStrokes: 209, positionChange: 0, status: 'in_progress' },
    { playerId: 'wb-5', name: 'Grace Kim', country: 'AUS', flag: '🇦🇺', position: '5', scoreToPar: -6, today: -2, thru: 15, totalStrokes: 210, positionChange: +2, status: 'in_progress' },
    { playerId: 'wb-6', name: 'Cassie Porter', country: 'AUS', flag: '🇦🇺', position: 'T6', scoreToPar: -5, today: -1, thru: 11, totalStrokes: 211, positionChange: -2, status: 'in_progress' },
    { playerId: 'wb-7', name: 'Kirsten Rudgeley', country: 'AUS', flag: '🇦🇺', position: 'T6', scoreToPar: -5, today: +1, thru: 'F', totalStrokes: 211, positionChange: -3, status: 'completed' },
    { playerId: 'wb-8', name: 'Momoka Kobori', country: 'NZL', flag: '🇳🇿', position: '8', scoreToPar: -4, today: -3, thru: 16, totalStrokes: 212, positionChange: +4, status: 'in_progress' },
  ];

  function liveTournamentForTour(tourId) {
    return D.tournaments.find((t) => t.tour === tourId && t.status === 'live');
  }
  function boardForTour(tourId) {
    if (tourId === 'clover') return CLOVER_BOARD;
    if (tourId === 'atlas') return D.leaderboard;
    return [];
  }

  /* ============================ WELCOME ============================ */
  function WelcomeScreen({ onStart }) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 1600, background: 'var(--ink)', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* faint hero texture */}
        <div className="img-ph" style={{ position: 'absolute', inset: 0, background: '#0a2440', opacity: .5, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 14px, transparent 14px 28px)' }} />
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36, textAlign: 'center', gap: 26 }}>
          <div className="fade-up">
            <window.PGAEmblem size={150} monochrome withText />
          </div>
          <div className="fade-up" style={{ animationDelay: '.08s' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 700, letterSpacing: -.5, lineHeight: 1.05 }}>PGA of<br />Atlantica</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', marginTop: 16, lineHeight: 1.45, maxWidth: 280 }}>
              Live leaderboards, schedules and players from the tours of Atlantica.
            </div>
          </div>
        </div>
        <div className="fade-up" style={{ position: 'relative', padding: '0 28px 56px', display: 'flex', flexDirection: 'column', gap: 14, animationDelay: '.16s' }}>
          <U.Button variant="gold" size="lg" full onClick={onStart}>Get started</U.Button>
          <div style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>No account needed — start following the tour now.</div>
        </div>
      </div>
    );
  }

  /* ============================ HOME ============================ */
  function HomeScreen({ nav, tour, tier }) {
    const live = liveTournamentForTour(tour.id);
    const board = boardForTour(tour.id);
    return (
      <>
        <U.Header tour={tour} big="Today" subtitle={live ? 'A tournament is in play' : 'What’s on across the tour'}
          onTourPress={() => nav.openSheet({ type: 'tourSwitcher' })}
          right={<>
            <U.HeaderAction icon={<I.Search size={22} />} onClick={() => nav.push('players', {})} />
            <U.HeaderAction icon={<I.Bell size={23} />} badge onClick={() => nav.push('notifications', {})} />
          </>} />
        <div className="scroll">
          <div style={{ padding: '16px 16px 110px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {live ? <HomeLiveHero t={live} board={board} nav={nav} /> : <HomeUpcomingHero tour={tour} nav={nav} />}

            {/* Latest results */}
            <div>
              <U.SectionHeader title="Latest results" />
              <ResultsCarousel tour={tour} nav={nav} />
            </div>

            {/* News (editorial) */}
            <div>
              <U.SectionHeader title="From the tour" serif />
              {tour.id === 'golden' ? <NewsEmpty /> : <NewsList nav={nav} />}
            </div>

            {/* Upcoming */}
            <div>
              <U.SectionHeader title="Upcoming events" action="Schedule" onAction={() => nav.switchTab('schedule')} />
              <div className="card" style={{ overflow: 'hidden' }}>
                {D.tournamentsForTour(tour.id).filter((t) => t.status === 'upcoming').slice(0, 3).map((t, i, arr) => (
                  <div key={t.id} className="row-press" onClick={() => nav.push('tournament', { id: t.id })}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <DateBlock date={t.start} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.shortName}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{t.course}</div>
                    </div>
                    <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function HomeLiveHero({ t, board, nav }) {
    const top5 = board.slice(0, 5);
    return (
      <div className="card fade-up" style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}>
        <div style={{ background: 'var(--ink)', color: '#fff', padding: '16px 18px 14px', position: 'relative' }}>
          <U.ImgPlaceholder label="" height="100%" style={{ position: 'absolute', inset: 0, opacity: .35, background: '#0b2a47' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(214,51,42,.18)', color: '#ff8b80', fontSize: 10.5, fontWeight: 800, letterSpacing: .6, padding: '4px 9px', borderRadius: 999 }}><U.LiveDot />LIVE · ROUND {t.round}</span>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)' }}>{t.course}</span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, lineHeight: 1.1, letterSpacing: -.3 }}>{t.shortName}</div>
          </div>
        </div>
        <div>
          {top5.map((p, i) => (
            <div key={p.playerId} className="row-press" onClick={() => nav.openSheet({ type: 'scorecard', playerId: p.playerId, row: p, tournament: t })}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < 4 ? '1px solid var(--divider)' : 'none' }}>
              <span className="tabnums" style={{ width: 22, fontSize: 14, fontWeight: 700, color: i === 0 ? 'var(--gold-deep)' : 'var(--muted)' }}>{p.position.replace('T', '')}</span>
              <span style={{ fontSize: 16 }}>{p.flag}</span>
              <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
              <span style={{ fontSize: 11.5, color: 'var(--muted-2)', width: 28, textAlign: 'right' }} className="tabnums">{U.fmtThru(p)}</span>
              <span style={{ width: 38, textAlign: 'right' }}><U.Score v={p.scoreToPar} size={16} /></span>
            </div>
          ))}
        </div>
        <div style={{ padding: 14 }}>
          <U.Button variant="primary" full icon={<I.Trophy size={18} />} onClick={() => nav.switchTab('leaderboards')}>Watch the leaderboard</U.Button>
        </div>
      </div>
    );
  }

  function HomeUpcomingHero({ tour, nav }) {
    const next = D.tournamentsForTour(tour.id).find((t) => t.status === 'upcoming');
    if (!next) return null;
    return (
      <div className="card fade-up" style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}>
        <U.ImgPlaceholder label="tournament hero — course aerial" height={150} />
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 7 }}>Next up · {tour.tag}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 23, fontWeight: 700, lineHeight: 1.12, letterSpacing: -.3 }}>{next.shortName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
            <I.MapPin size={15} />{next.course}, {next.location}
          </div>
          <div style={{ marginTop: 16, padding: '14px 0', borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 8 }}>Tees off in</div>
            <U.Countdown target={next.start} style={{ color: 'var(--brand)' }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <U.Button variant="primary" full onClick={() => nav.push('tournament', { id: next.id })}>View tournament</U.Button>
          </div>
        </div>
      </div>
    );
  }

  function ResultsCarousel({ tour, nav }) {
    const recent = D.tournamentsForTour(tour.id).filter((t) => t.status === 'recent');
    if (!recent.length) {
      return <div className="card" style={{ padding: 18, color: 'var(--muted)', fontSize: 13.5 }}>No completed events on this tour yet this season.</div>;
    }
    return (
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '2px 2px 6px', margin: '0 -2px' }} className="scroll">
        {recent.map((t) => (
          <div key={t.id} className="card row-press" onClick={() => nav.push('tournament', { id: t.id })}
            style={{ flex: '0 0 220px', overflow: 'hidden' }}>
            <U.ImgPlaceholder label="winner moment" height={92} />
            <div style={{ padding: 13 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.shortName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                <I.Trophy size={15} style={{ color: 'var(--gold-deep)' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t.winner}</span>
                <span style={{ marginLeft: 'auto' }}><U.Score v={t.winScore} size={14} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function NewsList({ nav }) {
    const items = [
      { tag: 'Feature', title: 'Smith eyes a fourth Kirkwood Cup as Royal Queensland bares its teeth', meta: '4 min read · Tour staff' },
      { tag: 'Analysis', title: 'How the Sandbelt swing reshaped the Order of Merit race', meta: '6 min read · Martin Blake' },
      { tag: 'Interview', title: '“This is home” — Min Woo Lee on the Atlantica summer', meta: '3 min read · Tour staff' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((n, i) => (
          <div key={i} className="row-press" onClick={() => nav.toast('Opening article…')}
            style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < items.length - 1 ? '1px solid var(--divider)' : 'none', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 5 }}>{n.tag}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, lineHeight: 1.22, letterSpacing: -.2, color: 'var(--text)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 6 }}>{n.meta}</div>
            </div>
            <U.ImgPlaceholder label="" height={72} style={{ width: 72, borderRadius: 12, flex: '0 0 auto' }} />
          </div>
        ))}
      </div>
    );
  }

  function NewsEmpty() {
    return (
      <div className="card" style={{ padding: '26px 20px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <I.Document size={24} style={{ color: 'var(--brand)' }} />
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Quiet on the wire</div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.45 }}>There’s no Golden Tour news this week. We’ll surface tour reports and features here as they land.</div>
      </div>
    );
  }

  function DateBlock({ date }) {
    const d = new Date(date + 'T00:00:00');
    const mon = d.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase();
    return (
      <div style={{ width: 44, textAlign: 'center', flex: '0 0 auto' }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--gold-deep)' }}>{mon}</div>
        <div className="tabnums" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', lineHeight: 1.05 }}>{d.getDate()}</div>
      </div>
    );
  }

  /* ============================ LEADERBOARDS ============================ */
  function LeaderboardsScreen({ nav, tour, tier, pinned, onPin, refreshKey }) {
    const live = liveTournamentForTour(tour.id);
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }, [tour.id]);

    const board = boardForTour(tour.id);
    const doRefresh = () => { setRefreshing(true); setTimeout(() => { setRefreshing(false); nav.toast('Leaderboard updated'); }, 1100); };

    if (!live) return <LeaderboardEmpty nav={nav} tour={tour} />;

    const filtered = query.trim().length >= 2 ? board.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : board;
    const pinnedRows = tier.fan ? board.filter((p) => pinned.includes(p.playerId)) : [];

    return (
      <>
        <U.Header tour={tour} onTourPress={() => nav.openSheet({ type: 'tourSwitcher' })}
          right={<U.HeaderAction icon={<I.Search size={23} />} onClick={() => setSearching((s) => !s)} />} />
        {/* tournament context bar */}
        <div style={{ flex: '0 0 auto', background: 'var(--cream)', padding: '0 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--live)', fontSize: 11, fontWeight: 800, letterSpacing: .5 }}><U.LiveDot />LIVE</span>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Round {live.round} of {live.totalRounds} · Cut −2</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3, marginTop: 4 }}>{live.shortName}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{live.course} · {live.location} · Par {live.par}</div>
          {searching && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 12px' }}>
              <I.Search size={18} style={{ color: 'var(--muted-2)' }} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search players in this field"
                style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'var(--ui)', fontSize: 15, background: 'transparent', color: 'var(--text)' }} />
              {query && <I.X size={18} style={{ color: 'var(--muted-2)', cursor: 'pointer' }} onClick={() => setQuery('')} />}
            </div>
          )}
        </div>
        {loading ? <div style={{ flex: 1, background: '#fff' }}><U.LeaderboardSkeleton /></div> : (
          <U.PullToRefresh onRefresh={doRefresh} refreshing={refreshing}>
            {/* column header */}
            <ColHeader />
            {/* pinned favourites */}
            {pinnedRows.length > 0 && (
              <div>
                <div style={{ padding: '8px 18px 6px', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brand-tint)', borderBottom: '1px solid var(--brand-tint-2)' }}>
                  <I.Pin size={13} style={{ color: 'var(--brand)' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--brand)' }}>Your favourites</span>
                </div>
                {pinnedRows.map((p) => <LbRow key={'pin' + p.playerId} p={p} nav={nav} t={live} pinned tier={tier} onPin={onPin} />)}
              </div>
            )}
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>No players match “{query}”.</div>
            ) : filtered.map((p) => (
              <LbRow key={p.playerId} p={p} nav={nav} t={live} tier={tier} onPin={onPin} isPinned={pinned.includes(p.playerId)} />
            ))}
            <div style={{ padding: '16px 18px 120px', textAlign: 'center', color: 'var(--muted-2)', fontSize: 12 }}>
              {live.field} players · {tier.fan ? 'Long-press a player to pin them' : 'Sign in to pin your favourites'}
            </div>
          </U.PullToRefresh>
        )}
      </>
    );
  }

  function ColHeader() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px 8px 14px', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 2 }}>
        <span style={{ width: 22, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)' }}>POS</span>
        <span style={{ width: 18 }} />
        <span style={{ flex: 1, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)' }}>PLAYER</span>
        <span style={{ width: 32, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)', textAlign: 'right' }}>TODAY</span>
        <span style={{ width: 26, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)', textAlign: 'right' }}>THRU</span>
        <span style={{ width: 38, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)', textAlign: 'right' }}>TOTAL</span>
        <span style={{ width: 34 }} />
      </div>
    );
  }

  function LbRow({ p, nav, t, pinned, isPinned, tier, onPin }) {
    const pressTimer = useRef(null);
    const longFired = useRef(false);
    const canPin = tier.fan || tier.member;
    function toggleStar(e) {
      if (e) e.stopPropagation();
      if (canPin) { onPin(p.playerId); nav.toast(isPinned ? 'Removed from favourites' : `Following ${p.name}`); }
      else { nav.openSheet({ type: 'signinPrompt', context: 'pin' }); }
    }
    function down() {
      longFired.current = false;
      pressTimer.current = setTimeout(() => { longFired.current = true; toggleStar(); }, 450);
    }
    function up() { clearTimeout(pressTimer.current); }
    function click() { if (!longFired.current) nav.openSheet({ type: 'scorecard', playerId: p.playerId, row: p, tournament: t }); }
    const isCut = p.cut;
    return (
      <div className="row-press" onClick={click}
        onMouseDown={down} onMouseUp={up} onMouseLeave={up} onTouchStart={down} onTouchEnd={up}
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 10px 11px 14px', borderBottom: '1px solid var(--divider)', background: pinned ? 'var(--brand-tint)' : '#fff', opacity: isCut ? .55 : 1 }}>
        <span className="tabnums" style={{ width: 22, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.position}</span>
        <span style={{ width: 18, display: 'flex', justifyContent: 'flex-start' }}><U.PosChange v={p.positionChange} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{p.flag}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
            <div className="tabnums" style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 1 }}>{p.totalStrokes} strokes</div>
          </div>
        </div>
        <span style={{ width: 32, textAlign: 'right' }}><U.Score v={p.today} size={13} weight={700} /></span>
        <span className="tabnums" style={{ width: 26, textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: p.status === 'completed' ? 'var(--muted-2)' : 'var(--text)' }}>{U.fmtThru(p)}</span>
        <span style={{ width: 38, textAlign: 'right' }}><U.Score v={p.scoreToPar} size={17} /></span>
        <div onClick={toggleStar} className="row-press" style={{ width: 34, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', borderRadius: 8 }}>
          {isPinned ? <I.StarFill size={19} fill="var(--gold)" /> : <I.Star size={19} sw={1.8} style={{ color: 'var(--muted-2)' }} />}
        </div>
      </div>
    );
  }

  function LeaderboardEmpty({ nav, tour }) {
    const next = D.tournamentsForTour(tour.id).find((t) => t.status === 'upcoming');
    return (
      <>
        <U.Header tour={tour} big="Leaderboards" subtitle="Live scoring across the tour"
          onTourPress={() => nav.openSheet({ type: 'tourSwitcher' })} />
        <div className="scroll">
          <div style={{ padding: '24px 16px 120px' }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ background: 'var(--ink)', color: '#fff', padding: '22px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>No live scoring right now</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, marginTop: 8, lineHeight: 1.15 }}>The {tour.short} is between events</div>
              </div>
              {next && (
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--gold-deep)' }}>First tee, next event</div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{next.shortName}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{next.course}</div>
                  <div style={{ marginTop: 16 }}><U.Countdown target={next.start} style={{ color: 'var(--brand)' }} /></div>
                  <div style={{ marginTop: 18 }}>
                    <U.Button variant="ghost" full onClick={() => nav.push('tournament', { id: next.id })}>View tournament & tee times</U.Button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16, color: 'var(--muted)', fontSize: 13, textAlign: 'center', lineHeight: 1.5, padding: '0 12px' }}>
              Switch tours from the header to follow live scoring on another tour.
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============================ SCORECARD SHEET ============================ */
  function buildScorecard(playerId, row) {
    if (D.scorecards[playerId]) return D.scorecards[playerId];
    // synthesise a plausible current round from row.today
    const today = row.today || 0;
    const thru = typeof row.thru === 'number' ? row.thru : 18;
    const toPar = new Array(18).fill(null);
    let remaining = today;
    for (let i = 0; i < thru; i++) {
      if (remaining < 0 && Math.random() < 0.4) { toPar[i] = -1; remaining++; }
      else if (remaining > 0 && Math.random() < 0.4) { toPar[i] = 1; remaining--; }
      else toPar[i] = 0;
    }
    // force last few to settle to exactly today
    const sum = toPar.slice(0, thru).reduce((a, b) => a + (b || 0), 0);
    let diff = today - sum;
    let idx = 0;
    while (diff !== 0 && idx < thru) { if (diff < 0) { toPar[idx] = (toPar[idx] || 0) - 1; diff++; } else { toPar[idx] = (toPar[idx] || 0) + 1; diff--; } idx++; }
    const gross = toPar.map((tp, i) => (tp == null ? null : PAR[i] + tp));
    return {
      name: row.name, country: row.country, position: row.position, toPar: row.scoreToPar,
      rounds: [
        { name: 'R1', toParTotal: Math.round((row.scoreToPar - today) / 2), strokes: 70 },
        { name: 'R2', toParTotal: Math.round((row.scoreToPar - today) / 2), strokes: 70 },
        { name: 'R3', current: true, thru: row.thru, toPar, gross },
      ],
    };
  }

  function ScorecardSheet({ data, onClose }) {
    const sc = buildScorecard(data.playerId, data.row);
    const currentIdx = sc.rounds.findIndex((r) => r.current);
    const [roundIdx, setRoundIdx] = useState(currentIdx >= 0 ? currentIdx : sc.rounds.length - 1);
    const round = sc.rounds[roundIdx];
    const player = D.playerById(data.playerId);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <div className="sheet-handle" />
        {/* header */}
        <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <U.Avatar player={player} name={sc.name} size={48} photo={!!player} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3, display: 'flex', alignItems: 'center', gap: 7 }}>{sc.name} <span style={{ fontSize: 16 }}>{data.row.flag}</span></div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{data.tournament.shortName} · Round {data.tournament.round}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .6, color: 'var(--muted-2)' }}>POS {sc.position}</div>
              <U.Score v={sc.toPar} size={24} />
            </div>
          </div>
          {player && (
            <div style={{ marginTop: 12 }}>
              <U.Button variant="ghost" size="sm" full onClick={() => { onClose(); setTimeout(() => data.nav.push('player', { id: player.id }), 260); }}>View player profile</U.Button>
            </div>
          )}
        </div>
        {/* round tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto' }}>
          {sc.rounds.map((r, i) => (
            <div key={i} onClick={() => setRoundIdx(i)} className="row-press"
              style={{ padding: '8px 16px', borderRadius: 999, flex: '0 0 auto', cursor: 'pointer',
                background: i === roundIdx ? 'var(--brand)' : 'var(--cream-2)', color: i === roundIdx ? '#fff' : 'var(--text)',
                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              {r.name}{r.current && <U.LiveDot />}
            </div>
          ))}
        </div>
        <div className="scroll" style={{ padding: '0 16px 30px' }}>
          {round.toPar ? <ScorecardGrid round={round} /> : <RoundSummary round={round} />}
          <ScorecardLegend />
        </div>
      </div>
    );
  }

  function RoundSummary({ round }) {
    return (
      <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{round.name} total</div>
          <div className="tabnums" style={{ fontSize: 30, fontWeight: 800 }}>{round.strokes}</div>
        </div>
        <U.Score v={round.toParTotal} size={26} />
      </div>
    );
  }

  function ScorecardGrid({ round }) {
    const FRONT = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const BACK = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const out = round.gross.slice(0, 9).reduce((a, b) => a + (b || 0), 0) || null;
    const inn = round.gross.slice(9).reduce((a, b) => a + (b || 0), 0) || null;
    const tot = (out || 0) + (inn || 0) || null;
    const Nine = ({ label, idxs, sub }) => (
      <div className="card fade-up" style={{ padding: '10px 8px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 30, fontSize: 9.5, fontWeight: 800, color: 'var(--muted-2)' }}>HOLE</div>
          {idxs.map((i) => <div key={i} className="tabnums" style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>{i + 1}</div>)}
          <div style={{ width: 30, textAlign: 'center', fontSize: 9.5, fontWeight: 800, color: 'var(--muted-2)' }}>{label}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          <div style={{ width: 30, fontSize: 9.5, fontWeight: 800, color: 'var(--muted-2)' }}>PAR</div>
          {idxs.map((i) => <div key={i} className="tabnums" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted-2)' }}>{PAR[i]}</div>)}
          <div className="tabnums" style={{ width: 30, textAlign: 'center', fontSize: 11, color: 'var(--muted-2)' }}>{idxs.reduce((a, i) => a + PAR[i], 0)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
          <div style={{ width: 30, fontSize: 9.5, fontWeight: 800, color: 'var(--muted-2)' }}>SCORE</div>
          {idxs.map((i) => <ScoreCell key={i} gross={round.gross[i]} tp={round.toPar[i]} />)}
          <div className="tabnums" style={{ width: 30, textAlign: 'center', fontSize: 13, fontWeight: 800 }}>{sub || '–'}</div>
        </div>
      </div>
    );
    return (
      <div>
        <Nine label="OUT" idxs={FRONT} sub={out} />
        <Nine label="IN" idxs={BACK} sub={inn} />
        <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: .4, textTransform: 'uppercase', color: 'var(--muted)' }}>Round total {round.thru !== 'F' && typeof round.thru === 'number' ? `· thru ${round.thru}` : '· F'}</span>
          <span className="tabnums" style={{ fontSize: 20, fontWeight: 800 }}>{tot || '–'}</span>
        </div>
      </div>
    );
  }

  function ScoreCell({ gross, tp }) {
    if (gross == null) return <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: 'var(--border-strong)' }}>·</div>;
    let bg = 'transparent', fg = 'var(--text)', radius = 8, border = 'none';
    if (tp <= -2) { bg = 'var(--gold)'; fg = '#2c2008'; radius = '50%'; } // eagle
    else if (tp === -1) { bg = 'var(--under)'; fg = '#fff'; radius = '50%'; } // birdie
    else if (tp === 1) { bg = 'var(--over)'; fg = '#fff'; radius = 7; } // bogey
    else if (tp >= 2) { bg = '#9a2f1f'; fg = '#fff'; radius = 7; } // double+
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className="tabnums" style={{ width: 24, height: 24, borderRadius: radius, background: bg, color: fg, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border }}>{gross}</div>
      </div>
    );
  }

  function ScorecardLegend() {
    const items = [['var(--gold)', '#2c2008', 'Eagle', '50%'], ['var(--under)', '#fff', 'Birdie', '50%'], ['transparent', 'var(--text)', 'Par', 8], ['var(--over)', '#fff', 'Bogey', 7], ['#9a2f1f', '#fff', 'Double +', 7]];
    return (
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, borderRadius: it[3], background: it[0], border: it[0] === 'transparent' ? '1px solid var(--border-strong)' : 'none' }} />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it[2]}</span>
          </div>
        ))}
      </div>
    );
  }

  /* ============================ TOUR SWITCHER SHEET ============================ */
  function TourSwitcherSheet({ activeTour, onSelect, onClose }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -.3 }}>Choose a tour</div>
          <div className="row-press" onClick={onClose} style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.X size={18} /></div>
        </div>
        <div style={{ padding: '0 16px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {D.tours.map((t) => {
            const on = t.id === activeTour;
            return (
              <div key={t.id} className="row-press" onClick={() => onSelect(t.id)}
                style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#fff', cursor: 'pointer',
                  border: on ? '2px solid var(--gold)' : '1px solid var(--border)',
                  boxShadow: on ? 'var(--shadow-card)' : 'none' }}>
                <div style={{ padding: 8, lineHeight: 0, position: 'relative' }}>
                  <window.PGATourLogo tourId={t.id} height={1} radius={9} style={{ width: '100%', height: 'auto' }} />
                </div>
                <div style={{ padding: '2px 14px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, textTransform: 'uppercase', color: 'var(--gold-deep)', background: 'var(--gold-tint)', padding: '4px 9px', borderRadius: 6 }}>{t.tag}</span>
                  <span style={{ flex: 1 }} />
                  {on ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: 'var(--brand)' }}>
                      <I.Check size={16} stroke="var(--brand)" sw={2.6} />Following
                    </span>
                  ) : (
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted-2)' }}>Tap to switch</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.PGAScreens = {
    WelcomeScreen, HomeScreen, LeaderboardsScreen, ScorecardSheet, TourSwitcherSheet,
    boardForTour, liveTournamentForTour,
  };
})();
