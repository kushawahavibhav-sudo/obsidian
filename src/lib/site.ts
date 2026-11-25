/**
 * OBSIDIAN — studio content model.
 * All copy, project data and studio facts live here so the components stay
 * purely presentational.
 */

/* ------------------------------------------------------------------ studio */

export const studio = {
  name: 'Obsidian',
  tagline: 'Architecture & Interiors',
  founded: 2009,
  locations: [
    {
      city: 'Mumbai',
      role: 'Studio & Workshop',
      address: '14 Ballard Estate, Fort, Mumbai 400001',
      phone: '+91 22 4890 1120',
      hours: 'Mon–Fri · 10:00–19:00 IST',
    },
    {
      city: 'Bengaluru',
      role: 'Design & Technology',
      address: 'Level 4, Residency Road, Bengaluru 560025',
      phone: '+91 80 4718 3300',
      hours: 'Mon–Fri · 10:00–19:00 IST',
    },
  ],
  intro:
    'Obsidian is an architecture and interior design studio working between Mumbai and Bengaluru. We design buildings, interiors and objects that hold their value long after handover — material-first, detail-led, and honest about what a space is actually for.',
  email: 'studio@obsidian.design',
} as const;

/* ------------------------------------------------------------------ metrics */

export const metrics = [
  { value: 87, suffix: '', label: 'Completed projects', note: 'Since 2009' },
  { value: 14, suffix: '', label: 'Awards & mentions', note: 'Across 9 competitions' },
  { value: 2, suffix: '', label: 'Studios', note: 'Mumbai & Bengaluru' },
  { value: 61, suffix: '%', label: 'Repeat & referred', note: 'Of all commissions' },
] as const;

/* ------------------------------------------------------------------ clients */

export const clients = [
  'Taj Hotels',
  'Rustom Jal',
  'Hindware',
  'Embassy REIT',
  'Kotak Mahindra',
  'Godrej Properties',
  'Zense',
  'Nirupama',
  'Karnataka Housing Board',
  'Nourish Co.',
] as const;

/* ------------------------------------------------------------------ projects */

