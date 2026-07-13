/* PGA of Atlantica — Rankings (Order of Merit) + points breakdown + Notification centre.
   Shared between fan mode and member mode. Exposes window.PGARankings. */
(function () {
  const { useState } = React;
  const I = window.PGAIcons;
  const D = window.PGA_DATA;
  const D2 = window.PGA_DATA2;
  const U = window.PGAUI;
  const money = D2.money;
  const moneyK = (n) => n >= 1000 ? '$' + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : '$' + n;

  /* ============================ ORDER OF MERIT ============================ */
  function RankingsScreen({ nav, tour, mode }) {
    const [metric, setMetric] = useState('points'); // points | money
    const oom = D2.orderOfMerit;
    const me = oom.find((r) => r.isMe);
    const isMember = mode === 'member';

    return (
      <>
        <U.Header tour={isMember ? null : tour} big={isMember ? 'Order of Merit' : undefined}
          onTourPress={isMember ? undefined : () => nav.openSheet({ type: 'tourSwitcher' })}
          subtitle={isMember ? '2026 season · Atlas Golf Tour' : undefined}
          right={<U.HeaderAction icon={<I.Info size={22} />} onClick={() => nav.openSheet({ type: 'exemptions' })} />} />
        {!isMember && (
          <div style={{ flex: '0 0 auto', background: 'var(--cream)', padding: '0 16px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -.4 }}>Order of Merit</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>2026 season · {tour.short}</div>
          </div>
        )}
        {/* metric toggle */}
        <div style={{ flex: '0 0 auto', background: 'var(--cream)', padding: '10px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <Segmented value={metric} onChange={setMetric}
            options={[['points', 'Race points'], ['money', 'Prize money']]} />
        </div>
        <div className="scroll">
          {isMember && me && <MyRankCard me={me} metric={metric} nav={nav} />}
          {/* column header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 2 }}>
            <span style={{ width: 22, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)' }}>POS</span>
            <span style={{ width: 20 }} />
            <span style={{ flex: 1, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)' }}>PLAYER</span>
            <span style={{ width: 44, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)', textAlign: 'right' }}>EVENTS</span>
            <span style={{ width: 64, fontSize: 10, fontWeight: 800, letterSpacing: .6, color: 'var(--muted-2)', textAlign: 'right' }}>{metric === 'points' ? 'POINTS' : 'MONEY'}</span>
          </div>
          <div style={{ paddingBottom: 120 }}>
            {oom.map((r, i) => (
              <React.Fragment key={r.pid}>
                <OomRow r={r} metric={metric} nav={nav} mine={r.isMe} />
                {D2.oomBands[i + 1] && <CutLine band={D2.oomBands[i + 1]} rank={i + 1} />}
              </React.Fragment>
            ))}
            <div style={{ textAlign: 'center', padding: '16px 24px', color: 'var(--muted-2)', fontSize: 12, lineHeight: 1.5 }}>
              Cut-off lines show 2027 exemption categories. Tap any player for a points breakdown.
            </div>
          </div>
        </div>
      </>
    );
  }

  function Segmented({ value, onChange, options }) {
    return (
      <div style={{ display: 'flex', background: 'var(--cream-2)', borderRadius: 11, padding: 3, gap: 3 }}>
        {options.map(([val, label]) => {
          const on = val === value;
          return (
            <div key={val} onClick={() => onChange(val)} className="row-press"
              style={{ flex: 1, textAlign: 'center', padding: '8px 6px', borderRadius: 8, cursor: 'pointer',
                background: on ? '#fff' : 'transparent', color: on ? 'var(--brand)' : 'var(--muted)',
                fontSize: 13, fontWeight: on ? 700 : 600, boxShadow: on ? '0 1px 2px rgba(0,0,0,.08)' : 'none' }}>
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  function OomRow({ r, metric, nav, mine }) {
    return (
      <div className="row-press" onClick={() => nav.openSheet({ type: 'oomBreakdown', pid: r.pid })}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--divider)', background: mine ? 'var(--brand-tint)' : '#fff' }}>
        <span className="tabnums" style={{ width: 22, fontSize: 15, fontWeight: 700, color: r.position <= 3 ? 'var(--gold-deep)' : 'var(--text)' }}>{r.position}</span>
        <span style={{ width: 20, display: 'flex' }}><U.PosChange v={r.move} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 16 }}>{r.flag}</span>
          <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
          {mine && <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: .6, color: '#fff', background: 'var(--brand)', padding: '2px 6px', borderRadius: 5 }}>YOU</span>}
        </div>
        <span className="tabnums" style={{ width: 44, textAlign: 'right', fontSize: 13.5, color: 'var(--muted)' }}>{r.events}</span>
        <span className="tabnums" style={{ width: 64, textAlign: 'right', fontSize: 15, fontWeight: 800, letterSpacing: -.2 }}>{metric === 'points' ? r.points.toLocaleString() : moneyK(r.earnings)}</span>
      </div>
    );
  }

  function CutLine({ band, rank }) {
    const tone = band.tone === 'gold' ? { line: 'var(--gold)', text: 'var(--gold-deep)', bg: 'var(--gold-tint)' }
      : band.tone === 'green' ? { line: 'var(--brand)', text: 'var(--brand)', bg: 'var(--brand-tint)' }
      : { line: 'var(--border-strong)', text: 'var(--muted)', bg: 'var(--cream-2)' };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', background: tone.bg, borderTop: `2px solid ${tone.line}`, borderBottom: `1px solid ${tone.line}33` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, textTransform: 'uppercase', color: tone.text }}>{band.label}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{band.sub}</div>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: tone.text }}>Top {rank} line</span>
      </div>
    );
  }

  function MyRankCard({ me, metric, nav }) {
    return (
      <div style={{ padding: '14px 16px 4px' }}>
        <div className="card" style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}>
          <div style={{ background: 'var(--ink)', color: '#fff', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .6, color: 'rgba(255,255,255,.55)' }}>MY POSITION</div>
              <div className="tabnums" style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>{me.position}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 18 }}>
                <Stat label="Points" value={me.points.toLocaleString()} />
                <Stat label="Earnings" value={moneyK(me.earnings)} />
                <Stat label="Events" value={me.events} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <U.PosChange v={me.move} /> {me.move > 0 ? `Up ${me.move} since last event` : me.move < 0 ? `Down ${Math.abs(me.move)}` : 'No change'}
              </div>
            </div>
          </div>
          <div className="row-press" onClick={() => nav.openSheet({ type: 'oomBreakdown', pid: 'me' })} style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand)' }}>
            <I.Trending size={17} /><span style={{ fontSize: 13.5, fontWeight: 600 }}>See how I earned my points</span>
            <I.ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--muted-2)' }} />
          </div>
        </div>
      </div>
    );
  }
  function Stat({ label, value }) {
    return (
      <div>
        <div className="tabnums" style={{ fontSize: 17, fontWeight: 800, letterSpacing: -.3 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: .3, textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginTop: 1 }}>{label}</div>
      </div>
    );
  }

  /* ============================ OOM BREAKDOWN SHEET ============================ */
  function OomBreakdownSheet({ pid, nav, onClose }) {
    const row = D2.orderOfMerit.find((r) => r.pid === pid);
    const breakdown = D2.oomBreakdown(pid) || [];
    const player = D.playerById(pid);
    if (!row) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <div className="sheet-handle" />
        <div style={{ padding: '6px 20px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted-2)' }}>OOM</div>
              <div className="tabnums" style={{ fontSize: 26, fontWeight: 800, color: row.position <= 3 ? 'var(--gold-deep)' : 'var(--text)', lineHeight: 1 }}>{row.position}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3, display: 'flex', alignItems: 'center', gap: 7 }}>{row.name} <span style={{ fontSize: 15 }}>{row.flag}</span></div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 1 }}>{row.points.toLocaleString()} pts · {money(row.earnings)} · {row.events} events</div>
            </div>
          </div>
        </div>
        <div className="scroll" style={{ padding: '14px 16px 30px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 8, padding: '0 2px' }}>Points by event</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {breakdown.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < breakdown.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <div style={{ width: 34, textAlign: 'center' }}>
                  <div className="tabnums" style={{ fontSize: 14, fontWeight: 800, color: e.pos === '1' ? 'var(--gold-deep)' : 'var(--text)' }}>{e.pos}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.t}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>{e.when} 2026</div>
                </div>
                <div className="tabnums" style={{ fontSize: 15, fontWeight: 800, color: 'var(--brand)' }}>+{e.pts}</div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: 'var(--cream-2)' }}>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800, letterSpacing: .4, textTransform: 'uppercase', color: 'var(--muted)' }}>Season total</span>
              <span className="tabnums" style={{ fontSize: 17, fontWeight: 800 }}>{row.points.toLocaleString()} pts</span>
            </div>
          </div>
          {player && (
            <div style={{ marginTop: 14 }}>
              <U.Button variant="ghost" full onClick={() => { onClose(); setTimeout(() => nav.push('player', { id: player.id }), 260); }}>View full player profile</U.Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================ EXEMPTIONS EXPLAINER SHEET ============================ */
  function ExemptionsSheet({ onClose }) {
    const bands = [
      { tone: 'gold', label: 'Top 7 — DP World Tour cards', sub: 'The leading 7 players earn 2027 DP World Tour membership.' },
      { tone: 'green', label: 'Top 15 — Full exemption', sub: 'Fully exempt into all 2027 Atlas Golf Tour events.' },
      { tone: 'muted', label: 'Top 30 — Conditional status', sub: 'Retain partial playing rights and re-rank priority.' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -.3 }}>Exemption categories</div>
          <div className="row-press" onClick={onClose} style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.X size={18} /></div>
        </div>
        <div style={{ padding: '0 16px 30px' }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
            Where a player finishes on the Order of Merit determines their playing rights for next season. The cut-off lines on the rankings mark each threshold.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bands.map((b, i) => {
              const c = b.tone === 'gold' ? 'var(--gold)' : b.tone === 'green' ? 'var(--brand)' : 'var(--border-strong)';
              return (
                <div key={i} className="card" style={{ padding: 14, borderLeft: `4px solid ${c}` }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{b.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{b.sub}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 16, lineHeight: 1.5, textAlign: 'center' }}>
            Categories shown are illustrative. Full eligibility rules live in the Info Hub.
          </div>
        </div>
      </div>
    );
  }

  /* ============================ NOTIFICATION CENTRE ============================ */
  function NotificationsScreen({ nav, mode, onBack }) {
    const isMember = mode === 'member';
    const list = isMember ? D2.memberNotifications : D2.fanNotifications;
    const [items, setItems] = useState(list);
    const toneColor = (t) => t === 'live' ? 'var(--live)' : t === 'gold' ? 'var(--gold-deep)' : t === 'green' ? 'var(--brand)' : 'var(--muted)';
    const toneBg = (t) => t === 'live' ? 'rgba(214,51,42,.1)' : t === 'gold' ? 'var(--gold-tint)' : t === 'green' ? 'var(--brand-tint)' : 'var(--cream-2)';
    return (
      <>
        <U.Header onBack={onBack} big="Notifications"
          right={<span className="row-press" onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)', padding: '8px 10px' }}>Mark all read</span>} />
        <div className="scroll">
          <div style={{ padding: '8px 16px 120px' }}>
            {isMember && (
              <div style={{ fontSize: 11.5, color: 'var(--muted)', background: 'var(--gold-tint)', border: '1px solid #e8d6ad', borderRadius: 10, padding: '10px 12px', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <I.Bell size={15} style={{ color: 'var(--gold-deep)', flex: '0 0 auto' }} />
                Tournament Office can push messages to the whole field or selected players.
              </div>
            )}
            <div className="card" style={{ overflow: 'hidden' }}>
              {items.map((n, i) => {
                const Ic = I[n.icon] || I.Bell;
                return (
                  <div key={n.id} className="row-press" onClick={() => { setItems((xs) => xs.map((x) => x.id === n.id ? { ...x, unread: false } : x)); nav.toast('Opening…'); }}
                    style={{ display: 'flex', gap: 12, padding: '14px 14px', borderBottom: i < items.length - 1 ? '1px solid var(--divider)' : 'none', background: n.unread ? 'var(--brand-tint)' : '#fff', alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: toneBg(n.tone), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <Ic size={19} style={{ color: toneColor(n.tone) }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {n.from && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .4, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 2 }}>{n.from}</div>}
                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{n.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 5 }}>{n.when}</div>
                    </div>
                    {n.unread && <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--brand)', flex: '0 0 auto', marginTop: 6 }} />}
                  </div>
                );
              })}
            </div>
            <div className="card row-press" onClick={() => nav.toast('Notification settings')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginTop: 14 }}>
              <I.Settings size={19} style={{ color: 'var(--muted)' }} />
              <span style={{ flex: 1, fontSize: 14.5 }}>Manage alert preferences</span>
              <I.ChevronRight size={17} style={{ color: 'var(--muted-2)' }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  window.PGARankings = { RankingsScreen, OomBreakdownSheet, ExemptionsSheet, NotificationsScreen };
})();
