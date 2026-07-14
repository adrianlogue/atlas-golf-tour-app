/* PGA of Atlantica — Schedule, Tournament detail, Players, Profile, More, auth flows. */
(function () {
  const { useState, useEffect, useRef } = React;
  const I = window.PGAIcons;
  const D = window.PGA_DATA;
  const U = window.PGAUI;
  const money = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
  const dateRange = (s, e) => {
    const ds = new Date(s + 'T00:00:00'), de = new Date(e + 'T00:00:00');
    const mo = (d) => d.toLocaleDateString('en-AU', { month: 'short' });
    if (ds.getMonth() === de.getMonth()) return `${ds.getDate()}–${de.getDate()} ${mo(de)} ${de.getFullYear()}`;
    return `${ds.getDate()} ${mo(ds)} – ${de.getDate()} ${mo(de)} ${de.getFullYear()}`;
  };
  function DateBlock({ date }) {
    const d = new Date(date + 'T00:00:00');
    const mon = d.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase();
    return (
      <div style={{ width: 42, textAlign: 'center', flex: '0 0 auto' }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--gold-deep)' }}>{mon}</div>
        <div className="tabnums" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', lineHeight: 1.05 }}>{d.getDate()}</div>
      </div>
    );
  }

  /* ============================ SCHEDULE (full season, scrollable) ============================ */
  function ScheduleScreen({ nav, tour }) {
    const all = D.tournamentsForTour(tour.id).slice().sort((a, b) => a.start.localeCompare(b.start));
    // group by month
    const groups = [];
    all.forEach((t) => {
      const key = new Date(t.start + 'T00:00:00').toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
      let g = groups.find((x) => x.key === key);
      if (!g) { g = { key, items: [] }; groups.push(g); }
      g.items.push(t);
    });
    return (
      <>
        <U.Header tour={tour} big="Schedule" subtitle={`${tour.short} · full 2026 season`}
          onTourPress={() => nav.openSheet({ type: 'tourSwitcher' })}
          right={<U.HeaderAction icon={<I.Search size={22} />} onClick={() => nav.push('players', {})} />} />
        <div className="scroll">
          <div style={{ padding: '4px 16px 120px' }}>
            {groups.map((g) => (
              <div key={g.key}>
                <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--cream)', padding: '14px 4px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: 'var(--muted)' }}>{g.key}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {g.items.map((t, i) => (
                    <div key={t.id} className="row-press" onClick={() => nav.push('tournament', { id: t.id })}
                      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 14px', borderBottom: i < g.items.length - 1 ? '1px solid var(--divider)' : 'none', background: t.status === 'live' ? 'rgba(214,51,42,.04)' : '#fff' }}>
                      <DateBlock date={t.start} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.shortName}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{t.course} · {t.location}</div>
                        <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <U.StatusPill status={t.status} />
                          {t.status === 'recent' && t.winner && <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>🏆 {t.winner}</span>}
                        </div>
                      </div>
                      <I.ChevronRight size={18} style={{ color: 'var(--muted-2)', flex: '0 0 auto' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ============================ TOURNAMENT DETAIL ============================ */
  function TournamentDetailScreen({ nav, params, tour }) {
    const t = D.tournaments.find((x) => x.id === params.id);
    if (!t) return null;
    const champs = (window.PGA_DATA2 && window.PGA_DATA2.pastChampions[t.id]) || null;
    const rounds = t.rounds && t.rounds.length ? t.rounds : Array.from({ length: t.totalRounds }, (_, i) => ({ name: `Round ${i + 1}`, date: t.start, course: t.course, status: 'upcoming' }));
    return (
      <>
        <div className="scroll" style={{ background: 'var(--cream)' }}>
          {/* hero */}
          <div style={{ position: 'relative', height: 260 }}>
            <U.ImgPlaceholder label="course hero — signature hole" height="100%" style={{ position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,25,45,.92) 6%, rgba(7,25,45,.25) 60%, rgba(7,25,45,.45) 100%)' }} />
            <div className="row-press" onClick={nav.pop} style={{ position: 'absolute', top: 56, left: 12, width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 5 }}><I.ChevronLeft size={26} sw={2.1} /></div>
            <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, color: '#fff' }}>
              <div style={{ marginBottom: 10 }}><U.StatusPill status={t.status} /></div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 700, lineHeight: 1.08, letterSpacing: -.4 }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: 'rgba(255,255,255,.85)' }}><I.MapPin size={15} />{t.course}, {t.location}</div>
            </div>
          </div>

          <div style={{ padding: '18px 16px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* facts */}
            <div className="card" style={{ display: 'flex', padding: '14px 4px' }}>
              {[['Dates', dateRange(t.start, t.end).replace(/ \d{4}$/, '')], ['Purse', money(t.purse)], ['Field', `${t.field}`], ['Par', `${t.par}`]].map((f, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', borderLeft: i ? '1px solid var(--divider)' : 'none' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase', color: 'var(--muted-2)' }}>{f[0]}</div>
                  <div className="tabnums" style={{ fontSize: 14.5, fontWeight: 700, marginTop: 4 }}>{f[1]}</div>
                </div>
              ))}
            </div>

            {t.status === 'live' && (
              <U.Button variant="primary" full icon={<I.Trophy size={18} />} onClick={() => { nav.pop(); setTimeout(() => nav.switchTab('leaderboards'), 250); }}>View live leaderboard</U.Button>
            )}
            {t.status === 'recent' && (
              <div className="card" style={{ padding: 16, background: 'var(--gold-tint)', border: '1px solid #e8d6ad', display: 'flex', alignItems: 'center', gap: 12 }}>
                <I.Trophy size={26} style={{ color: 'var(--gold-deep)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Champion</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{t.winner}</div>
                </div>
                <U.Score v={t.winScore} size={22} />
              </div>
            )}

            <div style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5 }}>{t.blurb}</div>

            {/* tickets (fan) */}
            {t.status !== 'recent' && (
              <div className="card row-press" onClick={() => nav.toast('Tickets — opening box office')} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--gold-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><I.Ticket size={21} style={{ color: 'var(--gold-deep)' }} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700 }}>Buy tickets</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Grounds passes from $39 · kids free</div>
                  </div>
                  <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
                </div>
              </div>
            )}

            {/* course preview */}
            <div>
              <U.SectionHeader title="Course preview" />
              <div className="card" style={{ overflow: 'hidden' }}>
                <U.ImgPlaceholder label="course flyover — signature hole" height={150} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t.course}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>Par {t.par} · {t.location}. A championship test that has crowned some of Atlantica’s finest. Hole-by-hole flyovers and the yardage guide are available in the app.</div>
                  <div style={{ marginTop: 12 }}><U.Button variant="ghost" size="sm" onClick={() => nav.toast('Hole-by-hole flyover')}>Watch hole-by-hole</U.Button></div>
                </div>
              </div>
            </div>

            {/* past champions */}
            {champs && (
              <div>
                <U.SectionHeader title="Past champions" />
                <div className="card" style={{ overflow: 'hidden' }}>
                  {champs.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < champs.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                      <span className="tabnums" style={{ width: 42, fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{c.year}</span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                      <span className="tabnums" style={{ fontSize: 13, fontWeight: 700, color: 'var(--under)' }}>{c.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* event news */}
            <div>
              <U.SectionHeader title="Event news" serif />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[`${t.shortName}: five storylines to watch`, `Field update — who's teed up at ${t.course.split(' ')[0]}`].map((n, i, a) => (
                  <div key={i} className="row-press" onClick={() => nav.toast('Opening article…')} style={{ display: 'flex', gap: 14, padding: '13px 0', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, lineHeight: 1.25, color: 'var(--text)' }}>{n}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 5 }}>Tour staff · this week</div>
                    </div>
                    <U.ImgPlaceholder label="" height={64} style={{ width: 64, borderRadius: 10, flex: '0 0 auto' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* rounds */}
            <div>
              <U.SectionHeader title="Rounds" />
              <div className="card" style={{ overflow: 'hidden' }}>
                {rounds.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < rounds.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: r.status === 'live' ? 'rgba(214,51,42,.1)' : 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: r.status === 'live' ? 'var(--live)' : 'var(--brand)' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 1 }}>{r.course}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(r.date + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    {r.status === 'live' && <U.LiveDot />}
                  </div>
                ))}
              </div>
            </div>

            {/* field link */}
            <div className="card row-press" onClick={() => nav.push('players', {})} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Users size={20} style={{ color: 'var(--brand)' }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>The field</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{t.field} players</div></div>
              <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
            </div>

            {/* documents */}
            <div>
              <U.SectionHeader title="Event documents" />
              <div className="card" style={{ overflow: 'hidden' }}>
                {['Tournament regulations', 'Tee times — Round ' + (t.round || 1), 'Course guide & scorecard'].map((doc, i, a) => (
                  <div key={i} className="row-press" onClick={() => nav.toast('Opening document…')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <I.Document size={19} style={{ color: 'var(--muted)' }} />
                    <span style={{ flex: 1, fontSize: 14 }}>{doc}</span>
                    <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============================ PLAYERS SEARCH ============================ */
  function PlayersScreen({ nav, tour }) {
    const [q, setQ] = useState('');
    const inputRef = useRef(null);
    const [history, setHistory] = useState(['Alec Stanton', 'Harper Glenn']);
    useEffect(() => { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 350); return () => clearTimeout(t); }, []);
    const results = q.trim().length >= 2 ? D.players.filter((p) => D.fullName(p).toLowerCase().includes(q.toLowerCase())) : [];
    const popular = ['p-csutherland', 'p-astanton', 'p-mwarrick', 'p-hglenn', 'p-jdunmore', 'p-mjung'].map(D.playerById).filter(Boolean);

    function open(p) { setHistory((h) => [D.fullName(p), ...h.filter((x) => x !== D.fullName(p))].slice(0, 4)); nav.push('player', { id: p.id }); }

    return (
      <>
        <U.Header tour={tour} big="Players" subtitle="Search by name — no player ID required"
          onTourPress={() => nav.openSheet({ type: 'tourSwitcher' })} />
        <div style={{ flex: '0 0 auto', padding: '4px 16px 14px', background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 14px' }}>
            <I.Search size={20} style={{ color: 'var(--muted-2)' }} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players by name"
              style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'var(--ui)', fontSize: 16, background: 'transparent', color: 'var(--text)' }} />
            {q && <div className="row-press" onClick={() => setQ('')} style={{ display: 'flex' }}><I.X size={19} style={{ color: 'var(--muted-2)' }} /></div>}
          </div>
        </div>
        <div className="scroll">
          <div style={{ padding: '14px 16px 120px' }}>
            {q.trim().length >= 2 ? (
              results.length ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 8 }}>{results.length} result{results.length > 1 ? 's' : ''}</div>
                  {results.map((p) => <PlayerResultRow key={p.id} p={p} onClick={() => open(p)} />)}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 24px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>No players match “{q}”.</div>
                  <div style={{ fontSize: 13.5, marginTop: 6 }}>Try a surname, or check the spelling.</div>
                </div>
              )
            ) : q.length === 1 ? (
              <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--muted-2)', fontSize: 13.5 }}>Keep typing — at least two letters.</div>
            ) : (
              <>
                {history.length > 0 && (
                  <div style={{ marginBottom: 22 }}>
                    <U.SectionHeader title="Recent searches" action="Clear" onAction={() => setHistory([])} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {history.map((h) => (
                        <div key={h} className="row-press" onClick={() => setQ(h)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 13px', fontSize: 13.5, fontWeight: 500 }}>
                          <I.Clock size={14} style={{ color: 'var(--muted-2)' }} />{h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <U.SectionHeader title="Popular this week" />
                <div className="card" style={{ overflow: 'hidden' }}>
                  {popular.map((p, i) => <PlayerResultRow key={p.id} p={p} onClick={() => open(p)} divider={i < popular.length - 1} flush />)}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  function PlayerResultRow({ p, onClick, divider, flush }) {
    return (
      <div className="row-press" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: flush ? '12px 16px' : '11px 4px', borderBottom: divider ? '1px solid var(--divider)' : (flush ? 'none' : '1px solid var(--divider)') }}>
        <U.Avatar player={p} size={46} photo />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>{D.fullName(p)} <span style={{ fontSize: 15 }}>{D.flagOf(p.country)}</span></div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{D.tourById(p.tour).short}{p.worldRank ? ` · World #${p.worldRank}` : ''}</div>
        </div>
        <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
      </div>
    );
  }

  /* ============================ PLAYER PROFILE ============================ */
  function PlayerProfileScreen({ nav, params, tier, following, onFollow }) {
    const p = D.playerById(params.id);
    if (!p) return null;
    const results = D.recentResults[p.id] || [
      { t: 'Meridian Championship', pos: 'T18', toPar: -3, when: 'In progress' },
      { t: 'True North Open', pos: 'T24', toPar: -6, when: 'May 2026' },
    ];
    const isFollowing = following.includes(p.id);
    function follow() {
      if (!tier.fan) { nav.openSheet({ type: 'signinPrompt', context: 'follow', player: p }); return; }
      onFollow(p.id); nav.toast(isFollowing ? `Unfollowed ${p.first}` : `Following ${D.fullName(p)}`);
    }
    return (
      <div className="scroll" style={{ background: 'var(--cream)' }}>
        {/* hero */}
        <div style={{ position: 'relative', background: 'var(--ink)', paddingTop: 54, paddingBottom: 22 }}>
          <div className="row-press" onClick={nav.pop} style={{ position: 'absolute', top: 56, left: 12, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 5 }}><I.ChevronLeft size={26} sw={2.1} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px 0' }}>
            <U.Avatar player={p} size={92} photo />
            <div style={{ fontSize: 23, fontWeight: 800, color: '#fff', letterSpacing: -.4, marginTop: 12, display: 'flex', alignItems: 'center', gap: 9 }}>{D.fullName(p)} <span style={{ fontSize: 21 }}>{D.flagOf(p.country)}</span></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>{D.tourById(p.tour).short}{p.worldRank ? ` · World Ranking #${p.worldRank}` : ''}</div>
            <div style={{ marginTop: 16, width: '100%', maxWidth: 240 }}>
              {tier.fan ? (
                <U.Button variant={isFollowing ? 'subtle' : 'gold'} full icon={isFollowing ? <I.Check size={18} /> : <I.Star size={17} />} onClick={follow}>{isFollowing ? 'Following' : 'Follow'}</U.Button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <U.Button variant="dark" full icon={<I.Lock size={16} />} onClick={follow}>Sign in to follow</U.Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '18px 16px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* stats */}
          <div className="card" style={{ display: 'flex', padding: '16px 4px' }}>
            {[['Season earnings', money(p.earnings)], ['Turned pro', String(p.turnedPro)], [p.worldRank ? 'World rank' : 'Status', p.worldRank ? `#${p.worldRank}` : 'Golden Tour']].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', borderLeft: i ? '1px solid var(--divider)' : 'none', padding: '0 6px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase', color: 'var(--muted-2)' }}>{s[0]}</div>
                <div className="tabnums" style={{ fontSize: 15, fontWeight: 800, marginTop: 4, letterSpacing: -.2 }}>{s[1]}</div>
              </div>
            ))}
          </div>

          {/* recent results */}
          <div>
            <U.SectionHeader title="Recent results" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < results.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <div style={{ width: 42, textAlign: 'center' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: .4, color: 'var(--muted-2)' }}>POS</div>
                    <div className="tabnums" style={{ fontSize: 16, fontWeight: 800, color: r.pos === '1' ? 'var(--gold-deep)' : 'var(--text)' }}>{r.pos}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 1 }}>{r.when}</div>
                  </div>
                  <U.Score v={r.toPar} size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* highlights */}
          <div>
            <U.SectionHeader title="Career highlights" />
            <div className="card" style={{ padding: '6px 16px' }}>
              {p.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < p.highlights.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <I.Trophy size={17} style={{ color: 'var(--gold-deep)', flex: '0 0 auto' }} />
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* season-by-season (Order of Merit history) */}
          <div>
            <U.SectionHeader title="Order of Merit history" />
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 50, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)' }}>SEASON</span>
                <span style={{ width: 46, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)', textAlign: 'center' }}>OOM</span>
                <span style={{ flex: 1, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)', textAlign: 'right' }}>EARNINGS</span>
                <span style={{ width: 40, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)', textAlign: 'right' }}>WINS</span>
              </div>
              {careerSeasons(p).map((s, i, a) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <span className="tabnums" style={{ width: 50, fontSize: 13.5, fontWeight: 600 }}>{s.year}</span>
                  <span className="tabnums" style={{ width: 46, textAlign: 'center', fontSize: 14, fontWeight: 800, color: s.oom <= 3 ? 'var(--gold-deep)' : 'var(--text)' }}>{s.oom}</span>
                  <span className="tabnums" style={{ flex: 1, textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(s.earnings)}</span>
                  <span className="tabnums" style={{ width: 40, textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: s.wins ? 'var(--brand)' : 'var(--muted-2)' }}>{s.wins || '–'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'var(--cream-2)' }}>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800, letterSpacing: .4, textTransform: 'uppercase', color: 'var(--muted)' }}>Career money</span>
                <span className="tabnums" style={{ fontSize: 16, fontWeight: 800 }}>{money(careerTotal(p))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // synthesise a plausible 4-season career arc from the player's profile
  function careerSeasons(p) {
    const base = p.earnings || 120000;
    const wins = /Champion|Open Champion|wins|Masters/i.test((p.highlights || []).join(' ')) ? 1 : 0;
    const oom26row = window.PGA_DATA2 ? window.PGA_DATA2.orderOfMerit.find((r) => r.pid === p.id) : null;
    const oom26 = oom26row ? oom26row.position : estOom(p, 0);
    return [
      { year: '2026', oom: oom26, earnings: base, wins: 0 },
      { year: '2025', oom: estOom(p, 3), earnings: Math.round(base * 1.18), wins: wins },
      { year: '2024', oom: estOom(p, 6), earnings: Math.round(base * 0.82), wins: 0 },
      { year: '2023', oom: estOom(p, 9), earnings: Math.round(base * 0.64), wins: wins && p.worldRank && p.worldRank < 40 ? 1 : 0 },
    ];
  }
  function estOom(p, jitter) {
    const wr = p.worldRank || 250;
    const pos = Math.max(1, Math.round(wr / 6) + jitter);
    return pos;
  }
  function careerTotal(p) {
    return careerSeasons(p).reduce((a, s) => a + s.earnings, 0) + Math.round((p.earnings || 100000) * 2.4);
  }

  /* ============================ MORE ============================ */
  function MoreScreen({ nav, tier, onSignOut }) {
    return (
      <>
        <U.Header big="More" subtitle="Account, settings and about" />
        <div className="scroll">
          <div style={{ padding: '8px 16px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* account shortcuts */}
            {tier.fan ? (
              <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
                <U.Avatar name="Jordan Avery" size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>Jordan Avery</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>jordan.avery@email.com · Fan account</div>
                </div>
                <span className="row-press" onClick={onSignOut} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>Sign out</span>
              </div>
            ) : (
              <div className="card" style={{ padding: 18, background: 'var(--ink)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <I.Star size={18} style={{ color: 'var(--gold)' }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Save your favourites</div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.45, marginBottom: 14 }}>Create a free PGA of Atlantica account to follow players, personalise your home, and get tee-time alerts.</div>
                <U.Button variant="gold" full onClick={() => nav.openSheet({ type: 'signinPrompt', context: 'more' })}>Sign in or create account</U.Button>
              </div>
            )}

            {/* member */}
            <div>
              <U.SectionHeader title="PGA Professionals" />
              {tier.member ? (
                <div className="card row-press" onClick={() => nav.enterMember()} style={{ overflow: 'hidden', padding: 16, background: 'var(--ink)', border: 'none', display: 'flex', alignItems: 'center', gap: 13 }}>
                  <window.PGAEmblemMark size={42} onDark />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Enter Player Portal</div><div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>My events, entries, billing & accreditation</div></div>
                  <I.ChevronRight size={18} style={{ color: 'rgba(255,255,255,.7)' }} />
                </div>
              ) : (
                <div className="card row-press" onClick={() => nav.push('memberAuth', {})} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Lock size={19} style={{ color: 'var(--brand)' }} /></div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>I’m a PGA member</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Sign in to enter events & manage your profile</div></div>
                  <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
                </div>
              )}
            </div>

            {/* find a player */}
            <div className="card row-press" onClick={() => nav.push('players', {})} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Users size={20} style={{ color: 'var(--brand)' }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>Find a player</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Search the field by name</div></div>
              <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
            </div>

            {/* settings */}
            <div>
              <U.SectionHeader title="Settings" />
              <div className="card" style={{ overflow: 'hidden' }}>
                {[['Notifications', I.Bell], ['Distance units — Metres', I.MapPin], ['Language — English (AU)', I.Info]].map((s, i, a) => {
                  const Ic = s[1];
                  return (
                  <div key={i} className="row-press" onClick={() => nav.toast('Settings are illustrative in this prototype')} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <Ic size={20} style={{ color: 'var(--muted)' }} />
                    <span style={{ flex: 1, fontSize: 14.5 }}>{s[0]}</span>
                    <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
                  </div>
                  );
                })}
              </div>
            </div>

            {/* about */}
            <div>
              <U.SectionHeader title="About" />
              <div className="card" style={{ overflow: 'hidden' }}>
                {[['About the PGA of Atlantica', I.Info], ['Help & support', I.Help], ['Privacy & terms', I.Document]].map((s, i, a) => {
                  const Ic = s[1];
                  return (
                  <div key={i} className="row-press" onClick={() => nav.toast('Opening…')} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <Ic size={20} style={{ color: 'var(--muted)' }} />
                    <span style={{ flex: 1, fontSize: 14.5 }}>{s[0]}</span>
                    <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
                  </div>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center', marginTop: 18, color: 'var(--muted-2)' }}>
                <window.PGAEmblemMark size={40} />
                <div style={{ fontSize: 12, marginTop: 8 }}>PGA of Atlantica · Version 2.0 (1)</div>
                <div style={{ fontSize: 11.5, marginTop: 2 }}>Est. 1911 · Tours of Atlantica</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============================ SIGN-IN PROMPT (sheet) ============================ */
  function SigninPromptSheet({ ctx, onClose, onCreate, onSignin }) {
    const player = ctx && ctx.player;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-handle" />
        <div style={{ padding: '12px 24px 30px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <I.Star size={30} style={{ color: 'var(--brand)' }} />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, letterSpacing: -.3 }}>Save your favourites</div>
          <div style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 8, lineHeight: 1.45, maxWidth: 300, margin: '8px auto 0' }}>
            {player ? `Create a free account to follow ${D.fullName(player)} and get alerts when they tee off.` : 'A free PGA of Atlantica account lets you follow players, personalise your home and get tee-time alerts.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 24 }}>
            <U.Button variant="primary" size="lg" full onClick={onCreate}>Create account</U.Button>
            <U.Button variant="outline" full onClick={onSignin}>I already have an account</U.Button>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted-2)', marginTop: 16 }}>Creating an account is optional — you can keep browsing as a guest.</div>
        </div>
      </div>
    );
  }

  /* ============================ SIGN UP (full screen) ============================ */
  function SignupScreen({ nav, mode, onComplete }) {
    const signin = mode === 'signin';
    const [f, setF] = useState({ first: '', last: '', email: '', pw: '' });
    const valid = signin ? (f.email && f.pw) : (f.first && f.last && f.email && f.pw.length >= 6);
    const field = (k, label, type, ph, icon) => (
      <div key={k}>
        <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', letterSpacing: .2 }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', marginTop: 6 }}>
          {icon}
          <input type={type || 'text'} value={f[k]} onChange={(e) => setF((s) => ({ ...s, [k]: e.target.value }))} placeholder={ph}
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'var(--ui)', fontSize: 15.5, background: 'transparent', color: 'var(--text)' }} />
        </div>
      </div>
    );
    return (
      <>
        <U.Header onBack={nav.pop} />
        <div className="scroll">
          <div style={{ padding: '4px 22px 120px' }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <window.PGAEmblemMark size={56} color="var(--brand)" />
              <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, letterSpacing: -.4, marginTop: 14 }}>{signin ? 'Welcome back' : 'Create your account'}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{signin ? 'Sign in to your PGA of Atlantica account.' : 'Free, and takes less than a minute.'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {!signin && <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>{field('first', 'First name', 'text', 'Jordan')}</div>
                <div style={{ flex: 1 }}>{field('last', 'Last name', 'text', 'Avery')}</div>
              </div>}
              {field('email', 'Email', 'email', 'you@email.com', <I.Mail size={18} style={{ color: 'var(--muted-2)' }} />)}
              {field('pw', 'Password', 'password', signin ? 'Your password' : 'At least 6 characters', <I.Lock size={18} style={{ color: 'var(--muted-2)' }} />)}
              <div style={{ marginTop: 8 }}>
                <U.Button variant="primary" size="lg" full disabled={!valid} onClick={() => valid && onComplete(f)}>{signin ? 'Sign in' : 'Create account'}</U.Button>
              </div>
              {!signin && <div style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', lineHeight: 1.5 }}>By creating an account you agree to the PGA of Atlantica’s Terms and Privacy Policy. We’ll send a verification email.</div>}
              {signin && <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--brand)', fontWeight: 600 }}>Forgot password?</div>}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ============================ MEMBER AUTH (Tier 3 — GG redirect placeholder) ============================ */
  function MemberAuthScreen({ nav, onComplete }) {
    const [stage, setStage] = useState('intro'); // intro | redirect
    useEffect(() => {
      if (stage === 'redirect') { const t = setTimeout(() => onComplete(), 2100); return () => clearTimeout(t); }
    }, [stage]);
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
          <div className="row-press" onClick={nav.pop} style={{ position: 'absolute', top: 56, left: 12, width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 5 }}><I.ChevronLeft size={26} sw={2.1} /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
            {stage === 'intro' ? (
              <>
                <window.PGAEmblem size={104} monochrome withText />
                <div style={{ fontFamily: 'var(--serif)', fontSize: 25, fontWeight: 700, color: '#fff', marginTop: 26, letterSpacing: -.3, lineHeight: 1.15 }}>PGA Member sign-in</div>
                <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.72)', marginTop: 14, lineHeight: 1.5, maxWidth: 300 }}>
                  Members sign in with their existing Golf Genius tour credentials to enter events and manage their profile.
                </div>
                <div style={{ marginTop: 30, width: '100%', maxWidth: 280 }}>
                  <U.Button variant="gold" size="lg" full onClick={() => setStage('redirect')}>Continue to sign in</U.Button>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}><I.Lock size={13} />Secure sign-in via Golf Genius</div>
              </>
            ) : (
              <>
                <div style={{ width: 64, height: 64 }}>
                  <U.RefreshRing spinning />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 22 }}>Redirecting to secure sign-in…</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 8, fontFamily: 'ui-monospace, monospace' }}>idp.golfgenius.com</div>
                <div style={{ marginTop: 26, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,.07)', fontSize: 11.5, color: 'rgba(255,255,255,.45)', maxWidth: 280, lineHeight: 1.5 }}>
                  This is the only place the Golf Genius name appears — members already use it professionally. Fans never see it.
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ============================ MEMBER AREA (Tier 3) ============================ */
  function MemberAreaScreen({ nav }) {
    return (
      <>
        <U.Header onBack={nav.pop} big="Member area" accentDark
          right={<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: .4, color: 'rgba(255,255,255,.55)' }}>PGA PRO</span>} />
        <div className="scroll" style={{ background: 'var(--cream)' }}>
          <div style={{ padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
              <U.Avatar name="Liam Carter" size={50} photo />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Liam Carter</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Member #AT-40218 · Full playing rights</div>
              </div>
            </div>

            {/* tournament entry CTA */}
            <div className="card" style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}>
              <div style={{ background: 'var(--brand)', color: '#fff', padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                  <I.Ticket size={20} /><span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>Open for entry</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, lineHeight: 1.15 }}>The Atlas Open</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 4 }}>Entries close 18 Jun · Kingston Heath</div>
              </div>
              <div style={{ padding: 14 }}>
                <U.Button variant="primary" full onClick={() => nav.toast('Entry flow — member only')}>Enter tournament</U.Button>
              </div>
            </div>

            {/* my recent results */}
            <div>
              <U.SectionHeader title="My recent results" />
              <div className="card" style={{ overflow: 'hidden' }}>
                {[['Meridian Championship', 'T31', -1, 'In progress'], ['Waypoint Series Hunter Valley', 'T12', -6, 'May 2026'], ['The Longitude Classic', 'MC', 4, 'May 2026']].map((r, i, a) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <div style={{ width: 40, textAlign: 'center' }}><div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted-2)' }}>POS</div><div className="tabnums" style={{ fontSize: 15, fontWeight: 800 }}>{r[1]}</div></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{r[0]}</div><div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{r[3]}</div></div>
                    {r[1] !== 'MC' && <U.Score v={r[2]} size={15} />}
                  </div>
                ))}
              </div>
            </div>

            {/* manage profile + GG note */}
            <div className="card row-press" onClick={() => nav.toast('Profile management — member only')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Settings size={19} style={{ color: 'var(--brand)' }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>Manage my profile</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Contact details, handicap, equipment</div></div>
              <I.ChevronRight size={18} style={{ color: 'var(--muted-2)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 11.5, color: 'var(--muted-2)' }}>
              <I.Lock size={13} /> Signed in via Golf Genius · <span className="row-press" style={{ color: 'var(--brand)', fontWeight: 600 }} onClick={() => { nav.pop(); }}>Sign out</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  window.PGAScreens2 = {
    ScheduleScreen, TournamentDetailScreen, PlayersScreen, PlayerProfileScreen,
    MoreScreen, SigninPromptSheet, SignupScreen, MemberAuthScreen, MemberAreaScreen,
  };
})();
