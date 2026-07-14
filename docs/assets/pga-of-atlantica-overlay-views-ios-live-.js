/* PGA of Atlantica — overlay views: iOS Live Activity mock + visual style guide. */
(function () {
  const I = window.PGAIcons;
  const D = window.PGA_DATA;
  const U = window.PGAUI;

  /* ===================== iOS LIVE ACTIVITY (lock screen) ===================== */
  function LiveActivityView({ onClose }) {
    const t = D.tournaments.find((x) => x.id === 't-atlpga');
    const top3 = D.leaderboard.slice(0, 3);
    const leader = top3[0];
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 80px' }}>
        <button className="overlay-close" onClick={onClose}><I.X size={20} /></button>
        <div style={{ textAlign: 'center', maxWidth: 460, marginBottom: 30 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--gold)' }}>Key interaction</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 8, letterSpacing: -.4 }}>iOS Live Activity</div>
          <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.6)', marginTop: 8, lineHeight: 1.5 }}>The leaderboard pinned to the lock screen and Dynamic Island — updating live without opening the app.</div>
        </div>

        {/* lock screen phone */}
        <div style={{ width: 330, height: 690, background: '#000', borderRadius: 50, padding: 5, boxShadow: 'var(--shadow-float), 0 30px 70px rgba(0,0,0,.5)', flex: '0 0 auto' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 45, overflow: 'hidden',
            background: 'linear-gradient(165deg, #0c2f55 0%, #071f3a 55%, #041527 100%)' }}>
            {/* texture */}
            <div className="img-ph" style={{ position: 'absolute', inset: 0, opacity: .25, background: 'transparent', backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 16px, transparent 16px 32px)' }} />

            {/* status bar */}
            <div style={{ position: 'absolute', top: 14, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 26px', color: '#fff', fontSize: 14, fontWeight: 600 }}>
              <span className="tabnums">Sat 6 Jun</span>
              <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <svg width="16" height="11" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0.5" width="3" height="11.5" rx="1"/></svg>
                <svg width="22" height="11" viewBox="0 0 26 13" fill="none"><rect x="0.6" y="0.6" width="22" height="11.8" rx="3.2" stroke="#fff" strokeOpacity="0.5"/><rect x="2.2" y="2.2" width="17" height="8.6" rx="1.8" fill="#fff"/></svg>
              </span>
            </div>

            {/* Dynamic Island — expanded */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 250, background: '#000', borderRadius: 26, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
              <window.PGAEmblemMark size={30} color="#fff" monochrome />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leader.name}</div>
                <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10.5 }}>Leads · thru {U.fmtThru(leader)}</div>
              </div>
              <span className="tabnums" style={{ color: '#34c759', fontSize: 18, fontWeight: 800 }}>{U.fmtScore(leader.scoreToPar)}</span>
            </div>

            {/* clock */}
            <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: .3, opacity: .85 }}>Saturday, 6 June</div>
              <div className="tabnums" style={{ fontSize: 80, fontWeight: 600, letterSpacing: -2, lineHeight: 1, marginTop: 2 }}>9:41</div>
            </div>

            {/* Live Activity card */}
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 120 }}>
              <div style={{ background: 'rgba(20,28,22,.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 22, padding: 16, border: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                  <window.PGAEmblemMark size={28} onDark />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 700 }}>Atlantica PGA Championship</div>
                    <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 10.5 }}>Round 3 · Royal Queensland</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#ff6b60', fontSize: 10, fontWeight: 800, letterSpacing: .5 }}><U.LiveDot />LIVE</span>
                </div>
                {top3.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderTop: i ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                    <span className="tabnums" style={{ width: 16, color: i === 0 ? 'var(--gold)' : 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 700 }}>{p.position.replace('T', '')}</span>
                    <span style={{ fontSize: 14 }}>{p.flag}</span>
                    <span style={{ flex: 1, color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    <span className="tabnums" style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, width: 24, textAlign: 'right' }}>{U.fmtThru(p)}</span>
                    <span className="tabnums" style={{ color: '#34c759', fontSize: 15, fontWeight: 800, width: 30, textAlign: 'right' }}>{U.fmtScore(p.scoreToPar)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* flashlight / camera */}
            <div style={{ position: 'absolute', bottom: 34, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
              {[I.Flag, I.Search].map((Ic, i) => (
                <div key={i} style={{ width: 46, height: 46, borderRadius: 23, background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Ic size={20} /></div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)', width: 120, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.5)' }} />
          </div>
        </div>
      </div>
    );
  }

  /* ===================== STYLE GUIDE ===================== */
  function Swatch({ name, token, hex, dark }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 64, borderRadius: 12, background: hex, border: '1px solid rgba(0,0,0,.08)' }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#16201A' }}>{name}</div>
          <div style={{ fontSize: 11, color: '#7a857d', fontFamily: 'ui-monospace, monospace' }}>{token}</div>
          <div style={{ fontSize: 11, color: '#7a857d', fontFamily: 'ui-monospace, monospace' }}>{hex}</div>
        </div>
      </div>
    );
  }
  function GuideCard({ title, children }) {
    return (
      <div style={{ background: '#fff', borderRadius: 18, padding: 22, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#9F7C32', marginBottom: 16 }}>{title}</div>
        {children}
      </div>
    );
  }

  function StyleGuideView({ onClose }) {
    return (
      <div style={{ minHeight: '100%', padding: '54px 20px 80px' }}>
        <button className="overlay-close" onClick={onClose}><I.X size={20} /></button>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* masthead */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
            <window.PGAEmblem size={86} monochrome withText />
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: -.4 }}>Visual style guide</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginTop: 4 }}>PGA of Atlantica mobile app · for engineering hand-off</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {/* Colour */}
            <GuideCard title="Colour">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                <Swatch name="Ink navy" token="--ink" hex="#0B2440" />
                <Swatch name="Atlantica blue" token="--brand" hex="#10457F" />
                <Swatch name="Blue tint" token="--brand-tint" hex="#E3EBF5" />
                <Swatch name="Gold" token="--gold" hex="#C39A4E" />
                <Swatch name="Cream surface" token="--cream" hex="#F6F3EB" />
                <Swatch name="Card" token="--card" hex="#FFFFFF" />
                <Swatch name="Text" token="--text" hex="#16201A" />
                <Swatch name="Border" token="--border" hex="#E7E2D6" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: '#7a857d', marginBottom: 10 }}>Score semantics</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                <Swatch name="Under par / up" token="--under" hex="#0B7A3B" />
                <Swatch name="Over par / down" token="--over" hex="#C2462F" />
                <Swatch name="Even par" token="--even" hex="#2A3630" />
                <Swatch name="Live" token="--live" hex="#D6332A" />
              </div>
            </GuideCard>

            {/* Type */}
            <GuideCard title="Typography">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ borderBottom: '1px solid #EFEBE0', paddingBottom: 14 }}>
                  <div style={{ fontSize: 10.5, color: '#9F7C32', fontWeight: 700, letterSpacing: .6 }}>EDITORIAL · Source Serif 4</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 700, color: '#16201A', letterSpacing: -.4, marginTop: 4 }}>Sutherland eyes a fourth Atherton Cup</div>
                  <div style={{ fontSize: 11.5, color: '#7a857d', marginTop: 4 }}>Hero titles, news headlines, premium moments. Used sparingly.</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#9F7C32', fontWeight: 700, letterSpacing: .6 }}>INTERFACE · SF Pro / system sans</div>
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: '#16201A', letterSpacing: -.6 }}>Display 30 / 800</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#16201A' }}>Title 18 / 700</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#16201A' }}>Body 15 / 600</div>
                    <div style={{ fontSize: 12.5, color: '#5B6962' }}>Caption 12.5 / 400 · muted</div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#5B6962' }}>OVERLINE 11 / 800 · TRACKED</div>
                    <div className="tabnums" style={{ fontSize: 22, fontWeight: 800, color: '#0B7A3B' }}>−12  Tabular numerals for all scores</div>
                  </div>
                </div>
              </div>
            </GuideCard>

            {/* Logo */}
            <GuideCard title="Brand emblem & tour logos">
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
                <window.PGAEmblem size={84} />
                <div style={{ background: '#0B2440', borderRadius: 14, padding: 14 }}><window.PGAEmblem size={72} monochrome /></div>
                <div style={{ fontSize: 12.5, color: '#5B6962', maxWidth: 240, lineHeight: 1.5 }}>The round PGA of Atlantica roundel (est. 1911) is the <b>generic</b> mark — used on the splash and any non-tour-specific surface. Reads on light or dark with no backing.</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .8, textTransform: 'uppercase', color: '#7a857d', marginBottom: 10 }}>Tour logos — used in the switcher, headers & tour-specific contexts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['atlas', 'clover', 'golden'].map((id) => (
                  <window.PGATourLogo key={id} tourId={id} height={44} radius={8} />
                ))}
              </div>
            </GuideCard>

            {/* Components */}
            <GuideCard title="Components">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
                <U.Button variant="primary">Primary</U.Button>
                <U.Button variant="gold">Gold</U.Button>
                <U.Button variant="outline">Outline</U.Button>
                <U.Button variant="ghost">Ghost</U.Button>
                <U.Button variant="dark">Dark</U.Button>
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
                <U.StatusPill status="live" /><U.StatusPill status="upcoming" /><U.StatusPill status="recent" />
                <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><U.PosChange v={3} /><U.PosChange v={-2} /><U.PosChange v={0} /></span>
                <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}><U.Score v={-12} /><U.Score v={0} /><U.Score v={4} /></span>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {['var(--gold)|#2c2008|E', 'var(--under)|#fff|B', 'transparent|#16201A|P', 'var(--over)|#fff|b', '#9a2f1f|#fff|d'].map((s, i) => {
                  const [bg, fg, l] = s.split('|');
                  return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 26, height: 26, borderRadius: i < 2 ? '50%' : 7, background: bg, color: fg, border: bg === 'transparent' ? '1px solid #D9D3C4' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }} className="tabnums">{4 - i + 2}</div>
                    <span style={{ fontSize: 11.5, color: '#5B6962' }}>{['Eagle', 'Birdie', 'Par', 'Bogey', 'Double'][i]}</span>
                  </div>;
                })}
              </div>
            </GuideCard>

            {/* Modes */}
            <GuideCard title="One app · two modes">
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', border: '1px solid #E7E2D6', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#10457F' }}>Fan mode · default</div>
                  <div style={{ fontSize: 12, color: '#5B6962', marginTop: 4, lineHeight: 1.45 }}>95% of users. Chrome follows the active tour — blue for Atlas, green for Clover, gold for Golden. Tabs: Home · Leaderboards · Schedule · Rankings · More.</div>
                </div>
                <div style={{ flex: '1 1 200px', border: '1px solid #e8d6ad', borderRadius: 12, padding: 14, background: '#FbF7ee' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#9F7C32' }}>Member mode · on sign-in</div>
                  <div style={{ fontSize: 12, color: '#5B6962', marginTop: 4, lineHeight: 1.45 }}>The shell morphs into the Player Portal — gold-accented tab bar: My Events · Scores · Rankings · Info Hub · Profile. One explicit switch back to fan view; no confusing toggle.</div>
                </div>
              </div>
            </GuideCard>

            {/* Iconography */}
            <GuideCard title="Iconography — Lucide-style, 1.75 stroke">
              <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', color: '#134A82' }}>
                {['Home', 'Trophy', 'Calendar', 'Users', 'Search', 'Bell', 'Star', 'Flag', 'MapPin', 'Clock', 'Trending', 'Ticket', 'Lock', 'Refresh'].map((k) => {
                  const Ic = I[k]; return <Ic key={k} size={26} />;
                })}
              </div>
            </GuideCard>

            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 12, padding: '8px 0 0' }}>
              Spacing scale 4·8·12·16·20·24·32 · Radii 8/12/18/26 · Surfaces warm-white, chrome ink-navy · One accent: gold for premium moments only.
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.PGAOverlays = { LiveActivityView, StyleGuideView };
})();