export interface Project {
  id: string;
  index: string;
  name: string;
  category: 'Residential' | 'Hospitality' | 'Workplace' | 'Cultural';
  location: string;
  year: string;
  area: string;
  status: 'Completed' | 'In Progress';
  image: string;
  imageAlt: string;
  /** Short editorial line used on the index card. */
  summary: string;
  /** Long-form case study copy for the drawer. */
  brief: string;
  approach: string;
  outcome: string;
  materials: string[];
  facts: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: 'meridian',
    index: '01',
    name: 'Meridian House',
    category: 'Residential',
    location: 'Bandra West, Mumbai',
    year: '2024',
    area: '4,800 sq ft',
    status: 'Completed',
    image: 'project-meridian',
    imageAlt:
      'Double-height living room with a slender steel stair, travertine floors and a deep overhanging rooflight casting a hard diagonal shadow.',
    summary:
      'A bandu and steel house on a narrow plot, drawn around a single shaft of afternoon light.',
    brief:
      'The clients had lived in the same Bandra apartment for nineteen years and wanted a house that could hold three generations without feeling like a hotel. The site is 22 feet wide — the width of a two-car lane — with a 60-foot depth behind it.',
    approach:
      'We kept the ground floor almost entirely solid: a walled garden, a shaded threshold, one room. Light arrives only at the back, where a 40-foot steel stair rises through a rooflight and drops light into every room it passes. The structure is a welded steel frame with exposed I-beams, which allowed us to keep the footprint to 22 feet without a single intermediate column.',
    outcome:
      'Construction took 14 months, with 9 of them spent waiting on a single batch of Kenyan basalt that never arrived in the right tone. The finished house holds a stable 27°C through the May heat without mechanical cooling — and the stair has become the family\'s favourite room.',
    materials: ['Kenyan basalt', 'Welded steel', 'Teak joinery', 'Lime plaster'],
    facts: [
      { label: 'Site area', value: '2,940 sq ft' },
      { label: 'Built area', value: '4,800 sq ft' },
      { label: 'Structural system', value: 'RHS steel frame' },
      { label: 'Passive cooling', value: '27°C peak internal' },
      { label: 'Duration', value: '14 months' },
    ],
  },
  {
    id: 'casa-lumen',
    index: '02',
    name: 'Casa Lumen',
    category: 'Hospitality',
    location: 'Alibaug, Maharashtra',
    year: '2023',
    area: '18 keys',
    status: 'Completed',
    image: 'project-casa-lumen',
    imageAlt:
      'Sunlit guest room with lime-washed walls, a low teak daybed and woven cane screens casting fine linear shadows across the floor.',
    summary:
      'Eighteen keys and a restaurant, built from lime, cane and local laterite on a coastal orchard.',
    brief:
      'A family-owned orchard had been in the family for four generations. The brief was to open a small hotel without paving the site, cutting a single mature tree, or importing a single tile.',
    approach:
      'Every wall on the property is load-bearing laterite, laid by a mason from Alibaug who had worked with the family for two decades. Roofs are a traditional Mangalore-tile assembly over bamboo rafters. The only material brought in beyond the region was lime, which we burn on site to finish the walls and keep the walls cool through the monsoon.',
    outcome:
      'The hotel opened in October 2023 at 84% occupancy through its first year. The restaurant sources 60% of its produce from the two orchards on site. Construction used 31 tonnes of bamboo — every piece sourced within 40km.',
    materials: ['Load-bearing laterite', 'Bamboo rafters', 'Mangalore tile', 'Lime plaster'],
    facts: [
      { label: 'Keys', value: '18' },
      { label: 'Site area', value: '3.2 acres' },
      { label: 'Materials sourced', value: '78% within 40km' },
      { label: 'Occupancy', value: '84% first year' },
      { label: 'Trees felled', value: 'Zero' },
    ],
  },
  {
    id: 'quarry-house',
    index: '03',
    name: 'Quarry House',
    category: 'Residential',
    location: 'Sanand, Gujarat',
    year: '2025',
    area: '6,200 sq ft',
    status: 'Completed',
    image: 'project-quarry-house',
    imageAlt:
      'Cast-in-place concrete interior with a monolithic spiral stair, a single tall window and raw floor finish.',
    summary:
      'A concrete house built around the remains of a 1970s stone quarry it replaced.',
    brief:
      'The site is an exhausted granite quarry — 40 feet deep, stepped in three terraces, with a single access road. Rather than fill it, the clients asked us to build into it.',
    approach:
      'We cast the house directly in the quarry steps, so the excavation became the floor plan. The primary volume is in-situ concrete, poured against the original rock so the house reads as a continuation of the quarry rather than an object placed on it. Water from a 12,000-litre rainwater tank drives the entire irrigation system.',
    outcome:
      'Completed in March 2025. The house holds 21°C on a 44°C Ahmedabad afternoon with a 6kW solar array offsetting the lift and lighting loads. The step site was left as a dry garden with native grasses.',
    materials: ['In-situ concrete', 'Board-marked formwork', 'Granite', 'Blackened steel'],
    facts: [
      { label: 'Excavation', value: '1,100 m³' },
      { label: 'Built area', value: '6,200 sq ft' },
      { label: 'Rainwater storage', value: '12,000 litres' },
      { label: 'Solar offset', value: '6 kW array' },
      { label: 'Internal peak', value: '21°C' },
    ],
  },
  {
    id: 'atelier-no7',
    index: '04',
    name: 'Atelier No. 7',
    category: 'Workplace',
    location: 'Indiranagar, Bengaluru',
    year: '2024',
    area: '11,000 sq ft',
    status: 'In Progress',
    image: 'project-atelier-no7',
    imageAlt:
      'Open-plan studio workspace with exposed services, tall steel-framed windows and a long communal table under track lighting.',
    summary:
      'The headquarters of a 60-person design practice, organised around one long shared table.',
    brief:
      'A design firm outgrew a floor of a leased tower and wanted a space that behaved more like their studio than a corporate office.',
    approach:
      'Rather than a conventional office floor, the plan is organised around a 9-metre table that runs the full length of the building — everything else, meeting rooms, the library, the kitchen, the model shop, hangs off it. Structure and services are left exposed, and the exposed structure is the ceiling.',
    outcome:
      'Phase one is complete and occupied; phase two — the model shop and material library — is on site now, due Q4 2025. The practice reports a measurable drop in formal meeting time since moving.',
    materials: ['Blackened steel', 'Plywood', 'Terrazzo', 'Reclaimed teak'],
    facts: [
      { label: 'Built area', value: '11,000 sq ft' },
      { label: 'Headcount', value: '60' },
      { label: 'Shared table', value: '9 metres' },
      { label: 'Phase', value: 'Two of three' },
      { label: 'Target', value: 'Q4 2025' },
    ],
  },
  {
    id: 'kanchi-lodge',
    index: '05',
    name: 'Kanchi Lodge',
    category: 'Hospitality',
    location: 'Kanchipuram, Tamil Nadu',
    year: '2022',
    area: '9 keys',
    status: 'Completed',
    image: 'hospitality-lobby',
    imageAlt:
      'Hotel lobby with a reception desk in dark stone, a sunken seating pit and filtered daylight from a clerestory.',
    summary:
      'Nine keys in a converted 1930s merchant house in the temple town of Kanchipuram.',
    brief:
      'The house had been structurally unsafe for decades and the family wanted it to survive — not as a replica, but as a place that still worked.',
    approach:
      'We kept the original brick shell and repaired rather than replaced. The new insertions — bathrooms, kitchen, bar — are deliberately modern and visibly distinct: stainless steel, frameless glass, and a new stair expressed as a separate object against the old masonry.',
    outcome:
      'Opened in 2022. Nine keys, a 28-cover courtyard restaurant and a 400 sq ft gallery for temple-stone carving. The building won the AIAN National Award for adaptive reuse in 2023.',
    materials: ['Reclaimed brick', 'Stainless steel', 'Frameless glass', 'Temple stone'],
    facts: [
      { label: 'Keys', value: '9' },
      { label: 'Original brick retained', value: '91%' },
      { label: 'Courtyard covers', value: '28' },
      { label: 'Gallery area', value: '400 sq ft' },
      { label: 'Award', value: 'AIAN National, 2023' },
    ],
  },
  {
    id: 'saltworks',
    index: '06',
    name: 'Saltworks',
    category: 'Cultural',
    location: 'Diu, Gujarat',
    year: '2023',
    area: '28,000 sq ft',
    status: 'Completed',
    image: 'detail-concrete',
    imageAlt:
      'Board-marked concrete wall meeting a long bench in raking light, showing the grain of the timber formwork.',
    summary:
      'A salt warehouse converted into an arts centre — 40 metres of uninterrupted wall.',
    brief:
      'A derelict salt warehouse on the Diu coast, given to the city, with a brief to build a performance space without importing a single acoustic product.',
    outcome:
      'We built the room itself out of mass concrete with an exposed aggregate that scatters sound back into the room — no acoustic panels, no suspended ceilings, no imported products. A 40-metre uninterrupted wall takes a 6-metre projection without a single fixing point.',
    approach:
      'Mass concrete, board-marked, with a local aggregate of crushed salt-crystal waste from the plant itself. The result is a wall that both reflects and absorbs.',
    materials: ['Mass concrete', 'Salt aggregate', 'Blackened steel', 'Oxidised copper'],
    facts: [
      { label: 'Floor area', value: '28,000 sq ft' },
      { label: 'Clear wall', value: '40 metres' },
      { label: 'Seating', value: '420' },
      { label: 'Acoustic panels', value: 'None' },
      { label: 'Opened', value: 'Nov 2023' },
    ],
  },
];

