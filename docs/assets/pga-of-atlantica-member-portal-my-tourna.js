/* PGA of Atlantica — Member portal: My Tournaments, event hub, Info Hub, Profile/self-service,
   invoice & billing, accreditation passes. Exposes window.PGAMember. */
(function () {
  const { useState } = React;
  const I = window.PGAIcons;
  const D = window.PGA_DATA;
  const D2 = window.PGA_DATA2;
  const U = window.PGAUI;
  const M = D2.member;
  const money = D2.money;
  const moneyK = (n) => n >= 1000 ? '$' + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : '$' + n;
  const fmtDates = (s, e) => {
    const ds = new Date(s + 'T00:00:00'), de = new Date(e + 'T00:00:00');
    const mo = (d) => d.toLocaleDateString('en-AU', { month: 'short' });
    if (ds.getMonth() === de.getMonth()) return `${ds.getDate()}–${de.getDate()} ${mo(de)}`;
    return `${ds.getDate()} ${mo(ds)} – ${de.getDate()} ${mo(de)}`;
  };

  const ENTRY = {
    entered: { label: 'Entered', bg: 'var(--brand-tint)', fg: 'var(--brand)' },
    open: { label: 'Open for entry', bg: 'var(--gold-tint)', fg: 'var(--gold-deep)' },
    upcoming: { label: 'Opens soon', bg: 'var(--cream-2)', fg: 'var(--muted)' },
    played: { label: 'Played', bg: 'var(--cream-2)', fg: 'var(--muted-2)' },
  };

  /* ===================== PORTAL — MY TOURNAMENTS ===================== */
  function PortalScreen({ nav }) {
    const [multi, setMulti] = useState(false);
    const [picked, setPicked] = useState([]);
    const events = D2.myTournaments;
    const openable = events.filter((e) => e.entry === 'open');

    function togglePick(id) { setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); }
    function enterAll() {
      const n = picked.length;
      setMulti(false); setPicked([]);
      nav.toast(`Entered ${n} tournament${n > 1 ? 's' : ''} · confirmations sent`);
    }

    return (
      <>
        <U.Header big="My Tournaments" accentDark
          subtitle="Player Portal · Enter, withdraw & prepare"
          right={<U.HeaderAction icon={<I.Bell size={22} />} badge onClick={() => nav.push('notifications', {})} />} />
        <div className="scroll">
          <div style={{ padding: '14px 16px 120px' }}>
            {/* greeting + multi-enter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3 }}>G’day, {M.first}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{openable.length} events open for entry</div>
              </div>
              {openable.length > 1 && (
                <U.Button variant={multi ? 'subtle' : 'ghost'} size="sm" icon={multi ? <I.X size={15} /> : <I.Check size={16} />} onClick={() => { setMulti((m) => !m); setPicked([]); }}>
                  {multi ? 'Cancel' : 'Enter multiple'}
                </U.Button>
              )}
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              {events.map((ev, i) => {
                const st = ENTRY[ev.entry];
                const pickable = multi && ev.entry === 'open';
                const checked = picked.includes(ev.id);
                return (
                  <div key={ev.id} className="row-press"
                    onClick={() => pickable ? togglePick(ev.id) : nav.push('eventHub', { id: ev.id })}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < events.length - 1 ? '1px solid var(--divider)' : 'none', opacity: multi && !pickable ? .5 : 1 }}>
                    {pickable && (
                      <div style={{ width: 24, height: 24, borderRadius: 7, flex: '0 0 auto', border: checked ? 'none' : '2px solid var(--border-strong)', background: checked ? 'var(--brand)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {checked && <I.Check size={15} stroke="#fff" sw={2.8} />}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.short}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{fmtDates(ev.start, ev.end)} · {ev.course}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .4, textTransform: 'uppercase', color: st.fg, background: st.bg, padding: '3px 8px', borderRadius: 6 }}>{st.label}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>{ev.note}</span>
                      </div>
                    </div>
                    {!multi && <I.ChevronRight size={18} style={{ color: 'var(--muted-2)', flex: '0 0 auto' }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-2)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
              Tap a tournament for entry, draws, pin sheets and everything you need for the week.
            </div>
          </div>
        </div>
        {/* multi-enter action bar */}
        {multi && picked.length > 0 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 86, padding: '12px 16px', background: 'rgba(246,243,235,.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', zIndex: 700 }}>
            <U.Button variant="primary" full size="lg" onClick={enterAll}>Enter {picked.length} selected tournament{picked.length > 1 ? 's' : ''}</U.Button>
          </div>
        )}
      </>
    );
  }

  /* ===================== EVENT HUB (per-event player view) ===================== */
  function EventHubScreen({ nav, params }) {
    const ev = D2.myTournaments.find((e) => e.id === params.id);
    const hub = D2.eventHub[params.id];
    const [tab, setTab] = useState('overview');
    const [entered, setEntered] = useState(ev && ev.entry === 'entered');
    if (!ev) return null;
    const st = ENTRY[entered ? 'entered' : ev.entry];

    const tabs = [['overview', 'Overview'], ['pre', 'Pre-event'], ['week', 'Event week'], ['practice', 'Practice'], ['entries', 'Entries']];

    return (
      <div className="scroll" style={{ background: 'var(--cream)' }}>
        {/* hero */}
        <div style={{ position: 'relative', background: 'var(--ink)', paddingTop: 54, paddingBottom: 18 }}>
          <div className="row-press" onClick={nav.pop} style={{ position: 'absolute', top: 56, left: 12, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 5 }}><I.ChevronLeft size={26} sw={2.1} /></div>
          <div style={{ padding: '8px 18px 0' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Player Portal · My event</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 23, fontWeight: 700, color: '#fff', marginTop: 6, lineHeight: 1.12 }}>{ev.short}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}><I.Calendar size={14} />{fmtDates(ev.start, ev.end)} · {ev.course}</div>
          </div>
        </div>
        {/* entry status / action */}
        <div style={{ padding: '14px 16px 0' }}>
          <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              {entered ? <I.Check size={22} stroke={st.fg} sw={2.4} /> : <I.Ticket size={21} style={{ color: st.fg }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{entered ? 'You’re in the field' : ev.entry === 'open' ? 'Open for entry' : 'Entries not yet open'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{ev.note}</div>
            </div>
            {ev.entry === 'open' && (
              <U.Button variant={entered ? 'subtle' : 'primary'} size="sm" onClick={() => { setEntered((e) => !e); nav.toast(entered ? 'Withdrawn from event' : 'Entry confirmed'); }}>
                {entered ? 'Withdraw' : 'Enter'}
              </U.Button>
            )}
          </div>
        </div>
        {/* tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 16px 10px', overflowX: 'auto' }} className="scroll">
          {tabs.map(([id, label]) => (
            <div key={id} onClick={() => setTab(id)} className="row-press"
              style={{ flex: '0 0 auto', padding: '8px 15px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                background: tab === id ? 'var(--brand)' : 'var(--cream-2)', color: tab === id ? '#fff' : 'var(--text)' }}>{label}</div>
          ))}
        </div>
        <div style={{ padding: '0 16px 120px' }}>
          {!hub ? (
            <div className="card" style={{ padding: '26px 20px', textAlign: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><I.Clock size={24} style={{ color: 'var(--brand)' }} /></div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Published closer to the event</div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.45 }}>Overview, draws, pin sheets and practice times appear here once the tournament office releases them.</div>
            </div>
          ) : tab === 'overview' ? (
            <div className="card" style={{ overflow: 'hidden' }}>
              {hub.overview.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < hub.overview.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)', width: 116, flex: '0 0 auto' }}>{f[0]}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{f[1]}</span>
                </div>
              ))}
            </div>
          ) : tab === 'entries' ? (
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <I.Users size={24} style={{ color: 'var(--brand)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{hub.entries.count} players entered</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{hub.entries.status} · closes {hub.entries.closes}</div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <U.Button variant="ghost" full onClick={() => nav.toast('Full entry list')}>View full entry list</U.Button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 12, textAlign: 'center' }}>Entry lists with cut-offs publish after entries close.</div>
            </div>
          ) : (
            <HubList items={hub[tab]} nav={nav} />
          )}
        </div>
      </div>
    );
  }

  function HubList({ items, nav }) {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        {items.map((it, i) => {
          const Ic = I[it.icon] || I.Document;
          return (
            <div key={i} className="row-press" onClick={() => nav.toast('Opening ' + it.t)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderBottom: i < items.length - 1 ? '1px solid var(--divider)' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ic size={19} style={{ color: 'var(--brand)' }} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1, lineHeight: 1.35 }}>{it.d}</div>
              </div>
              <I.ChevronRight size={17} style={{ color: 'var(--muted-2)', flex: '0 0 auto' }} />
            </div>
          );
        })}
      </div>
    );
  }

  /* ===================== INFO HUB ===================== */
  function InfoHubScreen({ nav }) {
    return (
      <>
        <U.Header big="Info Hub" accentDark subtitle="Everything a member needs, in one place"
          right={<U.HeaderAction icon={<I.Search size={22} />} onClick={() => nav.toast('Search the Info Hub')} />} />
        <div className="scroll">
          <div style={{ padding: '14px 16px 120px' }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              {D2.infoHub.map((it, i) => {
                const Ic = I[it.icon] || I.Document;
                return (
                  <div key={it.id} className="row-press" onClick={() => nav.push('infoDetail', { id: it.id })}
                    style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: i < D2.infoHub.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Ic size={20} style={{ color: 'var(--brand)' }} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{it.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{it.sub}</div>
                    </div>
                    <I.ChevronRight size={18} style={{ color: 'var(--muted-2)', flex: '0 0 auto' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  function InfoDetailScreen({ nav, params }) {
    const it = D2.infoHub.find((x) => x.id === params.id);
    if (!it) return null;
    const Ic = I[it.icon] || I.Document;
    return (
      <>
        <U.Header onBack={nav.pop} />
        <div className="scroll">
          <div style={{ padding: '0 20px 120px' }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><Ic size={26} style={{ color: 'var(--brand)' }} /></div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, letterSpacing: -.4, lineHeight: 1.1 }}>{it.title}</div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6 }}>{it.sub}</div>
            <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, marginTop: 18 }}>
              {it.body || 'This section contains the full reference material for ' + it.title.toLowerCase() + '. In the live app members can read, search and download the relevant documents and policies here.'}
            </div>
            <div className="card" style={{ overflow: 'hidden', marginTop: 20 }}>
              {['Download PDF', 'Related notices', 'Contact the tour office'].map((a, i, arr) => (
                <div key={i} className="row-press" onClick={() => nav.toast(a)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <I.Document size={18} style={{ color: 'var(--muted)' }} />
                  <span style={{ flex: 1, fontSize: 14 }}>{a}</span>
                  <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ===================== PROFILE / SELF-SERVICE ===================== */
  function ProfileScreen({ nav, onExitMember, onSignOut }) {
    const actions = [
      { id: 'notifications', label: 'Notifications', icon: 'Bell', badge: true },
      { id: 'accreditation', label: 'Accreditation', icon: 'Ticket' },
      { id: 'invoice', label: 'Billing', icon: 'Wallet' },
      { id: 'manage', label: 'My details', icon: 'Settings' },
    ];
    return (
      <>
        <U.Header big="Profile" accentDark subtitle={`Member ${M.memberNo} · ${M.status}`} />
        <div className="scroll">
          <div style={{ padding: '14px 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* identity */}
            <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <U.Avatar name={M.name} size={56} photo />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3 }}>{M.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>OoM #{M.oomPos} · {M.oomPoints} pts · {moneyK(M.seasonEarnings)}</div>
              </div>
            </div>

            {/* quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {actions.map((a) => {
                const Ic = I[a.icon];
                return (
                  <div key={a.id} className="card row-press" onClick={() => a.id === 'manage' ? nav.toast('Manage my details — contact, handicap, equipment') : nav.push(a.id, {})}
                    style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 11, position: 'relative' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={19} style={{ color: 'var(--brand)' }} /></div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</span>
                    {a.badge && <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, background: 'var(--gold)' }} />}
                  </div>
                );
              })}
            </div>

            {/* season summary */}
            <div>
              <U.SectionHeader title="My 2026 season" />
              <div className="card" style={{ display: 'flex', flexWrap: 'wrap', padding: '8px 0' }}>
                {[['OoM position', '#' + M.oomPos], ['Race points', M.oomPoints], ['Earnings', moneyK(M.seasonEarnings)], ['Events', M.events], ['Cuts made', M.cutsMade + '/' + M.events], ['Best finish', M.bestFinish]].map((s, i) => (
                  <div key={i} style={{ width: '33.33%', textAlign: 'center', padding: '10px 4px', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
                    <div className="tabnums" style={{ fontSize: 17, fontWeight: 800, letterSpacing: -.2 }}>{s[1]}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: .3, textTransform: 'uppercase', color: 'var(--muted-2)', marginTop: 2 }}>{s[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* my results with earnings + points */}
            <div>
              <U.SectionHeader title="My results" action="Order of Merit" onAction={() => nav.switchTab('rankings')} />
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 34, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)' }}>POS</span>
                  <span style={{ flex: 1, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)' }}>EVENT</span>
                  <span style={{ width: 54, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)', textAlign: 'right' }}>EARNED</span>
                  <span style={{ width: 38, fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: 'var(--muted-2)', textAlign: 'right' }}>PTS</span>
                </div>
                {D2.memberResults.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: i < D2.memberResults.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <span className="tabnums" style={{ width: 34, fontSize: 14, fontWeight: 800, color: r.pos === 'MC' ? 'var(--over)' : 'var(--text)' }}>{r.pos}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.t}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{r.when}</div>
                    </div>
                    <span className="tabnums" style={{ width: 54, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{r.earnings ? moneyK(r.earnings) : '—'}</span>
                    <span className="tabnums" style={{ width: 38, textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.points ? 'var(--brand)' : 'var(--muted-2)' }}>{r.points || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* membership & billing */}
            <div>
              <U.SectionHeader title="Membership & billing" />
              <div className="card row-press" onClick={() => nav.push('invoice', {})} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13, border: '1px solid #e8d6ad', background: 'var(--gold-tint)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Wallet size={21} style={{ color: 'var(--gold-deep)' }} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>Invoice due — {money(M.invoice.amount)}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{M.invoice.desc} · due 15 Jul</div>
                </div>
                <I.ChevronRight size={18} style={{ color: 'var(--gold-deep)' }} />
              </div>
            </div>

            {/* manager */}
            <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
              <U.Avatar name={M.manager.name} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: .5, textTransform: 'uppercase', color: 'var(--muted-2)' }}>Your manager</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 1 }}>{M.manager.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{M.manager.agency} · acts for {M.manager.acts} members</div>
              </div>
            </div>

            {/* mode switch + sign out */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="row-press" onClick={onExitMember} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--divider)' }}>
                <I.Eye size={19} style={{ color: 'var(--brand)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>Browse as a fan</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>See the public app — your portal stays one tap away</div>
                </div>
                <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
              </div>
              <div className="row-press" onClick={onSignOut} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <I.Lock size={19} style={{ color: 'var(--over)' }} />
                <span style={{ flex: 1, fontSize: 14.5, color: 'var(--over)', fontWeight: 600 }}>Sign out</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 11.5, color: 'var(--muted-2)' }}>
              <I.Lock size={13} /> Signed in via Golf Genius
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ===================== INVOICE / PAY ===================== */
  function InvoiceScreen({ nav }) {
    const [paid, setPaid] = useState(false);
    const inv = M.invoice;
    if (paid) {
      return (
        <>
          <U.Header onBack={nav.pop} />
          <div className="scroll"><div style={{ padding: '20px 24px 120px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 76, height: 76, borderRadius: 38, background: 'var(--brand-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}><I.Check size={40} stroke="var(--brand)" sw={2.4} /></div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, marginTop: 18 }}>Payment received</div>
            <div style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5, maxWidth: 280 }}>{money(inv.amount)} paid for your {inv.desc.toLowerCase()}. A receipt has been emailed to you.</div>
            <div style={{ marginTop: 26, width: '100%', maxWidth: 260 }}><U.Button variant="primary" full onClick={nav.pop}>Done</U.Button></div>
          </div></div>
        </>
      );
    }
    return (
      <>
        <U.Header onBack={nav.pop} big="Billing" />
        <div className="scroll">
          <div style={{ padding: '4px 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px', background: 'var(--ink)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Amount due</span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: '#ffd27a', background: 'rgba(255,210,122,.16)', padding: '3px 8px', borderRadius: 6 }}>DUE 15 JUL</span>
                </div>
                <div className="tabnums" style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginTop: 4 }}>{money(inv.amount)}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{inv.no}</div>
              </div>
              <div style={{ padding: '6px 16px' }}>
                {[['2026 Membership renewal', 1250], ['Tournament levy', 150], ['Insurance contribution', 50]].map((li, i, a) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{li[0]}</span>
                    <span className="tabnums" style={{ fontSize: 13.5, fontWeight: 600 }}>{money(li[1])}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* payment method */}
            <div>
              <U.SectionHeader title="Payment method" />
              <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 46, height: 32, borderRadius: 6, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: .5, flex: '0 0 auto' }}>VISA</div>
                <div style={{ flex: 1 }}>
                  <div className="tabnums" style={{ fontSize: 14.5, fontWeight: 600 }}>•••• {M.card.last4}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Expires {M.card.exp}</div>
                </div>
                <span className="row-press" onClick={() => nav.toast('Update card details')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>Change</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 8, padding: '0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <I.Info size={13} /> Heath & Jo both flagged that members struggle to find this — it now lives in Billing.
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px 30px', background: 'rgba(246,243,235,.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)' }}>
          <U.Button variant="primary" full size="lg" onClick={() => setPaid(true)}>Pay {money(inv.amount)}</U.Button>
        </div>
      </>
    );
  }

  /* ===================== ACCREDITATION PASSES ===================== */
  function AccreditationScreen({ nav }) {
    return (
      <>
        <U.Header onBack={nav.pop} big="Accreditation" subtitle="Meridian Championship" />
        <div className="scroll">
          <div style={{ padding: '8px 16px 120px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14, padding: '0 2px' }}>
              Manage passes for your team in one place. Scan at the gate — no printing, no paper.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {D2.accreditation.map((a, i) => <PassCard key={i} a={a} nav={nav} />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  function PassCard({ a, nav }) {
    const active = a.status === 'active';
    const roleColor = { Player: 'var(--brand)', Caddie: 'var(--ink)', Manager: 'var(--gold-deep)', Guest: 'var(--muted)' }[a.role] || 'var(--brand)';
    return (
      <div className="card" style={{ overflow: 'hidden', opacity: active ? 1 : 1 }}>
        <div style={{ display: 'flex' }}>
          {/* QR placeholder */}
          <div style={{ width: 96, flex: '0 0 auto', background: active ? roleColor : 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            {active ? <QR /> : <I.Lock size={28} style={{ color: 'var(--muted-2)' }} />}
          </div>
          <div style={{ flex: 1, padding: '13px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: '#fff', background: roleColor, padding: '3px 8px', borderRadius: 5 }}>{a.role}</span>
              {!active && <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gold-deep)' }}>ACTION NEEDED</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{a.name}</div>
            <div className="tabnums" style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 1 }}>{a.id}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><I.Pin size={12} />{a.zones}</div>
            {!active && <div style={{ marginTop: 10 }}><U.Button variant="gold" size="sm" onClick={() => nav.toast('Guest pass requested')}>Request guest pass</U.Button></div>}
          </div>
        </div>
      </div>
    );
  }
  function QR() {
    // deterministic pseudo-QR
    const cells = [];
    for (let i = 0; i < 49; i++) cells.push((i * 7 + (i % 5) + (i % 3)) % 2 === 0);
    return (
      <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 8, padding: 6, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1.5 }}>
        {cells.map((on, i) => <div key={i} style={{ background: on ? '#0c2038' : 'transparent', borderRadius: 1 }} />)}
      </div>
    );
  }

  window.PGAMember = {
    PortalScreen, EventHubScreen, InfoHubScreen, InfoDetailScreen,
    ProfileScreen, InvoiceScreen, AccreditationScreen,
  };
})();
