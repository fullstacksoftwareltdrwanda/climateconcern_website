export interface SubArea {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  icon: string;
  tabLabel: string;
  headline: string;
  shortSummary: string;
  deliverables: string[];
  subAreas?: SubArea[];
  cta: string;
  ctaLink: string;
  color: string;
}

export const services: Service[] = [
  {
    id: 'advisory',
    icon: '🌿',
    tabLabel: 'Advisory',
    headline: 'Advisory Services',
    shortSummary:
      'Expert guidance on environmental protection and climate change finance — helping governments, businesses, and communities make the right decisions.',
    deliverables: [
      'National and district environmental action plans',
      'Green finance proposals and investment strategies',
      'Climate risk assessments and compliance reviews',
      'Bilateral partnership frameworks for green projects',
    ],
    subAreas: [
      {
        title: 'Environmental Protection',
        description:
          'We help organizations understand, manage, and reduce their environmental impact through practical assessments, policy guidance, and compliance reviews.',
      },
      {
        title: 'Climate Change Finance',
        description:
          'We design climate finance proposals and green investment strategies that unlock funding from international and regional climate funds.',
      },
    ],
    cta: 'Get Advisory Support',
    ctaLink: '/meet-us',
    color: 'green',
  },
  {
    id: 'project-design',
    icon: '📐',
    tabLabel: 'Project Design',
    headline: 'Project Design',
    shortSummary:
      'End-to-end design of environmental and climate projects — from concept to certified, field-ready implementation plans.',
    deliverables: [
      'Project feasibility and baseline assessments',
      'Full Project Design Documents (PDD)',
      'Third-party audit preparation and certification support',
      'Field monitoring, measurement, and reporting plans',
    ],
    cta: 'Start a Project',
    ctaLink: '/meet-us',
    color: 'black',
  },
  {
    id: 'training',
    icon: '🎓',
    tabLabel: 'Training',
    headline: 'Training Programs',
    shortSummary:
      'Hybrid professional training — self-paced online learning combined with optional in-person practicum for hands-on certification.',
    deliverables: [
      'Self-paced online sessions (Intro, Discussion, Test)',
      'Certification upon passing the final test',
      'Optional in-person practicum for field skills',
      'Designed for environmental officers, finance teams, and project managers',
    ],
    cta: 'Enroll Now',
    ctaLink: '/training',
    color: 'green',
  },
];