/* ------------------------------------------------------------------ services */

export interface Service {
  index: string;
  title: string;
  blurb: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    index: '01',
    title: 'Architecture',
    blurb:
      'New build, additions and adaptive reuse — from feasibility through to the last hinge.',
    deliverables: [
      'Site appraisal & feasibility study',
      'Concept design and massing studies',
      'Technical documentation and tender set',
      'Construction supervision through handover',
    ],
  },
  {
    index: '02',
    title: 'Interiors',
    blurb:
      'Spatial planning, material selection and joinery for residential, hospitality and workplace.',
    deliverables: [
      'Space planning and circulation study',
      'Material palette and sample boards',
      'Bespoke joinery and furniture drawings',
      'Lighting, HVAC and services coordination',
    ],
  },
  {
    index: '03',
    title: 'Adaptive Reuse',
    blurb:
      'Giving old structures a working second life without pretending they were built yesterday.',
    deliverables: [
      'Structural condition survey',
      'Retention and repair strategy',
      'Old-new junction detailing',
      'Heritage and consent documentation',
    ],
  },
  {
    index: '04',
    title: 'Objects & Detail',
    blurb:
      'The last 5% — the parts of a space that decide how it feels to live in.',
    deliverables: [
      'Bespoke furniture and lighting',
      'Metalwork and joinery prototypes',
      'Material prototyping in workshop',
      'On-site styling and art curation',
    ],
  },
];

