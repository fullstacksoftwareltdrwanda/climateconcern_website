export interface TeamMember {
  name: string;
  role: string;
  isFounder?: boolean;
  initials: string;
  image?: string;
  bio?: string;
  education?: string[];
  keyAreas?: string[];
}

export interface RecordMetric {
  value: string;
  numeric: number;
  label: string;
  description: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  scope: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  topics: string[];
}

export interface LibraryCategory {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  items: Array<{
    title: string;
    description: string;
    date?: string;
    link?: string;
    tag?: string;
  }>;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Jean NTAZINDA',
    role: 'Founder',
    isFounder: true,
    initials: 'JN',
    image: '/images/jean.jpg',
    bio: `With over fifteen years of experience in the carbon market and climate finance, Mr. NTAZINDA has played a key role in designing numerous emission reduction projects for both compliant and voluntary markets, which have generated millions of CERs and VERs. His expertise also extends to supporting the Rwanda National Country Programme and Framework for National Engagement with the Green Climate Fund. Furthermore, he contributed to the development of the Standardized Crediting Framework, piloted by Ci-Dev, for the implementation of Article 6 of the Paris Agreement in Rwanda and other African nations.\n\nBefore establishing Climate Concern in 2012, Mr. NTAZINDA was instrumental in setting up the Designated National Authority (DNA) Secretariat for the carbon market during his time at the Rwanda Environment Management Authority (REMA).\n\nMr. NTAZINDA's academic and professional journey has consistently focused on GHG mitigation and adaptation to the effects of climate change. He is currently engaged in several consulting assignments at the national and African regional levels, supporting the implementation of Article 6 of the Paris Agreement and the design of emission reduction projects. He holds a BSc in Geography with a focus on Environmental Planning from the University of Rwanda and a MSc in International Development Administration with a specialization in Climate Change Resilience and Risk Management from Andrews University in Michigan, USA.`,
    education: [
      'MSc in International Development Administration (Climate Resilience & Risk Mgmt) — Andrews University, Michigan, USA',
      'BSc in Geography (Environmental Planning) — University of Rwanda',
    ],
    keyAreas: [
      'Article 6 of the Paris Agreement',
      'Green Climate Fund (GCF) Frameworks',
      'CER & VER Carbon Credits Origination',
      'Standardized Crediting Framework (SCF)',
    ],
  },
  {
    name: 'UMUGISHA Dieudonné',
    role: 'Managing Consultant',
    initials: 'UD',
    image: '/images/dieudonne.jpg',
    bio: 'Oversees organizational strategy, project operations, and coordination across Climate Concern consulting assignments in Rwanda and the East African Community.',
    keyAreas: ['Consulting Operations', 'Multi-stakeholder Coordination', 'Project Delivery'],
  },
  {
    name: 'BAMUSIIME Alice',
    role: 'Lead Consultant, Gender & Environmental Safeguards',
    initials: 'BA',
    image: '/images/alice.jpg',
    bio: 'Leads gender integration, social inclusion, and environmental safeguards frameworks to ensure climate and development interventions adhere to international standards.',
    keyAreas: ['Gender Equality in Climate Action', 'Environmental & Social Safeguards', 'Community Engagement'],
  },
  {
    name: 'Peter KATANISA',
    role: 'Lead Consultant, Circular Economy and Natural Resources Management and Climate Policy',
    initials: 'PK',
    image: '/images/peter.jpg',
    bio: `Peter Katanisa is a seasoned development professional with over 15 years of experience in environment natural resources management (NRM) and climate change policy, natural capital accounting, conservation, tourism development, and project management. With a strong academic background including a postgraduate diploma in Project Management (with distinction) and a Bachelor’s degree in Economics, Peter combines technical expertise with strategic leadership across a wide spectrum of sustainability initiatives.\n\nHe currently serves as the Coordinator of the Africa Natural Capital Accounting Community of Practice (NCA-CoP), hosted by the World Bank's Global Program on Sustainability (GPS). His work spans 48 African countries, fostering policy integration of environmental-economic accounts into development planning. Peter also consults as a Senior Policy Specialist on climate and environment for World Bank-supported initiatives in Rwanda, including the Climate and Nature Finance Strategy and Green Finance & Investment programs.\n\nPreviously, he led Rwanda’s contributions to the NDC Partnership as Co-Chair Coordinator and represented the country at major UN Climate Change Conferences (COP27–29). His professional history includes advisory roles at the Ministry of Environment and the Ministry of Natural Resources in Rwanda, national coordination of the WAVES/NCA program, and senior leadership in tourism product development with the Rwanda Development Board.\n\nPeter is fluent in English and Kinyarwanda, with working knowledge of French and Swahili, and is highly regarded for his integrity, strategic coordination, stakeholder engagement, and results-driven project execution.`,
    education: [
      'Postgraduate Diploma in Project Management (with distinction)',
      'Bachelor’s degree in Economics',
    ],
    keyAreas: [
      'Natural Capital Accounting (NCA)',
      'Circular Economy Strategy',
      'NDC Partnership Coordination (COP27–COP29)',
      'World Bank Climate & Nature Finance Initiatives',
    ],
  },
  {
    name: 'Dominique KAYIGIRE',
    role: 'Lead Consultant, Environmental Compliance',
    initials: 'DK',
    bio: 'Specializes in regulatory environmental audits, national environmental standards compliance, and environmental management systems across East African industries.',
    keyAreas: ['Environmental Compliance Audits', 'REMA Regulations', 'Environmental Management Systems'],
  },
  {
    name: 'Omer ELAWAD',
    role: 'Lead Consultant, Carbon Market',
    initials: 'OE',
    image: '/images/Omer.jpeg',
    bio: 'Senior carbon market specialist advising on voluntary and compliance market mechanisms, project design documentation, and carbon crediting methodologies.',
    keyAreas: ['Carbon Market Structuring', 'Emission Reduction Methodologies', 'Article 6 Crediting'],
  },
];

