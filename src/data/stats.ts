export interface Stat {
  id: string;
  label: string;
  value: string;
  unit: string;
  tag: string;
}

export const stats: Stat[] = [
  {
    id: 'carbon',
    label: 'Carbon Reduced & Measured',
    value: '1.4M+',
    unit: 'Tons of CO₂',
    tag: 'Verified by international carbon registries',
  },
  {
    id: 'compliance',
    label: 'Policy & Regulatory Approval',
    value: '100%',
    unit: 'Compliance Rate',
    tag: 'Aligned with Rwanda national climate standards',
  },
  {
    id: 'projects',
    label: 'Completed Engagements',
    value: '50+',
    unit: 'Delivered Projects',
    tag: 'Serving businesses, farmers, and government agencies',
  },
  {
    id: 'districts',
    label: 'National Reach',
    value: '30',
    unit: 'Districts of Rwanda',
    tag: 'Field teams active across all provinces',
  },
];

export interface QuickStat {
  value: string;
  label: string;
}

export const quickStats: QuickStat[] = [
  { value: '12+ Years', label: 'In Business' },
  { value: '50+ Projects', label: 'Delivered' },
  { value: '30 Districts', label: 'National Reach' },
];

export interface AboutStat {
  tag: string;
  value: string;
  headline: string;
  desc: string;
}

export const aboutStats: AboutStat[] = [
  {
    tag: 'PROVEN TRACK RECORD',
    value: '12+',
    headline: 'Years of Experience',
    desc: 'Founded in Kigali in 2012, providing consistent environmental guidance to public and private partners.',
  },
  {
    tag: 'MEASURABLE IMPACT',
    value: '50+',
    headline: 'Completed Projects',
    desc: 'From community tree planting to national environmental assessments and carbon calculations.',
  },
  {
    tag: 'REGIONAL FOOTPRINT',
    value: '4',
    headline: 'East African Countries',
    desc: 'Active partnerships and advisory work in Rwanda, Uganda, Kenya, and Tanzania.',
  },
  {
    tag: 'REGULATORY CLEARANCE',
    value: '98%',
    headline: 'First-Round Approval',
    desc: 'Our project documentation consistently meets national and international environmental standards.',
  },
];
