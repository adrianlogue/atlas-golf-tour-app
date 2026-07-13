/* PGA of Atlantica — icon set + brand emblem.
   Lucide-style stroke icons (1.75 stroke) + the heritage badge.
   Exposes components on window. */
(function () {
  const e = React.createElement;

  // Generic stroke icon wrapper
  function Icon({ size = 24, stroke = 'currentColor', sw = 1.75, children, style, ...rest }) {
    return e('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
      style, ...rest,
    }, children);
  }
  const P = (d, k) => e('path', { d, key: k });
  const C = (cx, cy, r, k) => e('circle', { cx, cy, r, key: k });
  const L = (x1, y1, x2, y2, k) => e('line', { x1, y1, x2, y2, key: k });

  const Icons = {
    Home: (p) => e(Icon, p, [P('M3 10.5 12 3l9 7.5', 'a'), P('M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5', 'b')]),
    Trophy: (p) => e(Icon, p, [P('M7 4h10v4a5 5 0 0 1-10 0V4Z', 'a'), P('M7 5H4v1a3 3 0 0 0 3 3', 'b'), P('M17 5h3v1a3 3 0 0 1-3 3', 'c'), P('M12 13v4', 'd'), P('M8.5 21h7l-.7-3.2a1 1 0 0 0-1-.8h-3.6a1 1 0 0 0-1 .8L8.5 21Z', 'e')]),
    Calendar: (p) => e(Icon, p, [e('rect', { x: 3, y: 4.5, width: 18, height: 16, rx: 2, key: 'a' }), L(3, 9, 21, 9, 'b'), L(8, 2.5, 8, 6, 'c'), L(16, 2.5, 16, 6, 'd')]),
    Users: (p) => e(Icon, p, [C(9, 8, 3.2, 'a'), P('M3.5 20a5.5 5.5 0 0 1 11 0', 'b'), P('M16 5.2a3.2 3.2 0 0 1 0 5.6', 'c'), P('M17.5 14.5a5.5 5.5 0 0 1 3 5', 'd')]),
    More: (p) => e(Icon, p, [C(5, 12, 1.4, 'a'), C(12, 12, 1.4, 'b'), C(19, 12, 1.4, 'c')]),
    Search: (p) => e(Icon, p, [C(11, 11, 7, 'a'), L(16.5, 16.5, 21, 21, 'b')]),
    ChevronDown: (p) => e(Icon, p, [P('m6 9 6 6 6-6', 'a')]),
    ChevronRight: (p) => e(Icon, p, [P('m9 6 6 6-6 6', 'a')]),
    ChevronLeft: (p) => e(Icon, p, [P('m15 6-6 6 6 6', 'a')]),
    ArrowUp: (p) => e(Icon, p, [P('M12 19V5', 'a'), P('m6 11 6-6 6 6', 'b')]),
    ArrowDown: (p) => e(Icon, p, [P('M12 5v14', 'a'), P('m6 13 6 6 6-6', 'b')]),
    Bell: (p) => e(Icon, p, [P('M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5', 'a'), P('M10.5 20a1.8 1.8 0 0 0 3 0', 'b')]),
    Star: (p) => e(Icon, p, [P('M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z', 'a')]),
    StarFill: (p) => e('svg', { width: p.size || 24, height: p.size || 24, viewBox: '0 0 24 24', fill: p.fill || 'currentColor', style: p.style, ...p }, e('path', { d: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z' })),
    Flag: (p) => e(Icon, p, [P('M5 21V4', 'a'), P('M5 4.5h11l-2 3 2 3H5', 'b')]),
    MapPin: (p) => e(Icon, p, [P('M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z', 'a'), C(12, 10, 2.4, 'b')]),
    Clock: (p) => e(Icon, p, [C(12, 12, 8.5, 'a'), P('M12 8v4.2l2.8 1.6', 'b')]),
    Settings: (p) => e(Icon, p, [C(12, 12, 3, 'a'), P('M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.7l-.1-.1A2 2 0 1 1 7 4.5l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z', 'b')]),
    Info: (p) => e(Icon, p, [C(12, 12, 8.5, 'a'), L(12, 11, 12, 16, 'b'), L(12, 8, 12, 8, 'c')]),
    Help: (p) => e(Icon, p, [C(12, 12, 8.5, 'a'), P('M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.7-2.5 2-2.5 3.5', 'b'), L(12, 17, 12, 17, 'c')]),
    Lock: (p) => e(Icon, p, [e('rect', { x: 5, y: 11, width: 14, height: 9, rx: 2, key: 'a' }), P('M8 11V8a4 4 0 0 1 8 0v3', 'b')]),
    Mail: (p) => e(Icon, p, [e('rect', { x: 3, y: 5, width: 18, height: 14, rx: 2, key: 'a' }), P('m4 7 8 6 8-6', 'b')]),
    Check: (p) => e(Icon, p, [P('m5 12.5 4.5 4.5L19 7', 'a')]),
    X: (p) => e(Icon, p, [P('M6 6l12 12M18 6 6 18', 'a')]),
    Refresh: (p) => e(Icon, p, [P('M21 12a9 9 0 1 1-2.6-6.4', 'a'), P('M21 4v5h-5', 'b')]),
    Document: (p) => e(Icon, p, [P('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z', 'a'), P('M14 3v5h5', 'b'), L(9, 13, 15, 13, 'c'), L(9, 16.5, 13, 16.5, 'd')]),
    Play: (p) => e(Icon, { ...p, fill: p.fill || 'currentColor', stroke: 'none' }, [e('path', { d: 'M8 5.5v13l11-6.5-11-6.5Z', key: 'a' })]),
    Ticket: (p) => e(Icon, p, [P('M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a2 2 0 0 0 0 5V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2 2 0 0 0 0-5V8Z', 'a'), L(14, 6, 14, 18, 'b')]),
    Trending: (p) => e(Icon, p, [P('m3 17 6-6 4 4 8-8', 'a'), P('M17 7h4v4', 'b')]),
    Wallet: (p) => e(Icon, p, [P('M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2', 'a'), e('rect', { x: 3, y: 7, width: 18, height: 12, rx: 2, key: 'b' }), C(17, 13, 1.2, 'c')]),
    User: (p) => e(Icon, p, [C(12, 8, 3.5, 'a'), P('M5 20a7 7 0 0 1 14 0', 'b')]),
    Pin: (p) => e(Icon, p, [P('M9 4h6l-1 6 3 2v2H7v-2l3-2-1-6Z', 'a'), L(12, 16, 12, 21, 'b')]),
    Eye: (p) => e(Icon, p, [P('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z', 'a'), C(12, 12, 2.8, 'b')]),
  };

  /* ---------- Brand emblem: heritage badge with golfer silhouette ---------- */
  // golfer mid-swing (follow-through) silhouette, authored as a solid shape.
  function GolferGlyph({ size = 40, color = '#fff' }) {
    return e('svg', { width: size, height: size, viewBox: '0 0 64 64', fill: 'none' },
      // club shaft (follow-through, up to the right)
      e('path', { d: 'M30 26 L55 9', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' }),
      // figure: head
      e('circle', { cx: 28.5, cy: 16, r: 4.4, fill: color }),
      // torso + arms + legs as one silhouette
      e('path', {
        fill: color,
        d: 'M26 21 '
          + 'C24.4 22.2 23.4 24 23.4 26.2 '
          + 'C23.4 28.4 24.6 30.2 26.4 31.2 '       // shoulder/back
          + 'L24.2 41 '                              // down the back to hip
          + 'C24 42 24.4 43 25.3 43.4 '
          + 'L24.5 56 '                              // back leg
          + 'C24.4 57.4 25.5 58.4 26.8 58.2 '
          + 'C27.9 58 28.5 57 28.5 56 '
          + 'L29.4 45.5 '                            // inseam
          + 'L33.6 55.8 '                            // front leg (driving)
          + 'C34.1 57.1 35.4 57.6 36.6 57 '
          + 'C37.7 56.5 38.1 55.2 37.6 54 '
          + 'L33.8 43.3 '                            // hip front
          + 'C34.6 42.4 34.8 41.1 34.2 40 '
          + 'L31.6 31.6 '                            // arms reaching up-right to club
          + 'C33.2 31.6 34.6 30.7 35.4 29.4 '
          + 'L30.4 26.6 '
          + 'C30 25 28.8 23.6 27.2 23.2 '
          + 'C26.8 22.4 26.4 21.6 26 21 Z',
      }),
    );
  }

  // Generic round PGA of Atlantica roundel — text-based mark. Double ring,
  // serif monogram. Used on the splash and any non-tour-specific spot; reads
  // on light or dark with no backing.
  function Emblem({ size = 96, monochrome, color }) {
    const c = monochrome ? '#FFFFFF' : (color || 'var(--brand)');
    return e('svg', { width: size, height: size, viewBox: '0 0 120 120', style: { flex: '0 0 auto', display: 'block' }, 'aria-label': 'PGA of Atlantica' },
      e('circle', { cx: 60, cy: 60, r: 57, fill: 'none', stroke: c, strokeWidth: 2.5, key: 'r1' }),
      e('circle', { cx: 60, cy: 60, r: 49.5, fill: 'none', stroke: c, strokeWidth: 1, opacity: .55, key: 'r2' }),
      e('text', { x: 60, y: 34, textAnchor: 'middle', fill: c, style: { fontSize: 11 }, key: 't0' }, '✦'),
      e('text', { x: 60, y: 64, textAnchor: 'middle', fill: c, style: { fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 30, letterSpacing: 2 }, key: 't1' }, 'PGA'),
      e('text', { x: 61.5, y: 80, textAnchor: 'middle', fill: c, opacity: .9, style: { fontFamily: 'var(--ui)', fontWeight: 800, fontSize: 8, letterSpacing: 3 }, key: 't2' }, 'OF ATLANTICA'),
      e('text', { x: 61, y: 94, textAnchor: 'middle', fill: c, opacity: .6, style: { fontFamily: 'var(--ui)', fontWeight: 700, fontSize: 6.5, letterSpacing: 2 }, key: 't3' }, 'EST. 1911'),
    );
  }

  // Compact round mark for chrome (generic).
  function EmblemMark({ size = 32, color, onDark, monochrome }) {
    const c = (onDark || monochrome) ? '#FFFFFF' : (color || 'var(--brand)');
    return e('svg', { width: size, height: size, viewBox: '0 0 64 64', style: { flex: '0 0 auto', display: 'block' }, 'aria-label': 'PGA of Atlantica' },
      e('circle', { cx: 32, cy: 32, r: 30.5, fill: 'none', stroke: c, strokeWidth: 2.5, key: 'r1' }),
      e('text', { x: 32, y: 36.5, textAnchor: 'middle', fill: c, style: { fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 17, letterSpacing: 1 }, key: 't1' }, 'PGA'),
      e('text', { x: 32.8, y: 47, textAnchor: 'middle', fill: c, opacity: .85, style: { fontFamily: 'var(--ui)', fontWeight: 800, fontSize: 5.5, letterSpacing: 1.6 }, key: 't2' }, 'ATLANTICA'),
    );
  }

  // Tour-specific banner wordmarks (Atlas / Clover / Golden). Text-based logo
  // marks on each tour's ink colour. Wide ~2.93:1, same footprint as the old
  // image banners so every existing layout keeps working.
  const TOUR_MARKS = {
    atlas:  { bg: '#083048', ink: '#FFFFFF', sub: '#8FC6EA', top: '✦  ✦  ✦', topSize: 11, main: 'ATLAS', mainSize: 34, foot: 'GOLF TOUR', label: 'Atlas Golf Tour' },
    clover: { bg: '#0A3622', ink: '#FFFFFF', sub: '#9AD3AC', top: '☘', topSize: 19, main: 'CLOVER', mainSize: 32, foot: 'TOUR', label: 'Clover Tour' },
    golden: { bg: '#3B2E10', ink: '#EFD9A0', sub: '#C9A855', top: 'THE', topSize: 11, main: 'GOLDEN', mainSize: 32, foot: 'TOUR', label: 'The Golden Tour' },
  };
  function TourLogo({ tourId, height = 24, radius = 5, style }) {
    const m = TOUR_MARKS[tourId] || TOUR_MARKS.atlas;
    return e('svg', { viewBox: '0 0 293 100', 'aria-label': m.label, style: { height, width: 'auto', display: 'block', borderRadius: radius, ...style } },
      e('rect', { x: 0, y: 0, width: 293, height: 100, fill: m.bg, key: 'bg' }),
      e('text', { x: 146.5, y: 27, textAnchor: 'middle', fill: m.sub, style: { fontFamily: 'var(--ui)', fontWeight: 800, fontSize: m.topSize, letterSpacing: 4 }, key: 't0' }, m.top),
      e('text', { x: 149, y: 63, textAnchor: 'middle', fill: m.ink, style: { fontFamily: 'var(--serif)', fontWeight: 700, fontSize: m.mainSize, letterSpacing: 7 }, key: 't1' }, m.main),
      e('text', { x: 149, y: 84, textAnchor: 'middle', fill: m.sub, style: { fontFamily: 'var(--ui)', fontWeight: 800, fontSize: 10, letterSpacing: 5 }, key: 't2' }, m.foot),
      e('line', { x1: 74, y1: 23, x2: 116, y2: 23, stroke: m.sub, strokeWidth: 1, opacity: .5, key: 'l1' }),
      e('line', { x1: 177, y1: 23, x2: 219, y2: 23, stroke: m.sub, strokeWidth: 1, opacity: .5, key: 'l2' }),
    );
  }

  window.PGAIcons = Icons;
  window.PGAEmblem = Emblem;
  window.PGAEmblemMark = EmblemMark;
  window.PGATourLogo = TourLogo;
  window.PGAGolferGlyph = GolferGlyph;
})();