export const ourRecord = {
  projectsCount: '11',
  impactedPeople: '11 Millions',
  sectors: ['Energy', 'Housing', 'Infrastructure', 'Land Use', 'Forestry & Agriculture'],
  metrics: [
    {
      value: '11',
      label: 'Verified Projects',
      description: 'Successfully structured and implemented high-impact initiatives.',
    },
    {
      value: '11M',
      label: 'Impacted People',
      description: 'Lives and livelihoods supported through sustainable climate resilience.',
    },
    {
      value: '5+',
      label: 'Key Priority Sectors',
      description: 'Energy, housing, infrastructure, land use, and agriculture.',
    },
    {
      value: '6',
      label: 'EAC Countries',
      description: 'Active across Rwanda, Burundi, Uganda, Tanzania, Kenya, and South Sudan.',
    },
  ],
};

export const aboutContent = {
  headline: 'Climate Concern',
  subtitle: 'Consulting company established in 2012 and based in Kigali.',
  paragraph1:
    'Climate Concern, a consulting company established in 2012 and based in Kigali. We operate as a consulting staff to provide expert services in sectors relevant to environment and climate change.',
  coreBusinessIntro:
    'Our core business encompasses a range of services, including: Climate Finance Proposal Design, Carbon Market Projects Design (From Origination to Issuance), Stakeholder Engagement, Strategic Environmental Impact Assessment, Social and Environmental Impact Assessment.',
  regionalFocus:
    'While our primary operations are in Rwanda, we also extend our expertise across the East African Community (EAC) region, which includes Rwanda, Burundi, Uganda, Tanzania, Kenya, and South Sudan. We undertake consultancies aligned with our core business, focusing on environment and climate change related feasibility studies, as well as project and program design and implementation.',
  regionalRationale:
    "We focus on this region due to its high population density and limited natural resources. The reliance on subsistence agriculture in the three landlocked member countries, coupled with the heavy dependence on biomass for energy, place significant pressure on existing forests. Furthermore, the region's vulnerability to the effects of climate change is evident through regular flooding and drought, with infrastructure, housing, and agriculture sectors facing the most substantial needs for adaptation support.",
};

