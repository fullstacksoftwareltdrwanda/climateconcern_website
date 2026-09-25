export interface Milestone {
  year: string;
  title: string;
  description: string;
  tag: string;
}

export const milestones: Milestone[] = [
  {
    year: '2012',
    title: 'Founded in Kigali',
    description:
      'Climate Concern Rwanda was established as an environmental consulting firm in Kigali, dedicated to helping local institutions make informed ecological decisions.',
    tag: 'Company Inception',
  },
  {
    year: '2014',
    title: 'First National Environmental Audit',
    description:
      'Completed our first major nationwide study with the Rwanda Environment Management Authority (REMA), assessing emissions and climate vulnerability across 30 districts.',
    tag: 'National Expansion',
  },
  {
    year: '2016',
    title: 'Growing Field & Science Team',
    description:
      'Expanded our full-time team to include environmental economists, foresters, and GIS data analysts, opening satellite project bases in Musanze and Huye.',
    tag: 'Team Growth',
  },
  {
    year: '2018',
    title: 'First Community Carbon Project',
    description:
      'Supported the development of an agroforestry project in Gicumbi District covering over 12,000 hectares, linking local farmers with international carbon markets.',
    tag: 'Carbon Innovation',
  },
  {
    year: '2020',
    title: 'Regional Work Across East Africa',
    description:
      'Expanded our advisory assignments into neighboring East African countries, providing cross-border technical advice in Uganda, Kenya, and Tanzania.',
    tag: 'Regional Reach',
  },
  {
    year: '2022',
    title: 'Rwanda Climate Academy Launched',
    description:
      'Opened our training academy to equip young professionals, bank officers, and community leaders with hands-on skills in carbon accounting and green finance.',
    tag: 'Practical Education',
  },
  {
    year: '2024',
    title: '1.4M+ Tons of CO₂ Verified',
    description:
      'Reached a historic milestone: over 1.4 million tons of carbon reductions verified across community forestry and clean cooking programs.',
    tag: 'Major Impact',
  },
  {
    year: 'Today',
    title: 'Leading Sustainable Growth',
    description:
      'Proudly managing active sustainability programs with leading public institutions, community cooperatives, and green enterprise partners throughout Rwanda.',
    tag: 'Current Operations',
  },
];

export const pillars = [
  {
    title: 'Practical Science',
    description:
      'We combine satellite mapping with rigorous field tests so our clients get real, accurate data they can trust.',
  },
  {
    title: 'Transparent & Compliant',
    description:
      'Every assessment and project strictly adheres to Rwandan regulations and respected international sustainability standards.',
  },
  {
    title: 'Community-Driven',
    description:
      'Our team is based right here in Rwanda. We build projects that create local jobs, protect water sources, and empower rural families.',
  },
];
