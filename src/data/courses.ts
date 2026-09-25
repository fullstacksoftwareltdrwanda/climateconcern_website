export interface CourseTopic {
  text: string;
}

export interface Course {
  id: string;
  trackNumber: string;
  duration: string;
  level: string;
  badge: string;
  title: string;
  description: string;
  topics: CourseTopic[];
  outcome: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export const courses: Course[] = [
  {
    id: 'carbon-projects',
    trackNumber: 'Course 01',
    duration: '8 Weeks',
    level: 'Professional Certification',
    badge: 'Popular',
    title: 'Carbon Project Development & Field Auditing',
    description:
      'A practical, step-by-step masterclass on how carbon projects work, from baseline calculations and satellite forest monitoring to independent audits and verified credit issuance.',
    topics: [
      { text: 'Understanding voluntary and compliance carbon standards' },
      { text: 'How to calculate emissions baselines in agriculture and forestry' },
      { text: 'Using satellite mapping to track tree cover and biomass' },
      { text: 'Preparing for independent audits and avoiding common mistakes' },
      { text: 'Hands-on soil and vegetation sampling in Rwandan field sites' },
    ],
    outcome: 'Certificate of Professional Competency in Carbon Auditing',
    price: 'USD 2,400',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBx_WUbu_suzGJSHT5tHtR3Mpv5SZisnNPocyIXEBQoBPYAsedKrhiasWzgfAg7-SL9D3zCFLWHTPVfhVTsUAlhmP-p3EsYFa6S9XqF396R9EPOQcjOSqNn2j0VO5S_WEY5nVzYGiNhjHl2-DnSdm5NGkCVOLKXebhzc0qnzLwruZCDrNJwDvPGgOBwqiCQ3ImO0d3yvGYxI9sBSL3_rvXUazYQmBlY46KSP_TdHr09rwZIQhWnoK81DQ',
    imageAlt: 'Field researchers learning carbon measurement in Rwanda',
  },
  {
    id: 'climate-finance',
    trackNumber: 'Course 02',
    duration: '6 Weeks',
    level: 'Executive Program',
    badge: 'Executive Track',
    title: 'Climate Finance & Green Investments',
    description:
      'Designed for banking professionals, corporate sustainability leads, and policy managers seeking to access green grants, issue green bonds, and fund climate adaptation projects.',
    topics: [
      { text: 'Green bonds and sustainability-linked lending in Africa' },
      { text: 'How to structure bankable green business proposals' },
      { text: 'Understanding international climate funds and grant criteria' },
      { text: 'ESG screening and climate risk assessment for financial portfolios' },
      { text: 'Case studies of successful climate investments in Rwanda' },
    ],
    outcome: 'Executive Certificate in Green Finance & Deal Readiness',
    price: 'USD 3,200',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmJOENzPC_p3WxN_A-EQYTJYhiEtx00Qz6NhRHS7PWMVRNJin4tlKs6zv5sOhGBzWs-65ZxDsk9-oz_d6YHOJIk60vRs2Nx_jk0BMjJYdjEoa38Te7bdESv0tth_RuSVM8WmmEweZbGjQ8Bpbtrd3R6jQ6no01lFz9KW4xI9zG3GWcspq3P0DpUgsIbN5_Nkv8E7SDMDR58_mJ6UfTO3OyqypH3EYz-oj81t7F7TxivGVdTw4PA9GjaA',
    imageAlt: 'Climate finance workshop in Kigali',
  },
  {
    id: 'climate-policy',
    trackNumber: 'Course 03',
    duration: '4 Weeks',
    level: 'Specialist Course',
    badge: 'Accelerated',
    title: 'National Climate Policy & Carbon Accounting',
    description:
      'An intensive four-week course for government officials, NGO directors, and sustainability managers on national climate commitments, emissions reporting, and regional cooperation.',
    topics: [
      { text: 'How national climate targets (NDCs) are measured and reported' },
      { text: 'Cross-border carbon trading rules and government guidelines' },
      { text: 'Building national greenhouse gas inventories' },
      { text: 'Integrating climate goals into district development plans' },
      { text: 'Working with international environmental partners effectively' },
    ],
    outcome: 'Specialist Credential in National Climate Governance',
    price: 'USD 1,800',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeJ0X0ihXKEoO0E7mpUpNT9tqgOXiLZC4rzuZtGzaiNnryO90bQPukRvS0AhREhuG9B_EABa0EH_WGbEqZJfE9nxp5EqjsK52hw7IyV-y50p6Q0tjeYmMBPUUeFi_a-sl2ukmL83fyiBe9nmD3gWec3ZvmcIQkC_EaSXwNuCyKRTuCr11mHh5ZhdcgMlYliyK7BT5ytIv9xA7u2q-eVnpkZoY9iqhNyM4eGEEwjPNCIxPiUBMxWj9oQw',
    imageAlt: 'Policy specialists in discussion in Kigali',
  },
];

export const programSteps = [
  {
    step: '01',
    title: 'Apply Online',
    description: 'Fill out our brief registration form and select the course track that matches your career goals.',
  },
  {
    step: '02',
    title: 'Flexible Virtual Learning',
    description: 'Join live evening and weekend online lectures with recorded sessions available anytime for review.',
  },
  {
    step: '03',
    title: 'Hands-on Kigali Field Labs',
    description: 'Participate in practical weekend field exercises in Rwanda forests and wetlands with real equipment.',
  },
  {
    step: '04',
    title: 'Certified Graduation',
    description: 'Earn a recognized credential and join our network of certified environmental leaders across East Africa.',
  },
];