export const whatWeOffer: ServiceOffer[] = [
  {
    id: 'climate-finance',
    title: 'Climate Finance Proposal Design',
    shortDesc:
      'Designing bankable green finance proposals aligned with international funds such as the Green Climate Fund (GCF) and bilateral instruments.',
    icon: '💰',
    scope: [
      'National Country Programme & GCF engagement frameworks',
      'Concessional finance and blended finance proposal design',
      'Feasibility studies and climate rationale development',
      'Investment prioritization and co-financing structuring',
    ],
  },
  {
    id: 'carbon-market',
    title: 'Carbon Market Projects Design (From Origination to Issuance)',
    shortDesc:
      'End-to-end carbon project origination, methodology alignment, baseline setting, PDD development, and issuance of CERs and VERs.',
    icon: '🌱',
    scope: [
      'Article 6 of the Paris Agreement implementation support',
      'Standardized Crediting Framework (SCF) application',
      'Project Design Document (PDD) preparation',
      'Validation, verification, and credit issuance management',
    ],
  },
  {
    id: 'stakeholder-engagement',
    title: 'Stakeholder Engagement',
    shortDesc:
      'Structured public participation, free prior and informed consent, institutional consensus building, and community consultation frameworks.',
    icon: '🤝',
    scope: [
      'Participatory rural appraisals and community workshops',
      'Government ministry and development partner dialogues',
      'Grievance redress mechanism (GRM) design',
      'Multi-stakeholder roadmaps and governance frameworks',
    ],
  },
  {
    id: 'strategic-eia',
    title: 'Strategic Environmental Impact Assessment',
    shortDesc:
      'High-level strategic assessments integrating environmental, climate risk, and sustainability dimensions into policies, plans, and regional programs.',
    icon: '📐',
    scope: [
      'Sector-wide strategic environmental reviews',
      'Policy and legislative compliance alignment',
      'Cumulative environmental impact modeling',
      'Green growth integration for national programs',
    ],
  },
  {
    id: 'social-environmental-ia',
    title: 'Social and Environmental Impact Assessment',
    shortDesc:
      'Comprehensive project-level environmental and social impact assessments ensuring strict regulatory compliance and safeguard verification.',
    icon: '🛡️',
    scope: [
      'REMA compliance and statutory permitting audits',
      'Environmental and Social Management Plans (ESMP)',
      'Biodiversity and watershed baseline evaluations',
      'Resettlement and livelihood restoration advisory',
    ],
  },
];

export interface StaticTrainingCourse {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  overview: string;
  modules: string[];
  phase1Price?: number;
  phase2Price?: number;
  phase1Title?: string;
  phase1Desc?: string;
  phase2Title?: string;
  phase2Desc?: string;
}

export const trainingProgram: {
  headline: string;
  lead: string;
  courses: StaticTrainingCourse[];
} = {
  headline: 'Training Program',
  lead: 'Climate Concern training program is all you need to become an expert in Carbon Market and climate finance. Our courses are designed and taught by world-class experienced professionals.',
  courses: [
    {
      id: 'carbon-market-courses',
      title: 'Certified Carbon Market Courses',
      subtitle: 'From Fundamentals to Article 6 & Verified Credit Issuance',
      badge: 'Certified Professional Course',
      overview: '',
      modules: [],
      phase1Price: 50,
      phase2Price: 50,
      phase1Title: 'Phase 1: Self-Paced Online Learning',
      phase1Desc:
        'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.',
      phase2Title: 'Phase 2: Interactive Expert Support & Hands-On Practice',
      phase2Desc:
        'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.',
    },
    {
      id: 'climate-adaptation-courses',
      title: 'Certified Climate Adaptation Finance Courses',
      subtitle: 'Designing Bankable Projects for Sovereign & Regional Adaptation',
      badge: 'Executive Certification',
      overview: '',
      modules: [],
      phase1Price: 50,
      phase2Price: 50,
      phase1Title: 'Phase 1: Self-Paced Online Learning',
      phase1Desc:
        'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.',
      phase2Title: 'Phase 2: Interactive Expert Support & Hands-On Practice',
      phase2Desc:
        'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.',
    },
  ],
};

