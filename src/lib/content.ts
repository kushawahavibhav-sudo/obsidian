/* ============================================================
   OBSIDIAN ATELIER — content model
   Architecture + interiors studio. Mumbai · Goa · Bengaluru.
   Every number here is a written-down operational fact.
   ============================================================ */

export const studio = {
  name: 'Obsidian Atelier',
  tagline: 'Architecture for the monsoon, not the brochure.',
  founded: 2011,
  registration: 'COA Reg. MH/CA/2011/04417',
  email: 'studio@obsidianatelier.in',
  phone: '+91 22 4890 3317',
  phoneHref: '+912248903317',
  whatsapp: '919821004417',
  locations: [
    {
      city: 'Mumbai',
      kind: 'Head studio',
      address: '3rd floor, Laxmi Woollen Mills, Shakti Mills Lane, Lower Parel 400011',
      people: 26,
      lead: 'Aparna Kher',
      tz: 'IST',
    },
    {
      city: 'Goa',
      kind: 'Site office',
      address: 'House 214, Fort Aguada Road, Candolim, Bardez 403515',
      people: 9,
      lead: 'Rui Fernandes',
      tz: 'IST',
    },
    {
      city: 'Bengaluru',
      kind: 'Model workshop',
      address: 'Unit 7, Peenya Industrial Area, Phase II 560058',
      people: 6,
      lead: 'Deepa Rao',
      tz: 'IST',
    },
  ],
};

export const hero = {
  kicker: 'Est. 2011 — 41 people, 3 cities',
  lines: ['We build for', 'the eighth', 'monsoon.'],
  accentIndex: 2,
  lede:
    'Obsidian Atelier is a 41-person architecture and interiors practice working across coastal Maharashtra, Goa and the Deccan. We detail for 3,000mm of annual rain, 82% humidity, and clients who will still own the building in thirty years.',
  figure: 'hero-atrium',
  caption: 'Hacienda Espinal — courtyard section, ground floor',
  metrics: [
    { value: '142', suffix: '', label: 'Projects completed' },
    { value: '2.1', suffix: 'M sq ft', label: 'Built & handed over' },
    { value: '0', suffix: '', label: 'Structural failures' },
    { value: '31', suffix: '', label: 'Repeat clients' },
  ],
};

export const tickerClients = [
  'Godrej Properties',
  'Tata Realty',
  'The Bombay Canteen',
  'Goa Forest Dept.',
  'Kiran Rao Films',
  'Blue Tokai Coffee',
  'ICICI Home Finance',
  'Piramal Realty',
  'Brewdog India',
  'St. Xavier\u2019s College',
  'Lodha Group',
  'Sula Vineyards',
  'K Raheja Corp',
  'Hiranandani',
];

export const provenanceTicker = [
  { k: 'Current site load', v: '7 active builds' },
  { k: 'Drawing sets issued', v: '2,318 to date' },
  { k: 'Materials tested', v: '64 local suppliers' },
  { k: 'Monsoon failures caught', v: '9 pre-handover' },
  { k: 'Avg. build duration', v: '18.4 months' },
  { k: 'Local stone sourced', v: 'Basalt, laterite, Kota' },
];

export const capabilities = [
  {
    n: '01',
    title: 'Architecture',
    blurb:
      'Concept through to handover, with the same three people from first sketch to defect-liability expiry. We issue our own GFC sets — no outsourced detailing, no handover gaps.',
    deliverables: [
      'Feasibility & FSI study',
      'GFC drawing sets',
      'Structural coordination',
      'Municipal approvals (MCGM/GCZMA)',
      'Site supervision, weekly',
      'Defect liability — 24 months',
    ],
  },
  {
    n: '02',
    title: 'Interiors',
    blurb:
      'Hospitality, residential and workplace fit-outs where the joinery has to survive daily use rather than a photoshoot. In-house millwork shop in Peenya, 9,000 sq ft.',
    deliverables: [
      'Space planning',
      'Custom joinery + millwork',
      'FF&E procurement',
      'Lighting design',
      'Acoustic modelling',
      'Snagging & handover',
    ],
  },
  {
    n: '03',
    title: 'Adaptive Reuse',
    blurb:
      'Industrial and colonial stock in Mumbai is being demolished faster than it can be assessed. We start with a structural and material audit before anyone draws a new wall.',
    deliverables: [
      'Structural audit',
      'Heritage documentation',
      'Material salvage inventory',
      'Seismic retrofit planning',
      'Conservation consent',
      'Phased occupancy',
    ],
  },
  {
    n: '04',
    title: 'Landscape & Water',
    blurb:
      'In a city that floods every June, drainage is architecture. We design the ground plane first and treat rainwater as a structural element, not an afterthought.',
    deliverables: [
      'Hydrology survey',
      'Rainwater harvesting',
      'Native planting palette',
      'Hardscape detailing',
      'Percolation design',
      'Two-monsoon monitoring',
    ],
  },
];