/* ------------------------------------------------------------------ process */

export const process = [
  {
    stage: 'I',
    phase: 'Listen',
    duration: '2–4 weeks',
    copy: 'We walk the site, listen to how the clients actually use their days, and agree what the project must do before drawing a single line.',
  },
  {
    stage: 'II',
    phase: 'Resolve',
    duration: '6–10 weeks',
    copy: 'Massing, light, structure and material are tested against each other in physical models — not in isolation on a screen.',
  },
  {
    stage: 'III',
    phase: 'Document',
    duration: '8–12 weeks',
    copy: 'Full technical sets, specifications and a cost plan built alongside the drawings, so the budget moves with the design rather than after it.',
  },
  {
    stage: 'IV',
    phase: 'Build',
    duration: '9–18 months',
    copy: 'Weekly site presence, material samples on site before use, and a fixed process for every change.',
  },
] as const;

/* ------------------------------------------------------------------ awards */

export const awards = [
  { year: '2025', title: 'IIA Award for Excellence', detail: 'Residential Architecture — Quarry House' },
  { year: '2024', title: 'AIAN National Award', detail: 'Interior Architecture — Casa Lumen' },
  { year: '2023', title: 'AIAN National Award', detail: 'Adaptive Reuse — Kanchi Lodge' },
  { year: '2022', title: 'Architectural Review House of the Year', detail: 'Shortlist — Meridian House' },
] as const;

/* ------------------------------------------------------------------ journal */

export const journal = [
  {
    id: 'j1',
    date: '14 Aug 2025',
    title: 'Why we still draw by hand',
    excerpt:
      'Digital tools made it faster to move a wall. They did not make it easier to know whether the wall should move.',
    tag: 'Practice',
  },
  {
    id: 'j2',
    date: '02 Jul 2025',
    title: 'Lime, and the long argument for soft walls',
    excerpt:
      'A material that takes three coats, six weeks and a mason with a specific handshake. Why we keep specifying it.',
    tag: 'Materials',
  },
  {
    id: 'j3',
    date: '19 May 2025',
    title: 'The 27-degree house',
    excerpt:
      'What passive cooling actually looks like in Bandra, measured over one brutal May.',
    tag: 'Field Notes',
  },
] as const;