export const libraryData: LibraryCategory[] = [
  {
    id: 'podcast',
    title: 'Podcasts (Free Videos)',
    tagline: 'Expert video conversations, webinars, and field discussions with carbon and climate finance specialists.',
    icon: '🎙️',
    items: [
      {
        title: 'Episode 1: Navigating Article 6 of the Paris Agreement in Rwanda',
        description: 'Founder Jean Ntazinda breaks down how Article 6 works, bilateral carbon trades, and what it means for East Africa.',
        date: 'Recent Episode',
        tag: 'Video Discussion',
      },
      {
        title: 'Episode 2: Natural Capital Accounting in Africa',
        description: 'Peter Katanisa discusses integrating environmental accounts into national economic planning across 48 African countries.',
        date: 'Recent Episode',
        tag: 'Policy Webinar',
      },
      {
        title: 'Episode 3: Unlocking Climate Adaptation Finance for Infrastructure',
        description: 'A deep dive into preparing bankable proposals for regional flood and drought resilience.',
        date: 'Recent Episode',
        tag: 'Expert Roundtable',
      },
    ],
  },
  {
    id: 'publications',
    title: 'Publications',
    tagline: 'Research publications, policy briefs, and technical guidance developed by Climate Concern and research partners.',
    icon: '📚',
    items: [
      {
        title: 'Standardized Crediting Framework for East African Carbon Projects',
        description: 'Technical policy analysis of simplified carbon crediting mechanisms for distributed clean energy and agroforestry.',
        date: 'Technical Paper',
        tag: 'Research Publication',
      },
      {
        title: 'EAC Regional Vulnerability and Sectoral Adaptation Priorities',
        description: 'Assessment of climate impacts on agriculture, housing, and infrastructure across landlocked EAC nations.',
        date: 'Policy Brief',
        tag: 'Climate Assessment',
      },
      {
        title: 'Best Practices for Social & Environmental Impact Assessments in Rwanda',
        description: 'Practical guide to aligning national REMA guidelines with international ESG safeguards.',
        date: 'Guidelines',
        tag: 'Practical Manual',
      },
    ],
  },
  {
    id: 'updates',
    title: 'Updates',
    tagline: 'Links to Climate Change events, global negotiations, and Climate Concern news.',
    icon: '📰',
    items: [
      {
        title: 'COP Negotiations & African Carbon Market Outcomes',
        description: 'Key insights and operational takeaways from recent UN Climate Change Conferences relevant to East Africa.',
        date: 'Global Update',
        tag: 'Event Coverage',
      },
      {
        title: 'Climate Concern Expands EAC Advisory Desk',
        description: 'New technical support initiatives launched for cross-border feasibility studies in Uganda, Tanzania, and Kenya.',
        date: 'Company News',
        tag: 'Press Release',
      },
      {
        title: 'Upcoming Training Cohorts for 2025–2026',
        description: 'Registration opens for Certified Carbon Market and Climate Adaptation Finance course cycles.',
        date: 'Announcement',
        tag: 'Training Schedule',
      },
    ],
  },
];

export const contactHandles = {
  phone: '(250) 0788 481439',
  phoneClean: '+250788481439',
  email: 'info@climateconcern.rw',
  physicalAddress: 'Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda',
  x: '@ClimateConcern',
  xUrl: 'https://x.com/ClimateConcern',
  linkedin: '@ClimateConcern',
  linkedinUrl: 'https://linkedin.com/company/climateconcern',
  ig: '@ClimateConcern',
  igUrl: 'https://instagram.com/ClimateConcern',
};