export const cases = [
  {
    title: 'Meridian House',
    location: 'Alibaug, Raigad — 4,200 sq ft',
    year: '2023',
    img: 'project-meridian',
    alt: 'Laterite-walled courtyard house with deep verandah and monsoon planting',
    badge: 'Residential',
    challenge:
      'A 1.4-acre plot 900m from the shoreline, in a zone that takes 3,100mm of rain and sits 60cm above the high-tide mark. The brief: no air conditioning in the living spaces.',
    move:
      'Deep laterite cavity walls, a shaded courtyard spine, and a stack-effect vent through the roof plane. Laterite quarried 34km away in Kurul.',
    metrics: [
      { v: '3,100mm', l: 'Rain handled' },
      { v: '-6.2°C', l: 'Interior vs. exterior' },
      { v: '0', l: 'AC units installed' },
    ],
  },
  {
    title: 'Casa Lumen',
    location: 'Assagao, Goa — 18 keys',
    year: '2022',
    img: 'project-casa-lumen',
    alt: 'Boutique hotel corridor with lime-plaster walls and filtered daylight',
    badge: 'Hospitality',
    challenge:
      'A 1970s Portuguese-era shell, structurally compromised after 40 years of salt air, with a conservation order on the front facade and a 14-month opening deadline.',
    move:
      'Retained 78% of the original laterite structure, rebuilt the roof in Sal wood, and ran lime plaster throughout so the walls keep breathing.',
    metrics: [
      { v: '78%', l: 'Original fabric kept' },
      { v: '14 mo', l: 'To opening' },
      { v: '-31%', l: 'Vs. new-build cost' },
    ],
  },
  {
    title: 'Quarry House',
    location: 'Chikmagalur, Karnataka — 6,800 sq ft',
    year: '2024',
    img: 'project-quarry-house',
    alt: 'Concrete and basalt residence stepping down a slope',
    badge: 'Residential',
    challenge:
      'A disused basalt quarry with a 9m level change, no road access for a crane, and a client who wanted the excavation kept as evidence rather than filled.',
    move:
      'Four decks stepping with the rock face. All stone cut on site from the quarry floor. Concrete poured in eleven manual batches.',
    metrics: [
      { v: '9m', l: 'Level change resolved' },
      { v: '100%', l: 'Stone from site' },
      { v: '11', l: 'Hand-poured batches' },
    ],
  },
  {
    title: 'Atelier No. 7',
    location: 'Lower Parel, Mumbai — 9,400 sq ft',
    year: '2021',
    img: 'project-atelier-no7',
    alt: 'Converted mill floor with exposed steel trusses and clerestory glazing',
    badge: 'Workplace',
    challenge:
      'A 1912 cotton mill floor in a Grade II heritage building. The lease required a reversible fit-out — nothing could touch the original trusses.',
    move:
      'A freestanding steel frame inside the shell carrying everything: mezzanine, services, lighting. Demountable in 11 days because every joint is bolted.',
    metrics: [
      { v: '0', l: 'Trusses altered' },
      { v: '11 days', l: 'Full demountable' },
      { v: '1912', l: 'Original structure' },
    ],
  },
];

export const hubs = [
  {
    city: 'Mumbai',
    x: 26,
    y: 54,
    projects: 84,
    drawn: '1.28M sq ft',
    lead: 'Aparna Kher',
    note: 'Head studio. Approvals, heritage, adaptive reuse.',
    active: 4,
  },
  {
    city: 'Goa',
    x: 30,
    y: 68,
    projects: 31,
    drawn: '412k sq ft',
    lead: 'Rui Fernandes',
    note: 'Coastal residential, hospitality. GCZMA filings.',
    active: 2,
  },
  {
    city: 'Bengaluru',
    x: 44,
    y: 79,
    projects: 17,
    drawn: '268k sq ft',
    lead: 'Deepa Rao',
    note: 'Millwork shop, model-making, prototyping.',
    active: 1,
  },
  {
    city: 'Alibaug',
    x: 24,
    y: 62,
    projects: 6,
    drawn: '94k sq ft',
    lead: 'Site team',
    note: 'Second-home belt. Monsoon-resilient detailing.',
    active: 0,
  },
  {
    city: 'Chikmagalur',
    x: 40,
    y: 88,
    projects: 4,
    drawn: '62k sq ft',
    lead: 'Site team',
    note: 'Hill-slope builds, on-site quarry work.',
    active: 0,
  },
];

export const scopeOptions = [
  { id: 'concept', label: 'Concept only', mult: 0.28, weeks: 9 },
  { id: 'gfc', label: 'Concept + GFC', mult: 0.62, weeks: 22 },
  { id: 'full', label: 'Full service', mult: 1, weeks: 34 },
  { id: 'reuse', label: 'Adaptive reuse', mult: 0.86, weeks: 29 },
];

export const typologyOptions = [
  { id: 'residential', label: 'Residential', rate: 4200, factor: 1 },
  { id: 'hospitality', label: 'Hospitality', rate: 6800, factor: 1.18 },
  { id: 'workplace', label: 'Workplace', rate: 5100, factor: 1.06 },
  { id: 'retail', label: 'Retail / F&B', rate: 5600, factor: 1.1 },
];

export const finishedOptions = [
  { id: 'bare', label: 'Bare shell', mult: 0.72 },
  { id: 'standard', label: 'Standard', mult: 1 },
  { id: 'high', label: 'High-spec', mult: 1.42 },
];

export const processSteps = [
  {
    n: '01',
    title: 'Site audit',
    weeks: '1–3',
    body: 'We survey, test soil, measure existing structure and log every material worth keeping. No design starts before this.',
  },
  {
    n: '02',
    title: 'Scheme',
    weeks: '4–9',
    body: 'One direction, developed properly. Physical model at 1:100, not a render farm.',
  },
  {
    n: '03',
    title: 'GFC sets',
    weeks: '10–22',
    body: 'Drawings a contractor can actually build from. Issued in our name, coordinated with structural and MEP.',
  },
  {
    n: '04',
    title: 'Site',
    weeks: '23–handover',
    body: 'Weekly supervision, photographic logs, and a two-monsoon defect watch after handover.',
  },
];

export function inr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function waLink(message: string): string {
  return `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(message)}`;
}
