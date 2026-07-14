/* PGA of Atlantica — prototype sample data.
   All content is plausible Atlas Golf Tour material per the brief.
   Exposed as window.PGA_DATA. */
(function () {
  // ---- Course par (par 72) ----
  const PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 5, 3, 4, 4, 3, 4, 5];

  // ---- Brand themes ----
  // The PGA of Atlantica master brand is deep Atlantic navy. Each tour carries
  // its own palette — the app shell writes these onto the CSS custom
  // properties whenever the active tour changes.
  const brandTheme = {
    '--ink': '#0B2440', '--ink-700': '#123055',
    '--brand': '#10457F', '--brand-600': '#1A5CA3',
    '--brand-tint': '#E3EBF5', '--brand-tint-2': '#CFDEEE',
  };

  // ---- Tours ----
  const tours = [
    {
      id: 'atlas',
      name: 'Atlas Golf Tour',
      short: 'Atlas Golf Tour',
      tag: "Men's tour",
      desc: 'The premier professional men’s tour of Atlantica, played across the championship courses of the region.',
      accent: '#0A6AA8',
      theme: {
        '--ink': '#083048', '--ink-700': '#0C3D5C',
        '--brand': '#0A6AA8', '--brand-600': '#1180C4',
        '--brand-tint': '#E1EFF7', '--brand-tint-2': '#C9E2F1',
      },
    },
    {
      id: 'clover',
      name: 'Clover Tour',
      short: 'Clover Tour',
      tag: "Women's tour",
      desc: 'The professional women’s tour of Atlantica, co-sanctioned with the Ladies European Tour on select events.',
      accent: '#1B7A43',
      theme: {
        '--ink': '#0A3622', '--ink-700': '#0D4229',
        '--brand': '#1B7A43', '--brand-600': '#23934F',
        '--brand-tint': '#E4F2E9', '--brand-tint-2': '#CDE7D6',
      },
    },
    {
      id: 'golden',
      name: 'The Golden Tour',
      short: 'Golden Tour',
      tag: 'Over-50s tour',
      desc: 'The over-50s tour celebrating the champions of the game across Atlantica.',
      accent: '#8F6D1E',
      theme: {
        '--ink': '#3B2E10', '--ink-700': '#4A3A15',
        '--brand': '#8F6D1E', '--brand-600': '#A98427',
        '--brand-tint': '#F5EDD7', '--brand-tint-2': '#ECDFB9',
      },
    },
  ];

  // ---- Country flags (emoji) ----
  const FLAG = {
    AUS: '🇦🇺', NZL: '🇳🇿', USA: '🇺🇸', ENG: '🏴', SCO: '🏴',
    JPN: '🇯🇵', KOR: '🇰🇷', RSA: '🇿🇦', FIJ: '🇫🇯', ARG: '🇦🇷',
    SWE: '🇸🇪', ESP: '🇪🇸',
  };

  // ---- Players (directory) ----
  // earnings in AUD (season)
  const players = [
    { id: 'p-astanton',   first: 'Alec',      last: 'Stanton',      country: 'AUS', tour: 'atlas', worldRank: 34,  earnings: 412300, turnedPro: 2000, highlights: ['2013 Masters Champion', '14× PGA Tour wins', 'Former World No. 1'] },
    { id: 'p-csutherland',   first: 'Cole',   last: 'Sutherland',      country: 'AUS', tour: 'atlas', worldRank: 21,  earnings: 689400, turnedPro: 2013, highlights: ['2022 Open Champion', '2022 Players Champion', '3× Meridian Champion'] },
    { id: 'p-jdunmore',     first: 'Jack',     last: 'Dunmore',        country: 'AUS', tour: 'atlas', worldRank: 28,  earnings: 354900, turnedPro: 2006, highlights: ['2015 PGA Champion', 'Former World No. 1', '13× PGA Tour wins'] },
    { id: 'p-mwarrick',    first: 'Miles',   last: 'Warrick',        country: 'AUS', tour: 'atlas', worldRank: 24,  earnings: 598200, turnedPro: 2019, highlights: ['2021 Scottish Open Champion', '2023 Meridian Champion', 'Rising star'] },
    { id: 'p-lharrow', first: 'Lucas',     last: 'Harrow',    country: 'AUS', tour: 'atlas', worldRank: 71,  earnings: 287600, turnedPro: 2015, highlights: ['2021 Irish Open Champion', '2022 PGA Tour winner'] },
    { id: 'p-rfinch',     first: 'Rory',      last: 'Finch',        country: 'NZL', tour: 'atlas', worldRank: 45,  earnings: 511000, turnedPro: 2010, highlights: ['2× DP World Tour winner (2022)', 'NZ No. 1'] },
    { id: 'p-mleggett',first: 'Mason',      last: 'Leggett',   country: 'AUS', tour: 'atlas', worldRank: 88,  earnings: 198400, turnedPro: 2004, highlights: ['6× PGA Tour wins', 'Presidents Cup veteran'] },
    { id: 'p-cdale',   first: 'Curtis',   last: 'Dale',      country: 'AUS', tour: 'atlas', worldRank: 63,  earnings: 233700, turnedPro: 2017, highlights: ['2× PGA Tour winner', '2017 Atlas Open Champion'] },
    { id: 'p-jmarsh',  first: 'Jed',       last: 'Marsh',     country: 'AUS', tour: 'atlas', worldRank: 210, earnings: 144200, turnedPro: 2020, highlights: ['2022 Meridian Champion (record −20)'] },
    { id: 'p-bkane', first: 'Brody',      last: 'Kane',    country: 'AUS', tour: 'atlas', worldRank: 305, earnings: 96300,  turnedPro: 1998, highlights: ['Multiple Atlantican Tour wins'] },
    { id: 'p-adrake',    first: 'Angus',    last: 'Drake',       country: 'AUS', tour: 'atlas', worldRank: 280, earnings: 88100,  turnedPro: 2005, highlights: ['2010 Avantha Masters Champion'] },
    { id: 'p-brutherford', first: 'Blake',     last: 'Rutherford',    country: 'AUS', tour: 'atlas', worldRank: 410, earnings: 71200,  turnedPro: 1998, highlights: ['4× European Tour wins', 'Short-game specialist'] },
    // Clover Tour
    { id: 'p-hglenn',   first: 'Harper',    last: 'Glenn',      country: 'AUS', tour: 'clover', worldRank: 7,  earnings: 540900, turnedPro: 2015, highlights: ['2019 Women’s PGA Champion', '2024 JM Eagle LA Champion'] },
    { id: 'p-mjung',    first: 'Maya',    last: 'Jung',        country: 'AUS', tour: 'clover', worldRank: 9,  earnings: 612300, turnedPro: 2014, highlights: ['2× Major Champion', '2021 Evian, 2022 US Women’s Open'] },
    { id: 'p-kdunn',first: 'Kiara',     last: 'Dunn',   country: 'AUS', tour: 'clover', worldRank: 84, earnings: 188400, turnedPro: 2019, highlights: ['LET winner', 'Order of Merit contender'] },
    { id: 'p-skalis',first: 'Sienna', last: 'Kalis',   country: 'AUS', tour: 'clover', worldRank: 52, earnings: 244100, turnedPro: 2020, highlights: ['2× LET winner', '2020 Emerald Open (am)'] },
    // Golden Tour
    { id: 'p-sainsley',   first: 'Stuart',    last: 'Ainsley',      country: 'NZL', tour: 'golden', worldRank: null, earnings: 312000, turnedPro: 1991, highlights: ['2022 Charles Schwab Cup Champion', 'PGA Tour Champions Player of the Year'] },
  ];

  function fullName(p) { return p.first + ' ' + p.last; }
  function initials(p) { return (p.first[0] + p.last[0]).toUpperCase(); }

  // ---- Tournaments ----
  // status: 'live' | 'upcoming' | 'recent'
  const tournaments = [
    {
      id: 't-meridian', tour: 'atlas', status: 'live',
      name: 'The Meridian Championship',
      shortName: 'Meridian Championship',
      course: 'Royal Queensland Golf Club', location: 'Brisbane, QLD',
      start: '2026-06-04', end: '2026-06-07', purse: 2000000, field: 144,
      round: 3, totalRounds: 4, par: 71,
      rounds: [
        { name: 'Round 1', date: '2026-06-04', course: 'Royal Queensland', status: 'done' },
        { name: 'Round 2', date: '2026-06-05', course: 'Royal Queensland', status: 'done' },
        { name: 'Round 3', date: '2026-06-06', course: 'Royal Queensland', status: 'live' },
        { name: 'Round 4', date: '2026-06-07', course: 'Royal Queensland', status: 'upcoming' },
      ],
      blurb: 'The Joe Atherton Cup returns to Royal Queensland. Cole Sutherland chases a fourth Atherton Cup.',
    },
    {
      id: 't-atlasopen', tour: 'atlas', status: 'upcoming',
      name: 'The Atlas Open',
      shortName: 'Atlas Open',
      course: 'Kingston Heath Golf Club', location: 'Melbourne, VIC',
      start: '2026-06-25', end: '2026-06-28', purse: 1700000, field: 156,
      round: 0, totalRounds: 4, par: 72,
      rounds: [
        { name: 'Round 1', date: '2026-06-25', course: 'Kingston Heath', status: 'upcoming' },
        { name: 'Round 2', date: '2026-06-26', course: 'Victoria GC', status: 'upcoming' },
        { name: 'Round 3', date: '2026-06-27', course: 'Kingston Heath', status: 'upcoming' },
        { name: 'Round 4', date: '2026-06-28', course: 'Kingston Heath', status: 'upcoming' },
      ],
      blurb: 'The Wayfinder Cup. Men’s and women’s fields play side by side across two of Melbourne’s Sandbelt jewels.',
    },
    {
      id: 't-sthcross', tour: 'atlas', status: 'upcoming',
      name: 'The Southern Cross Open',
      shortName: 'Southern Cross Open',
      course: 'Millbrook Resort', location: 'Queenstown, NZ',
      start: '2026-07-09', end: '2026-07-12', purse: 1500000, field: 144,
      round: 0, totalRounds: 4, par: 72,
      rounds: [], blurb: 'Pro-am format against the Southern Alps at Millbrook.',
    },
    {
      id: 't-waypoint-syd', tour: 'atlas', status: 'upcoming',
      name: 'Waypoint Series — Sydney',
      shortName: 'Waypoint Series Sydney',
      course: 'The Hills Golf Club', location: 'Sydney, NSW',
      start: '2026-07-23', end: '2026-07-25', purse: 250000, field: 132,
      round: 0, totalRounds: 3, par: 72,
      rounds: [], blurb: 'Men and women, professionals and amateurs, one mixed leaderboard.',
    },
    {
      id: 't-waypoint-hunter', tour: 'atlas', status: 'recent',
      name: 'Waypoint Series Hunter Valley',
      shortName: 'Waypoint Series Hunter Valley',
      course: 'Cypress Lakes', location: 'Hunter Valley, NSW',
      start: '2026-05-22', end: '2026-05-24', purse: 250000, field: 132,
      round: 3, totalRounds: 3, par: 71, winner: 'Brody Kane', winScore: -14,
      rounds: [], blurb: 'Brody Kane held off a fast-finishing field for a one-shot win.',
    },
    {
      id: 't-longitude', tour: 'atlas', status: 'recent',
      name: 'The Longitude Classic',
      shortName: 'Longitude Classic',
      course: 'Heritage Golf & Country Club', location: 'Melbourne, VIC',
      start: '2026-05-15', end: '2026-05-17', purse: 300000, field: 132,
      round: 3, totalRounds: 3, par: 72, winner: 'Curtis Dale', winScore: -16,
      rounds: [], blurb: 'Curtis Dale ran away with it on the St John course.',
    },
    {
      id: 't-truenorth', tour: 'atlas', status: 'recent',
      name: 'True North Open',
      shortName: 'True North Open',
      course: '13th Beach Golf Links', location: 'Barwon Heads, VIC',
      start: '2026-05-01', end: '2026-05-04', purse: 1500000, field: 144,
      round: 4, totalRounds: 4, par: 72, winner: 'Miles Warrick', winScore: -18,
      rounds: [], blurb: 'Miles Warrick mastered the Beach and Creek layouts in the wind.',
    },
    // Clover Tour
    {
      id: 't-fourleaf', tour: 'clover', status: 'live',
      name: 'The Four-Leaf Championship',
      shortName: 'Four-Leaf Championship',
      course: 'Brookwater Golf & Country Club', location: 'Brisbane, QLD',
      start: '2026-06-04', end: '2026-06-07', purse: 400000, field: 132,
      round: 3, totalRounds: 4, par: 72,
      rounds: [
        { name: 'Round 1', date: '2026-06-04', course: 'Brookwater', status: 'done' },
        { name: 'Round 2', date: '2026-06-05', course: 'Brookwater', status: 'done' },
        { name: 'Round 3', date: '2026-06-06', course: 'Brookwater', status: 'live' },
        { name: 'Round 4', date: '2026-06-07', course: 'Brookwater', status: 'upcoming' },
      ],
      blurb: 'Harper Glenn and Maya Jung headline at Brookwater.',
    },
    {
      id: 't-emerald', tour: 'clover', status: 'recent',
      name: 'The Emerald Open',
      shortName: 'Emerald Open',
      course: '13th Beach Golf Links', location: 'Barwon Heads, VIC',
      start: '2026-05-01', end: '2026-05-04', purse: 1500000, field: 144,
      round: 4, totalRounds: 4, par: 72, winner: 'Sienna Kalis', winScore: -15,
      rounds: [], blurb: 'Kalis edged a Sunday duel at 13th Beach.',
    },
    // Golden Tour
    {
      id: 't-sovereign', tour: 'golden', status: 'upcoming',
      name: 'The Sovereign Classic',
      shortName: 'Sovereign Classic',
      course: 'Sanctuary Cove (The Pines)', location: 'Gold Coast, QLD',
      start: '2026-06-19', end: '2026-06-21', purse: 200000, field: 78,
      round: 0, totalRounds: 3, par: 72,
      rounds: [], blurb: 'The champions of the game return to The Pines.',
    },
  ];

  // ---- Leaderboard generation for the live Meridian Championship ----
  // Top group hand-authored; rest generated to reach a 144 field.
  const flagOf = (c) => FLAG[c] || '🏳️';

  // hand-authored top of the board (round 3 in progress)
  // thru: number 1-18, or 'F' finished, or tee time string
  const liveTop = [
    { pid: 'p-csutherland',   name: 'Cole Sutherland',  c: 'AUS', toPar: -12, today: -4, thru: 14, total: 201 - 1, move: +2 },
    { pid: 'p-mwarrick',    name: 'Miles Warrick',    c: 'AUS', toPar: -10, today: -3, thru: 15, total: 203,     move: +1 },
    { pid: 'p-rfinch',     name: 'Rory Finch',       c: 'NZL', toPar: -9,  today: -2, thru: 13, total: 204,     move: -1 },
    { pid: 'p-jdunmore',     name: 'Jack Dunmore',      c: 'AUS', toPar: -8,  today: -5, thru: 'F', total: 205,     move: +4 },
    { pid: 'p-astanton',   name: 'Alec Stanton',     c: 'AUS', toPar: -8,  today: -1, thru: 12, total: 205,     move: -2 },
    { pid: 'p-lharrow', name: 'Lucas Harrow',  c: 'AUS', toPar: -7,  today: -3, thru: 16, total: 206,     move: +3 },
    { pid: 'p-cdale',   name: 'Curtis Dale',  c: 'AUS', toPar: -6,  today: -1, thru: 11, total: 207,     move: 0 },
    { pid: 'p-jmarsh',  name: 'Jed Marsh',     c: 'AUS', toPar: -5,  today: -2, thru: 14, total: 208,     move: +2 },
    { pid: 'p-mleggett',name: 'Mason Leggett',  c: 'AUS', toPar: -5,  today: +1, thru: 'F', total: 208,     move: -4 },
    { pid: 'p-bkane', name: 'Brody Kane',   c: 'AUS', toPar: -4,  today: -1, thru: 13, total: 209,     move: -1 },
    { pid: 'p-adrake',    name: 'Angus Drake',    c: 'AUS', toPar: -3,  today: -2, thru: 15, total: 210,     move: +3 },
    { pid: 'p-brutherford', name: 'Blake Rutherford',  c: 'AUS', toPar: -3,  today: +2, thru: 'F', total: 210,     move: -5 },
  ];

  // names pool for filling out the field
  const fillNames = [
    ['Dean', 'Marchetti', 'AUS'], ['Errol', 'Swift', 'AUS'], ['Hugo', 'Calder', 'AUS'],
    ['Jasper', 'Steele', 'AUS'], ['Declan', 'Gray', 'AUS'], ['Kaito', 'Mori', 'NZL'],
    ['Ashton', 'Quill', 'AUS'], ['Maverick', 'Ash', 'AUS'], ['Noah', 'Bianchi', 'AUS'],
    ['Jack', 'Tanner', 'AUS'], ['Tom', 'Pemberton', 'AUS'], ['Aaron', 'Prescott', 'AUS'],
    ['Dylan', 'Lowe', 'AUS'], ['Jordan', 'Deacon', 'AUS'], ['Blake', 'Winters', 'AUS'],
    ['Matt', 'Greaves', 'AUS'], ['Cory', 'Callahan', 'AUS'], ['Travis', 'Sharp', 'AUS'],
    ['Lachlan', 'Byrne', 'AUS'], ['Ben', 'Ellery', 'AUS'], ['Dimitri', 'Poulos', 'AUS'],
    ['Jediah', 'Marsh', 'AUS'], ['Hayden', 'Holt', 'AUS'], ['Connor', 'Macrae', 'NZL'],
    ['Phoenix', 'Carver', 'AUS'], ['Sam', 'Beckford', 'AUS'], ['Peter', 'Colton', 'NZL'],
    ['Jak', 'Colby', 'AUS'], ['Rick', 'Kavanagh', 'AUS'], ['Bryden', 'Mercer', 'AUS'],
  ];

  // Build the full field
  function buildLeaderboard() {
    const rows = [];
    let posCounter = 1;
    // top group with positions (handle ties)
    const sorted = liveTop.slice();
    let lastScore = null, lastPos = 0;
    sorted.forEach((r, i) => {
      let pos;
      // ties: same toPar => same position with T
      if (r.toPar === lastScore) { pos = lastPos; }
      else { pos = i + 1; lastPos = pos; lastScore = r.toPar; }
      const tie = sorted.filter((x) => x.toPar === r.toPar).length > 1;
      rows.push({
        rank: i + 1,
        position: (tie ? 'T' : '') + pos,
        playerId: r.pid,
        name: r.name,
        country: r.c,
        flag: flagOf(r.c),
        scoreToPar: r.toPar,
        today: r.today,
        thru: r.thru,
        totalStrokes: 213 + (r.toPar) - (r.toPar) + r.total - r.total + (211 + r.toPar), // computed below properly
        positionChange: r.move,
        status: r.thru === 'F' ? 'completed' : 'in_progress',
      });
    });
    // fix totalStrokes: after R2 (par 71 ×2 = 142) + R3 partial — use a simple model:
    // total through = 142 + (round3 strokes so far). We'll just present "total" plausibly.
    rows.forEach((row, i) => {
      // 71*round-ish. For 3 rounds completed-ish, par cumulative.
      row.totalStrokes = 213 + row.scoreToPar; // 71*3 = 213
    });

    // generate the rest
    let cur = -3;
    const fieldRows = [];
    fillNames.forEach((fn, i) => {
      // decreasing scores from -2 down
      const toPar = -2 + Math.floor(i / 2); // -2, -2, -1, -1, 0, 0, +1...
      const isCut = toPar > 2 && i > 22;
      const finished = i % 3 === 0;
      const thru = finished ? 'F' : (8 + (i % 10));
      fieldRows.push({
        playerId: 'fill-' + i,
        name: fn[0] + ' ' + fn[1],
        country: fn[2],
        flag: flagOf(fn[2]),
        scoreToPar: toPar,
        today: [-2, -1, 0, 0, +1, +1, +2][i % 7],
        thru: thru,
        totalStrokes: 213 + toPar,
        positionChange: [0, +1, -1, +2, -2, 0, +1][i % 7],
        status: finished ? 'completed' : 'in_progress',
        cut: isCut,
      });
    });
    // assign positions to field rows continuing from top group
    let combined = rows.concat(fieldRows);
    // recompute positions with ties across whole set
    let p = 0; let prev = null;
    combined.forEach((row, idx) => {
      if (row.scoreToPar !== prev) { p = idx + 1; prev = row.scoreToPar; }
      const tie = combined.filter((x) => x.scoreToPar === row.scoreToPar).length > 1;
      row.position = (tie ? 'T' : '') + p;
      row.rank = idx + 1;
    });
    return combined;
  }

  const leaderboard = buildLeaderboard();

  // ---- Scorecards (hole-by-hole) for tappable players ----
  // We store per-round toPar arrays for round 3 (current). Earlier rounds summarised.
  function scoreFromToPar(toParArr, par) {
    return toParArr.map((tp, i) => (tp == null ? null : par[i] + tp));
  }
  const scorecards = {
    'p-csutherland': {
      name: 'Cole Sutherland', country: 'AUS', position: '1', toPar: -12,
      rounds: [
        { name: 'R1', toParTotal: -5, strokes: 66 },
        { name: 'R2', toParTotal: -3, strokes: 68 },
        {
          name: 'R3', current: true, thru: 14,
          // 14 holes played, to-par per hole (par72 array used for display)
          toPar: [0, -1, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, null, null, null, null],
        },
      ],
    },
    'p-jdunmore': {
      name: 'Jack Dunmore', country: 'AUS', position: 'T4', toPar: -8,
      rounds: [
        { name: 'R1', toParTotal: -1, strokes: 70 },
        { name: 'R2', toParTotal: -2, strokes: 69 },
        {
          name: 'R3', current: true, thru: 'F',
          toPar: [0, -1, 0, 0, -1, 0, +1, 0, -1, 0, -1, 0, 0, 0, -1, 0, 0, -1],
        },
      ],
    },
    'p-mwarrick': {
      name: 'Miles Warrick', country: 'AUS', position: '2', toPar: -10,
      rounds: [
        { name: 'R1', toParTotal: -4, strokes: 67 },
        { name: 'R2', toParTotal: -3, strokes: 68 },
        {
          name: 'R3', current: true, thru: 15,
          toPar: [0, 0, -1, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, null, null, null],
        },
      ],
    },
  };

  // attach computed gross to current rounds for display
  Object.values(scorecards).forEach((sc) => {
    sc.rounds.forEach((r) => {
      if (r.current && r.toPar) {
        r.gross = scoreFromToPar(r.toPar, PAR);
      }
    });
  });

  // recent results for player profiles
  const recentResults = {
    'p-csutherland': [
      { t: 'Meridian Championship', pos: '1', toPar: -12, when: 'In progress' },
      { t: 'True North Open', pos: 'T6', toPar: -11, when: 'May 2026' },
      { t: 'The Longitude Classic', pos: 'T3', toPar: -13, when: 'May 2026' },
      { t: 'Waypoint Series Hunter Valley', pos: 'T9', toPar: -8, when: 'May 2026' },
    ],
    'p-astanton': [
      { t: 'Meridian Championship', pos: 'T4', toPar: -8, when: 'In progress' },
      { t: 'True North Open', pos: 'T12', toPar: -9, when: 'May 2026' },
      { t: 'The Longitude Classic', pos: 'T7', toPar: -10, when: 'May 2026' },
    ],
    'p-mwarrick': [
      { t: 'Meridian Championship', pos: '2', toPar: -10, when: 'In progress' },
      { t: 'True North Open', pos: '1', toPar: -18, when: 'May 2026' },
      { t: 'Waypoint Series Hunter Valley', pos: 'T4', toPar: -10, when: 'May 2026' },
    ],
  };

  window.PGA_DATA = {
    PAR, brandTheme, tours, players, tournaments, leaderboard, scorecards, recentResults,
    FLAG, flagOf, fullName, initials,
    playerById: (id) => players.find((p) => p.id === id),
    tournamentsForTour: (tid) => tournaments.filter((t) => t.tour === tid),
    tourById: (id) => tours.find((t) => t.id === id),
  };
})();