export const legalContent = {
  terms: {
    title: 'Terms and Conditions',
    intro:
      'Welcome to www.climateconcern.rw (“Website”). By accessing or using this Website, you agree to comply with and be bound by the following Terms and Conditions (“Terms”). If you do not agree to these Terms, please do not use this Website.',
    useOfWebsite: [
      'Use the Website for lawful and non-commercial purposes only.',
      'Not engage in any activity that could harm, disrupt, or interfere with the Website or its users.',
      'Not attempt to gain unauthorized access to any part of the Website or its systems.',
    ],
    intellectualProperty:
      'All content on this Website, including but not limited to text, graphics, logos, images, videos, and design, is the property of Climate Concern or its content providers and is protected by copyright and intellectual property laws.\n\nYou may:\n• View, download, or print content for personal, non-commercial use only.\n• Not copy, reproduce, modify, or distribute content without prior written permission.',
    userSubmissions:
      'If you submit any content to the Website (e.g., comments, articles, photos):\n• You grant Climate Concern Rwanda a non-exclusive, royalty-free, worldwide license to use, display, and distribute your submission.\n• You confirm that your submission does not violate the rights of any third party.\n• We reserve the right to moderate, remove, or refuse any user submissions at our discretion.',
    disclaimer:
      'The information provided on this Website is for general informational purposes only. While we strive for accuracy, we make no warranties regarding the completeness, reliability, or suitability of the content. Climate Concern is not liable for any loss or damage resulting from your reliance on the information on this Website.',
    limitationOfLiability:
      'To the fullest extent permitted by law, Climate Concern shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Website.',
    modifications:
      'We reserve the right to change or update these Terms at any time. Changes will be effective immediately upon posting on the Website. Your continued use of the Website constitutes acceptance of the revised Terms.',
    governingLaw:
      'These Terms shall be governed by and construed in accordance with the laws of Rwanda. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.',
    contact:
      'Email: info@climateconcern.rw | Physical Address: Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda',
  },
  privacy: {
    title: 'Privacy Policy',
    effectiveDate: '1st July 2025',
    lastUpdated: '30th June 2030',
    intro:
      'Climate Concern ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard the information you provide when you visit www.climateconcern.rw ("Website").',
    sections: [
      {
        num: '1',
        title: 'Information We Collect',
        content: `We may collect the following types of information:\n\na) Personal Information: You may voluntarily provide us with personal information such as Name, Email address, Organization or affiliation, Phone number (if applicable), and any other information you provide via contact forms, email, or event registrations.\n\nb) Non-Personal Information: We may also collect non-personal information automatically through cookies and analytics tools, including IP address, Browser type, Pages visited and time spent, Referring websites, Device and operating system information.`,
      },
      {
        num: '2',
        title: 'How We Use Your Information',
        content: `We use the collected information to:\n• Respond to your inquiries or messages\n• Send newsletters or updates (with your consent)\n• Improve website content and user experience\n• Analyze usage trends and optimize website performance\n• Promote climate change awareness, events, and initiatives`,
      },
      {
        num: '3',
        title: 'Cookies and Tracking Technologies',
        content: `Our Website uses cookies to enhance user experience, understand website traffic patterns, and remember preferences (e.g., language or location settings). You can adjust your browser settings to disable cookies, though some parts of the Website may not function properly as a result.`,
      },
      {
        num: '4',
        title: 'Information Sharing and Disclosure',
        content: `We do not sell, rent, or trade your personal information unless you paid for subscription and consented to include your CV and/or resume in Climate Concern pool of consultant.\n\nWe may share your information only:\n• With trusted service providers who assist in operating our Website (under confidentiality agreements)\n• When required by law, regulation, or legal process\n• To protect the rights, property, or safety of Climate Concern, our users, or the public`,
      },
      {
        num: '5',
        title: 'Data Security',
        content: `We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
      },
      {
        num: '6',
        title: 'Your Rights and Choices',
        content: `Depending on your location and applicable laws, you may have the right to access, correct, update, or request deletion of your personal data, or withdraw consent to receive communications. To exercise any of these rights, please contact us at info@climateconcern.rw.`,
      },
      {
        num: '7',
        title: 'Data Retention, Children’s Privacy & Links',
        content: `• Third-Party Links: Our Website may contain links to external websites. We are not responsible for the privacy practices or content of third-party websites.\n• Children's Privacy: Our Website is not intended for children under the age of 13. We do not knowingly collect personal information from children.\n• Data Retention: We retain personal information only for as long as necessary to fulfill the purposes described in this policy or as required by law.`,
      },
    ],
    contact:
      'Email: info@climateconcern.rw | Physical Address: Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda',
  },
};