/* ------------------------------------------------------------------ regions */

/**
 * Footprint map. Coordinates are in a 1000x560 SVG space, hand-placed to match
 * a stylised map of India.
 */
export interface Region {
  id: string;
  city: string;
  kind: 'Studio' | 'Project City';
  projects: number;
  note: string;
  x: number;
  y: number;
}

export const regions: Region[] = [
  { id: 'mumbai', city: 'Mumbai', kind: 'Studio', projects: 31, note: 'Head studio & workshop', x: 353, y: 434 },
  { id: 'bengaluru', city: 'Bengaluru', kind: 'Studio', projects: 19, note: 'Design & technology', x: 398, y: 506 },
  { id: 'alibaug', city: 'Alibaug', kind: 'Project City', projects: 6, note: 'Coastal Maharashtra', x: 330, y: 456 },
  { id: 'sanand', city: 'Sanand', kind: 'Project City', projects: 4, note: 'Gujarat', x: 251, y: 366 },
  { id: 'kanchipuram', city: 'Kanchipuram', kind: 'Project City', projects: 5, note: 'Tamil Nadu', x: 437, y: 486 },
  { id: 'diu', city: 'Diu', kind: 'Project City', projects: 3, note: 'Gujarat coast', x: 200, y: 366 },
  { id: 'goa', city: 'Goa', kind: 'Project City', projects: 7, note: 'Residences', x: 295, y: 446 },
  { id: 'pune', city: 'Pune', kind: 'Project City', projects: 6, note: 'Residential & workplace', x: 332, y: 438 },
  { id: 'hyderabad', city: 'Hyderabad', kind: 'Project City', projects: 4, note: 'Hospitality', x: 415, y: 424 },
  { id: 'kochi', city: 'Kochi', kind: 'Project City', projects: 2, note: 'Coastal projects', x: 340, y: 542 },
] as const;

/* ------------------------------------------------------------------ estimator */

export interface EstimateLine {
  label: string;
  value: string;
}

export const estimator = {
  /** Multipliers keyed by scope selection. */
  scopes: [
    { id: 'interiors', label: 'Interior Fit-Out', base: 1850, perSqft: 0 },
    { id: 'renovation', label: 'Renovation', base: 2400, perSqft: 0 },
    { id: 'newbuild', label: 'New Build', base: 3200, perSqft: 0 },
    { id: 'adaptive', label: 'Adaptive Reuse', base: 3900, perSqft: 0 },
  ],
  /** Tiered rates per sq ft in INR, by finish level. */
  finishes: [
    { id: 'crafted', label: 'Crafted', note: 'Honest materials, considered detailing', rate: 2100 },
    { id: 'refined', label: 'Refined', note: 'Signature stone, custom joinery', rate: 2950 },
    { id: 'bespoke', label: 'Bespoke', note: 'Rare material, architect-led detail', rate: 4200 },
  ],
  cities: [
    { id: 'mumbai', label: 'Mumbai', factor: 1.0 },
    { id: 'bengaluru', label: 'Bengaluru', factor: 0.88 },
    { id: 'alibaug', label: 'Alibaug', factor: 0.79 },
    { id: 'other', label: 'Elsewhere in India', factor: 0.82 },
  ],
  /** Service add-ons priced as a percentage uplift on construction. */
  addons: [
    { id: 'furniture', label: 'Bespoke Furniture & Styling', uplift: 0.12 },
    { id: 'lighting', label: 'Lighting Design', uplift: 0.05 },
    { id: 'landscape', label: 'Landscape & Terrace', uplift: 0.07 },
    { id: 'art', label: 'Art Curation', uplift: 0.04 },
  ],
} as const;

/* ------------------------------------------------------------------ navigation */

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'practice', label: 'Practice' },
  { id: 'footprint', label: 'Footprint' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
] as const;
