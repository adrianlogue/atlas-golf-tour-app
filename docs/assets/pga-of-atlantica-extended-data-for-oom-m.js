/* PGA of Atlantica — extended data for OoM, member portal, info hub, notifications.
   Augments window.PGA_DATA (loaded after data.js). Exposed as window.PGA_DATA2. */
(function () {
  const D = window.PGA_DATA;
  const money = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);

  /* ===================== ORDER OF MERIT (Atlas Golf Tour men's, 2026 season) ===================== */
  // points-based Order of Merit. Exemption bands inserted as cut-off lines in the UI.
  const oomRaw = [
    { pid: 'p-mwarrick',    name: 'Miles Warrick',    c: 'AUS', points: 2148, earnings: 598200, events: 7, prev: 1 },
    { pid: 'p-csutherland',   name: 'Cole Sutherland',  c: 'AUS', points: 1964, earnings: 689400, events: 5, prev: 3 },
    { pid: 'p-rfinch',     name: 'Rory Finch',       c: 'NZL', points: 1731, earnings: 511000, events: 8, prev: 2 },
    { pid: 'p-astanton',   name: 'Alec Stanton',     c: 'AUS', points: 1542, earnings: 412300, events: 6, prev: 4 },
    { pid: 'p-jdunmore',     name: 'Jack Dunmore',      c: 'AUS', points: 1488, earnings: 354900, events: 5, prev: 6 },
    { pid: 'p-cdale',   name: 'Curtis Dale',  c: 'AUS', points: 1356, earnings: 233700, events: 7, prev: 5 },
    { pid: 'p-lharrow', name: 'Lucas Harrow',  c: 'AUS', points: 1204, earnings: 287600, events: 6, prev: 9 },
    // --- band: DP World Tour cards (top 7) ---
    { pid: 'p-jmarsh',  name: 'Jed Marsh',     c: 'AUS', points: 1098, earnings: 144200, events: 8, prev: 7 },
    { pid: 'p-mleggett',name: 'Mason Leggett',  c: 'AUS', points: 1012, earnings: 198400, events: 4, prev: 8 },
    { pid: 'fill-0',     name: 'Dean Marchetti',c: 'AUS', points: 948,  earnings: 176500, events: 9, prev: 12 },
    { pid: 'fill-1',     name: 'Errol Swift',   c: 'AUS', points: 902,  earnings: 168200, events: 9, prev: 10 },
    { pid: 'fill-5',     name: 'Kaito Mori',  c: 'NZL', points: 864,  earnings: 159800, events: 8, prev: 11 },
    { pid: 'fill-2',     name: 'Hugo Calder',  c: 'AUS', points: 791,  earnings: 142300, events: 9, prev: 15 },
    { pid: 'fill-6',     name: 'Ashton Quill', c: 'AUS', points: 742,  earnings: 131900, events: 8, prev: 13 },
    { pid: 'p-bkane', name: 'Brody Kane',   c: 'AUS', points: 705,  earnings: 96300,  events: 7, prev: 14 },
    // --- band: fully exempt next season (top 15) ---
    { pid: 'fill-3',     name: 'Jasper Steele',  c: 'AUS', points: 648,  earnings: 118400, events: 9, prev: 18 },
    { pid: 'fill-10',    name: 'Tom Pemberton',c: 'AUS', points: 602,  earnings: 109200, events: 8, prev: 16 },
    { pid: 'p-adrake',    name: 'Angus Drake',    c: 'AUS', points: 559,  earnings: 88100,  events: 7, prev: 17 },
    { pid: 'fill-15',    name: 'Matt Greaves',   c: 'AUS', points: 511,  earnings: 94600,  events: 8, prev: 20 },
    { pid: 'fill-20',    name: 'Dimitri Poulos', c: 'AUS', points: 478, earnings: 88700, events: 9, prev: 19 },
    // member sits here
    { pid: 'me',         name: 'Liam Carter',    c: 'AUS', points: 442,  earnings: 81200,  events: 8, prev: 24, isMe: true },
    { pid: 'fill-12',    name: 'Aaron Prescott',     c: 'AUS', points: 418,  earnings: 79300,  events: 7, prev: 21 },
    { pid: 'fill-17',    name: 'Travis Sharp',   c: 'AUS', points: 389,  earnings: 71800,  events: 8, prev: 22 },
    { pid: 'p-brutherford', name: 'Blake Rutherford',  c: 'AUS', points: 362,  earnings: 71200,  events: 6, prev: 23 },
    { pid: 'fill-22',    name: 'Hayden Holt', c: 'AUS', points: 331, earnings: 64900,  events: 9, prev: 27 },
    // --- band: retain partial status (top 30) ---
    { pid: 'fill-13',    name: 'Dylan Lowe',   c: 'AUS', points: 298,  earnings: 58200,  events: 8, prev: 25 },
    { pid: 'fill-14',    name: 'Jordan Deacon',   c: 'AUS', points: 274,  earnings: 54100,  events: 7, prev: 26 },
    { pid: 'fill-18',    name: 'Lachlan Byrne', c: 'AUS', points: 251,  earnings: 49800,  events: 8, prev: 29 },
    { pid: 'fill-19',    name: 'Ben Ellery',     c: 'AUS', points: 229,  earnings: 46300,  events: 7, prev: 28 },
    { pid: 'fill-23',    name: 'Connor Macrae',c: 'NZL', points: 208,  earnings: 42100,  events: 8, prev: 31 },
  ];

  // exemption bands: show a cut-off line AFTER the given (1-based) rank
  const oomBands = {
    7: { label: 'DP World Tour cards', sub: 'Top 7 earn 2027 DP World Tour membership', tone: 'gold' },
    15: { label: 'Full exemption', sub: 'Top 15 fully exempt on the 2027 Tour', tone: 'green' },
    30: { label: 'Conditional status', sub: 'Top 30 retain partial playing rights', tone: 'muted' },
  };

  const orderOfMerit = oomRaw.map((r, i) => ({
    ...r, position: i + 1, flag: D.flagOf(r.c),
    move: r.prev ? r.prev - (i + 1) : 0, // positive = moved up
  }));

  // points breakdown per OoM player (how they accumulated) — for the "tap → breakdown" ask
  function oomBreakdown(pid) {
    const row = orderOfMerit.find((r) => r.pid === pid);
    if (!row) return null;
    // distribute points across their events as plausible finishes
    const evs = [
      { t: 'True North Open', pos: 'T6', pts: 188, when: 'May' },
      { t: 'The Longitude Classic', pos: 'T3', pts: 264, when: 'May' },
      { t: 'Waypoint Series Hunter Valley', pos: 'T11', pts: 121, when: 'May' },
      { t: 'Waypoint Series Murray River', pos: '1', pts: 500, when: 'Apr' },
      { t: 'Compass Open', pos: 'T9', pts: 142, when: 'Apr' },
      { t: 'Longitude Classic Qual', pos: 'T18', pts: 86, when: 'Mar' },
    ];
    // scale so it roughly sums to their points
    const sum = evs.reduce((a, e) => a + e.pts, 0);
    const scale = row.points / sum;
    return evs.map((e) => ({ ...e, pts: Math.round(e.pts * scale) })).sort((a, b) => b.pts - a.pts);
  }

  /* ===================== THE LOGGED-IN MEMBER ===================== */
  const member = {
    id: 'me', name: 'Liam Carter', first: 'Liam', memberNo: 'AT-40218', country: 'AUS',
    status: 'Full playing rights', oomPos: 21, oomPoints: 442, seasonEarnings: 81200,
    events: 8, cutsMade: 6, bestFinish: 'T4',
    card: { brand: 'Visa', last4: '4821', exp: '08/27' },
    invoice: { no: 'INV-2026-1183', desc: '2026 Membership Renewal', amount: 1450, due: '2026-07-15', status: 'due' },
    manager: { name: 'Sarah Quinn', agency: 'Apex Sports Management', acts: 6 },
  };

  // member's season results (with earnings + OoM points per event)
  const memberResults = [
    { t: 'Meridian Championship', pos: 'T31', toPar: -1, earnings: 9800, points: 64, when: 'In progress', status: 'live' },
    { t: 'Waypoint Series Hunter Valley', pos: 'T12', toPar: -6, earnings: 7400, points: 121, when: 'May 2026', status: 'done' },
    { t: 'The Longitude Classic', pos: 'MC', toPar: 4, earnings: 0, points: 0, when: 'May 2026', status: 'done' },
    { t: 'True North Open', pos: 'T19', toPar: -7, earnings: 6100, points: 88, when: 'May 2026', status: 'done' },
    { t: 'Waypoint Series Murray River', pos: 'T4', toPar: -12, earnings: 18600, points: 169, when: 'Apr 2026', status: 'done' },
    { t: 'Compass Open', pos: 'T24', toPar: -3, earnings: 4900, points: 0, when: 'Apr 2026', status: 'done' },
  ];

  // member's tournaments (entry status): entered | open | upcoming | played | closed
  const myTournaments = [
    { id: 't-meridian', name: 'The Meridian Championship', short: 'Meridian Championship', course: 'Royal Queensland', start: '2026-06-04', end: '2026-06-07', entry: 'entered', note: 'In the field · Round 3', pos: 'T31' },
    { id: 't-atlasopen', name: 'The Atlas Open', short: 'Atlas Open', course: 'Kingston Heath', start: '2026-06-25', end: '2026-06-28', entry: 'open', note: 'Entries close 18 Jun', closes: '2026-06-18' },
    { id: 't-sthcross', name: 'The Southern Cross Open', short: 'Southern Cross Open', course: 'Millbrook Resort', start: '2026-07-09', end: '2026-07-12', entry: 'open', note: 'Entries close 02 Jul', closes: '2026-07-02' },
    { id: 't-waypoint-syd', name: 'Waypoint Series — Sydney', short: 'Waypoint Series Sydney', course: 'The Hills GC', start: '2026-07-23', end: '2026-07-25', entry: 'upcoming', note: 'Entries open 09 Jul' },
    { id: 't-waypoint-hunter', name: 'Waypoint Series Hunter Valley', short: 'Waypoint Series Hunter Valley', course: 'Cypress Lakes', start: '2026-05-22', end: '2026-05-24', entry: 'played', note: 'Finished T12', pos: 'T12' },
    { id: 't-longitude', name: 'The Longitude Classic', short: 'Longitude Classic', course: 'Heritage G&CC', start: '2026-05-15', end: '2026-05-17', entry: 'played', note: 'Missed cut', pos: 'MC' },
  ];

  /* ===================== PER-EVENT PLAYER HUB (member view of one event) ===================== */
  // keyed by tournament id; structured like the DPWT player portal
  const eventHub = {
    't-atlasopen': {
      overview: [
        ['Dates', '25–28 June 2026'], ['Venues', 'Kingston Heath GC · Victoria GC'],
        ['Prize money', money(1700000)], ['Field size', '156'],
        ['Entries close', 'Wed 18 June, 5:00pm AEST'], ['Tournament Director', 'M. Henderson'],
        ['Eligibility', 'Exempt categories 1–14'], ['Format', '72 holes stroke play, cut to top 65 & ties'],
      ],
      pre: [
        { t: 'Official tournament hotel', d: 'Crowne Plaza Melbourne — member rate AUD 189/night', icon: 'Ticket' },
        { t: 'Airport transfers', d: 'Shuttle bookings open from 20 June', icon: 'MapPin' },
        { t: 'Course report — Kingston Heath', d: 'Sandbelt classic, firm greens expected', icon: 'Document' },
        { t: 'Yardage book', d: 'Digital yardage available from 22 June', icon: 'Document' },
        { t: 'Player information pack', d: 'Locker allocation, catering, transport', icon: 'Info' },
      ],
      week: [
        { t: 'Weather outlook', d: 'Thu 17° showers · Fri–Sun 19–21° clearing', icon: 'Info' },
        { t: 'Pin positions — Round 1', d: 'Published Wed 6:00pm', icon: 'Pin' },
        { t: 'Local rules & notices', d: 'Sandbelt bunker rulings, preferred lies TBC', icon: 'Flag' },
        { t: 'Pro-am draw', d: 'Wednesday 24 June — see your group', icon: 'Users' },
        { t: 'Purse breakdown', d: 'Full prize money distribution', icon: 'Wallet' },
        { t: 'Bus schedule', d: 'Hotel ⇄ course every 20 min from 5:30am', icon: 'Clock' },
      ],
      practice: [
        { t: 'Practice rounds', d: 'Mon–Wed, book tee times via the app', icon: 'Clock' },
        { t: 'Range hours', d: 'Daily 6:00am – 7:00pm', icon: 'Flag' },
      ],
      entries: { count: 142, status: 'Entries open', closes: '18 June', myStatus: 'open' },
    },
  };

  /* ===================== INFO HUB ===================== */
  const infoHub = [
    { id: 'exemptions', title: 'Exemption categories', sub: '2026 eligibility & priority ranking', icon: 'Trophy',
      body: 'Categories 1–22 define playing priority for Tour events. Category 1: winners of the last two seasons. Category 2: top 30 from the prior Order of Merit…' },
    { id: 'regs', title: 'Member regulations', sub: 'Tournament & conduct regulations', icon: 'Document' },
    { id: 'practice-regs', title: 'Practice regulations', sub: 'Practice round & range policy', icon: 'Flag' },
    { id: 'pace', title: 'Pace of play policy', sub: 'Timing policy + recent breaches', icon: 'Clock',
      body: 'Players are timed when out of position. A bad time is recorded at 50s over allocation…' },
    { id: 'medical', title: 'Medical services', sub: 'Physio & medical bookings on site', icon: 'Help' },
    { id: 'integrity', title: 'Integrity policy', sub: 'Anti-corruption & betting rules', icon: 'Lock' },
    { id: 'finance', title: 'Player finance information', sub: 'Prize money, tax & payment timing', icon: 'Wallet' },
    { id: 'benefits', title: 'Member benefits', sub: 'Partner offers & member services', icon: 'Star' },
    { id: 'rulings', title: 'Rules & rulings', sub: 'Hard Card and key rulings', icon: 'Flag' },
    { id: 'notices', title: 'General notices', sub: 'Latest tour-wide communications', icon: 'Bell' },
  ];

  /* ===================== ACCREDITATION PASSES ===================== */
  const accreditation = [
    { role: 'Player', name: 'Liam Carter', id: 'AT-40218', zones: 'All areas · Locker · Range', status: 'active' },
    { role: 'Caddie', name: 'Tom Reilly', id: 'CAD-2291', zones: 'Inside ropes · Range', status: 'active' },
    { role: 'Manager', name: 'Sarah Quinn', id: 'MGR-0884', zones: 'Clubhouse · Hospitality', status: 'active' },
    { role: 'Guest', name: '2 of 2 allocated', id: 'GST', zones: 'Public · Hospitality', status: 'request' },
  ];

  /* ===================== NOTIFICATIONS ===================== */
  // fan notifications
  const fanNotifications = [
    { id: 'n1', icon: 'Trophy', tone: 'live', title: 'Cole Sutherland leads the Meridian', body: '−12 through 14 in Round 3', when: '2m ago', unread: true },
    { id: 'n2', icon: 'Star', tone: 'green', title: 'Miles Warrick made the turn at −2 today', body: 'Following · Round 3 at Royal Queensland', when: '18m ago', unread: true },
    { id: 'n3', icon: 'Flag', tone: 'green', title: 'Round 3 tee times published', body: 'Meridian Championship', when: '3h ago', unread: false },
    { id: 'n4', icon: 'Calendar', tone: 'muted', title: 'The Atlas Open tees off in 3 weeks', body: 'Add it to your calendar', when: 'Yesterday', unread: false },
  ];
  // member notifications (tournament push to members)
  const memberNotifications = [
    { id: 'm1', icon: 'Bell', tone: 'gold', title: 'Message from the Tournament Office', body: 'Round 4 tee times are now confirmed. First group 6:45am off the 1st.', when: '12m ago', unread: true, from: 'Meridian Championship' },
    { id: 'm2', icon: 'Ticket', tone: 'green', title: 'Entry confirmed', body: 'You’re in the field for the The Atlas Open', when: '1h ago', unread: true },
    { id: 'm3', icon: 'Pin', tone: 'green', title: 'Round 3 pin positions published', body: 'Tap to view the pin sheet', when: '4h ago', unread: false, from: 'Meridian Championship' },
    { id: 'm4', icon: 'Wallet', tone: 'muted', title: 'Membership invoice due 15 July', body: 'INV-2026-1183 · ' + money(1450), when: 'Yesterday', unread: false },
  ];

  /* ===================== PAST CHAMPIONS (event pages) ===================== */
  const pastChampions = {
    't-meridian': [
      { year: '2025', name: 'Miles Warrick', score: '−18' }, { year: '2024', name: 'Errol Swift', score: '−14' },
      { year: '2023', name: 'Miles Warrick', score: '−9' }, { year: '2022', name: 'Jed Marsh', score: '−20' },
      { year: '2021', name: 'Jediah Marsh', score: '−11' },
    ],
    't-atlasopen': [
      { year: '2025', name: 'Rory Finch', score: '−16' }, { year: '2024', name: 'Jack Dunmore', score: '−8' },
      { year: '2023', name: 'Tomás Herrera', score: '−24' }, { year: '2022', name: 'Stefan Kowalski', score: '−14' },
    ],
  };

  window.PGA_DATA2 = {
    orderOfMerit, oomBands, oomBreakdown,
    member, memberResults, myTournaments, eventHub, infoHub, accreditation,
    fanNotifications, memberNotifications, pastChampions, money,
  };
})();
