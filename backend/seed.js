// backend/seed.js
// Run: node seed.js (from backend/ directory)
// Seeds all tables with content from static data

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Climate Concern database...\n');

  // ── 1. TEAM MEMBERS ──────────────────────────────────────────
  console.log('👥 Seeding team members...');
  const teamData = [
    {
      name: 'Jean NTAZINDA',
      role: 'Founder',
      isFounder: true,
      initials: 'JN',
      image: '/images/jean.jpg',
      bio: `With over fifteen years of experience in the carbon market and climate finance, Mr. NTAZINDA has played a key role in designing numerous emission reduction projects for both compliant and voluntary markets, which have generated millions of CERs and VERs. His expertise also extends to supporting the Rwanda National Country Programme and Framework for National Engagement with the Green Climate Fund. Furthermore, he contributed to the development of the Standardized Crediting Framework, piloted by Ci-Dev, for the implementation of Article 6 of the Paris Agreement in Rwanda and other African nations.\n\nBefore establishing Climate Concern in 2012, Mr. NTAZINDA was instrumental in setting up the Designated National Authority (DNA) Secretariat for the carbon market during his time at the Rwanda Environment Management Authority (REMA).\n\nMr. NTAZINDA's academic and professional journey has consistently focused on GHG mitigation and adaptation to the effects of climate change. He is currently engaged in several consulting assignments at the national and African regional levels, supporting the implementation of Article 6 of the Paris Agreement and the design of emission reduction projects. He holds a BSc in Geography with a focus on Environmental Planning from the University of Rwanda and a MSc in International Development Administration with a specialization in Climate Change Resilience and Risk Management from Andrews University in Michigan, USA.`,
      education: JSON.stringify([
        'MSc in International Development Administration (Climate Resilience & Risk Mgmt) — Andrews University, Michigan, USA',
        'BSc in Geography (Environmental Planning) — University of Rwanda',
      ]),
      keyAreas: JSON.stringify([
        'Article 6 of the Paris Agreement',
        'Green Climate Fund (GCF) Frameworks',
        'CER & VER Carbon Credits Origination',
        'Standardized Crediting Framework (SCF)',
      ]),
      order: 0,
    },
    {
      name: 'UMUGISHA Dieudonné',
      role: 'Managing Consultant',
      isFounder: false,
      initials: 'UD',
      image: '/images/dieudonne.jpg',
      bio: 'Oversees organizational strategy, project operations, and coordination across Climate Concern consulting assignments in Rwanda and the East African Community.',
      education: JSON.stringify([]),
      keyAreas: JSON.stringify(['Consulting Operations', 'Multi-stakeholder Coordination', 'Project Delivery']),
      order: 1,
    },
    {
      name: 'BAMUSIIME Alice',
      role: 'Lead Consultant, Gender & Environmental Safeguards',
      isFounder: false,
      initials: 'BA',
      image: '/images/alice.jpg',
      bio: 'Leads gender integration, social inclusion, and environmental safeguards frameworks to ensure climate and development interventions adhere to international standards.',
      education: JSON.stringify([]),
      keyAreas: JSON.stringify(['Gender Equality in Climate Action', 'Environmental & Social Safeguards', 'Community Engagement']),
      order: 2,
    },
    {
      name: 'Peter KATANISA',
      role: 'Lead Consultant, Circular Economy and Natural Resources Management and Climate Policy',
      isFounder: false,
      initials: 'PK',
      image: '/images/peter.jpg',
      bio: `Peter Katanisa is a seasoned development professional with over 15 years of experience in environment natural resources management (NRM) and climate change policy, natural capital accounting, conservation, tourism development, and project management. With a strong academic background including a postgraduate diploma in Project Management (with distinction) and a Bachelor's degree in Economics, Peter combines technical expertise with strategic leadership across a wide spectrum of sustainability initiatives.\n\nHe currently serves as the Coordinator of the Africa Natural Capital Accounting Community of Practice (NCA-CoP), hosted by the World Bank's Global Program on Sustainability (GPS). His work spans 48 African countries, fostering policy integration of environmental-economic accounts into development planning. Peter also consults as a Senior Policy Specialist on climate and environment for World Bank-supported initiatives in Rwanda, including the Climate and Nature Finance Strategy and Green Finance & Investment programs.\n\nPreviously, he led Rwanda's contributions to the NDC Partnership as Co-Chair Coordinator and represented the country at major UN Climate Change Conferences (COP27–29). His professional history includes advisory roles at the Ministry of Environment and the Ministry of Natural Resources in Rwanda, national coordination of the WAVES/NCA program, and senior leadership in tourism product development with the Rwanda Development Board.\n\nPeter is fluent in English and Kinyarwanda, with working knowledge of French and Swahili, and is highly regarded for his integrity, strategic coordination, stakeholder engagement, and results-driven project execution.`,
      education: JSON.stringify([
        'Postgraduate Diploma in Project Management (with distinction)',
        "Bachelor's degree in Economics",
      ]),
      keyAreas: JSON.stringify([
        'Natural Capital Accounting (NCA)',
        'Circular Economy Strategy',
        'NDC Partnership Coordination (COP27–COP29)',
        'World Bank Climate & Nature Finance Initiatives',
      ]),
      order: 3,
    },
    {
      name: 'Dominique KAYIGIRE',
      role: 'Lead Consultant, Environmental Compliance',
      isFounder: false,
      initials: 'DK',
      image: null,
      bio: 'Specializes in regulatory environmental audits, national environmental standards compliance, and environmental management systems across East African industries.',
      education: JSON.stringify([]),
      keyAreas: JSON.stringify(['Environmental Compliance Audits', 'REMA Regulations', 'Environmental Management Systems']),
      order: 4,
    },
    {
      name: 'Omer ELAWAD',
      role: 'Lead Consultant, Carbon Market',
      isFounder: false,
      initials: 'OE',
      image: '/images/Omer.jpeg',
      bio: 'Senior carbon market specialist advising on voluntary and compliance market mechanisms, project design documentation, and carbon crediting methodologies.',
      education: JSON.stringify([]),
      keyAreas: JSON.stringify(['Carbon Market Structuring', 'Emission Reduction Methodologies', 'Article 6 Crediting']),
      order: 5,
    },
  ];

  for (const member of teamData) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO team_members (id, name, role, "isFounder", initials, image, bio, education, "keyAreas", "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      member.name, member.role, member.isFounder, member.initials,
      member.image, member.bio, member.education, member.keyAreas, member.order
    );
  }
  console.log(`  ✓ ${teamData.length} team members seeded`);

  // ── 2. SERVICES ──────────────────────────────────────────────
  console.log('🔧 Seeding services...');
  const servicesData = [
    {
      serviceId: 'climate-finance',
      icon: '💰',
      tabLabel: 'Climate Finance',
      headline: 'Climate Finance Proposal Design',
      shortSummary: 'Designing bankable green finance proposals aligned with international funds such as the Green Climate Fund (GCF) and bilateral instruments.',
      deliverables: JSON.stringify([
        'National Country Programme & GCF engagement frameworks',
        'Concessional finance and blended finance proposal design',
        'Feasibility studies and climate rationale development',
        'Investment prioritization and co-financing structuring',
      ]),
      subAreas: JSON.stringify([]),
      cta: 'Request a Proposal',
      ctaLink: '/get-in-touch',
      color: '#00652c',
      order: 0,
    },
    {
      serviceId: 'carbon-market',
      icon: '🌱',
      tabLabel: 'Carbon Market',
      headline: 'Carbon Market Projects Design (From Origination to Issuance)',
      shortSummary: 'End-to-end carbon project origination, methodology alignment, baseline setting, PDD development, and issuance of CERs and VERs.',
      deliverables: JSON.stringify([
        'Article 6 of the Paris Agreement implementation support',
        'Standardized Crediting Framework (SCF) application',
        'Project Design Document (PDD) preparation',
        'Validation, verification, and credit issuance management',
      ]),
      subAreas: JSON.stringify([]),
      cta: 'Start a Carbon Project',
      ctaLink: '/get-in-touch',
      color: '#00a859',
      order: 1,
    },
    {
      serviceId: 'stakeholder-engagement',
      icon: '🤝',
      tabLabel: 'Stakeholder Engagement',
      headline: 'Stakeholder Engagement',
      shortSummary: 'Structured public participation, free prior and informed consent, institutional consensus building, and community consultation frameworks.',
      deliverables: JSON.stringify([
        'Participatory rural appraisals and community workshops',
        'Government ministry and development partner dialogues',
        'Grievance redress mechanism (GRM) design',
        'Multi-stakeholder roadmaps and governance frameworks',
      ]),
      subAreas: JSON.stringify([]),
      cta: 'Engage with Us',
      ctaLink: '/get-in-touch',
      color: '#007a40',
      order: 2,
    },
    {
      serviceId: 'strategic-eia',
      icon: '📐',
      tabLabel: 'Strategic EIA',
      headline: 'Strategic Environmental Impact Assessment',
      shortSummary: 'High-level strategic assessments integrating environmental, climate risk, and sustainability dimensions into policies, plans, and regional programs.',
      deliverables: JSON.stringify([
        'Sector-wide strategic environmental reviews',
        'Policy and legislative compliance alignment',
        'Cumulative environmental impact modeling',
        'Green growth integration for national programs',
      ]),
      subAreas: JSON.stringify([]),
      cta: 'Request an Assessment',
      ctaLink: '/get-in-touch',
      color: '#005c29',
      order: 3,
    },
    {
      serviceId: 'social-environmental-ia',
      icon: '🛡️',
      tabLabel: 'Social & Environmental IA',
      headline: 'Social and Environmental Impact Assessment',
      shortSummary: 'Comprehensive project-level environmental and social impact assessments ensuring strict regulatory compliance and safeguard verification.',
      deliverables: JSON.stringify([
        'REMA compliance and statutory permitting audits',
        'Environmental and Social Management Plans (ESMP)',
        'Biodiversity and watershed baseline evaluations',
        'Resettlement and livelihood restoration advisory',
      ]),
      subAreas: JSON.stringify([]),
      cta: 'Get an Assessment',
      ctaLink: '/get-in-touch',
      color: '#004d22',
      order: 4,
    },
  ];

  for (const svc of servicesData) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO services (id, "serviceId", icon, "tabLabel", headline, "shortSummary", deliverables, "subAreas", cta, "ctaLink", color, "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, NOW(), NOW())
       ON CONFLICT ("serviceId") DO NOTHING`,
      svc.serviceId, svc.icon, svc.tabLabel, svc.headline,
      svc.shortSummary, svc.deliverables, svc.subAreas,
      svc.cta, svc.ctaLink, svc.color, svc.order
    );
  }
  console.log(`  ✓ ${servicesData.length} services seeded`);

  // ── 3. TRAINING COURSES ───────────────────────────────────────
  console.log('🎓 Seeding training courses...');
  const courses = [
    {
      courseId: 'carbon-market-courses',
      title: 'Certified Carbon Market Courses',
      subtitle: 'From Fundamentals to Article 6 & Verified Credit Issuance',
      badge: 'Certified Professional Course',
      overview: 'Climate Concern training program is all you need to become an expert in Carbon Market and climate finance. Our courses are designed and taught by world-class experienced professionals.',
      modules: JSON.stringify([]),
      phase1Price: 50,
      phase2Price: 50,
      phase1Title: 'Phase 1: Self-Paced Online Learning',
      phase1Desc: 'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.',
      phase2Title: 'Phase 2: Interactive Expert Support & Hands-On Practice',
      phase2Desc: 'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.',
      order: 0,
    },
    {
      courseId: 'climate-adaptation-courses',
      title: 'Certified Climate Adaptation Finance Courses',
      subtitle: 'Designing Bankable Projects for Sovereign & Regional Adaptation',
      badge: 'Executive Certification',
      overview: 'Climate Concern training program is all you need to become an expert in Carbon Market and climate finance. Our courses are designed and taught by world-class experienced professionals.',
      modules: JSON.stringify([]),
      phase1Price: 50,
      phase2Price: 50,
      phase1Title: 'Phase 1: Self-Paced Online Learning',
      phase1Desc: 'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.',
      phase2Title: 'Phase 2: Interactive Expert Support & Hands-On Practice',
      phase2Desc: 'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.',
      order: 1,
    },
  ];

  for (const c of courses) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO training_courses (id, "courseId", title, subtitle, badge, overview, modules, "phase1Price", "phase2Price", "phase1Title", "phase1Desc", "phase2Title", "phase2Desc", "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
       ON CONFLICT ("courseId") DO NOTHING`,
      c.courseId, c.title, c.subtitle, c.badge, c.overview, c.modules,
      c.phase1Price, c.phase2Price, c.phase1Title, c.phase1Desc,
      c.phase2Title, c.phase2Desc, c.order
    );
  }
  console.log(`  ✓ ${courses.length} training courses seeded`);

  // ── 4. STATS ─────────────────────────────────────────────────
  console.log('📊 Seeding stats...');
  const stats = [
    { statId: 'verified-projects', label: 'Verified Projects', value: '11', unit: '+', tag: 'Impact', order: 0 },
    { statId: 'impacted-people', label: 'Impacted People', value: '11M', unit: '', tag: 'Reach', order: 1 },
    { statId: 'priority-sectors', label: 'Key Priority Sectors', value: '5', unit: '+', tag: 'Sectors', order: 2 },
    { statId: 'eac-countries', label: 'EAC Countries', value: '6', unit: '', tag: 'Regional', order: 3 },
  ];
  for (const s of stats) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO stats (id, "statId", label, value, unit, tag, "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW())
       ON CONFLICT ("statId") DO NOTHING`,
      s.statId, s.label, s.value, s.unit, s.tag, s.order
    );
  }
  console.log(`  ✓ ${stats.length} stats seeded`);

  // ── 5. CONTACT INFO ───────────────────────────────────────────
  console.log('📞 Seeding contact info...');
  await prisma.$executeRawUnsafe(
    `INSERT INTO contact_info (id, phone, "phoneClean", email, "physicalAddress", "xHandle", "xUrl", "linkedinHandle", "linkedinUrl", "igHandle", "igUrl", "updatedAt")
     VALUES ('singleton', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
     ON CONFLICT (id) DO NOTHING`,
    '(250) 0788 481439',
    '+250788481439',
    'info@climateconcern.rw',
    'Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda',
    '@ClimateConcern',
    'https://x.com/ClimateConcern',
    '@ClimateConcern',
    'https://linkedin.com/company/climateconcern',
    '@ClimateConcern',
    'https://instagram.com/ClimateConcern'
  );
  console.log('  ✓ Contact info seeded');

  // ── 6. FAQs ───────────────────────────────────────────────────
  console.log('❓ Seeding FAQs...');
  const faqs = [
    {
      question: 'What is Climate Concern Rwanda?',
      answer: 'Climate Concern is a consulting company established in 2012 and based in Kigali, Rwanda. We provide expert services in environment and climate change including carbon market project design, climate finance proposals, stakeholder engagement, and environmental impact assessments.',
      order: 0,
    },
    {
      question: 'What is the training program and who is it for?',
      answer: 'Our training program offers certified courses in Carbon Market and Climate Adaptation Finance. It is designed for professionals, government officials, and individuals who want to build expertise in carbon markets, Article 6 of the Paris Agreement, and climate finance. The program is taught by world-class experienced professionals.',
      order: 1,
    },
    {
      question: 'How much does the training cost?',
      answer: 'Each training course has two phases, both priced at $50 USD each (approximately 73,750 RWF at current exchange rates). Phase 1 is self-paced online learning, and Phase 2 is optional hands-on interactive support in Rwanda. You must complete Phase 1 before enrolling in Phase 2.',
      order: 2,
    },
    {
      question: 'Do I get a certificate after completing the training?',
      answer: 'Yes! Upon completing Phase 1 (Self-Paced Online Learning), you receive an official Certificate of Completion. Phase 2 is optional but provides additional hands-on practice and mentoring from climate finance specialists.',
      order: 3,
    },
    {
      question: 'What areas does Climate Concern operate in?',
      answer: 'While our primary operations are in Rwanda, we also extend our expertise across the East African Community (EAC) region, which includes Rwanda, Burundi, Uganda, Tanzania, Kenya, and South Sudan.',
      order: 4,
    },
    {
      question: 'How can I apply for a training course?',
      answer: 'You can apply directly through our Training Program page on this website. Click "Apply Now" on any course, fill in your details, select your training phase, upload your proof of payment, and submit. Our team will review your application and get back to you.',
      order: 5,
    },
    {
      question: 'How can I request a consultation or consulting service?',
      answer: 'You can request a consultation through our Get In Touch / Consultation Request page. Fill in your project details, required expertise, and timeline. Our team will review your request and contact you to discuss further.',
      order: 6,
    },
  ];
  for (const faq of faqs) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO faqs (id, question, answer, "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, NOW(), NOW())`,
      faq.question, faq.answer, faq.order
    );
  }
  console.log(`  ✓ ${faqs.length} FAQs seeded`);

  // ── 7. LIBRARY ────────────────────────────────────────────────
  console.log('📚 Seeding library...');
  const libraryCategories = [
    {
      catId: 'podcast',
      title: 'Podcasts (Free Videos)',
      tagline: 'Expert video conversations, webinars, and field discussions with carbon and climate finance specialists.',
      icon: '🎙️',
      order: 0,
      items: [
        { title: 'Episode 1: Navigating Article 6 of the Paris Agreement in Rwanda', description: 'Founder Jean Ntazinda breaks down how Article 6 works, bilateral carbon trades, and what it means for East Africa.', date: 'Recent Episode', tag: 'Video Discussion', order: 0 },
        { title: 'Episode 2: Natural Capital Accounting in Africa', description: 'Peter Katanisa discusses integrating environmental accounts into national economic planning across 48 African countries.', date: 'Recent Episode', tag: 'Policy Webinar', order: 1 },
        { title: 'Episode 3: Unlocking Climate Adaptation Finance for Infrastructure', description: 'A deep dive into preparing bankable proposals for regional flood and drought resilience.', date: 'Recent Episode', tag: 'Expert Roundtable', order: 2 },
      ],
    },
    {
      catId: 'publications',
      title: 'Publications',
      tagline: 'Research publications, policy briefs, and technical guidance developed by Climate Concern and research partners.',
      icon: '📚',
      order: 1,
      items: [
        { title: 'Standardized Crediting Framework for East African Carbon Projects', description: 'Technical policy analysis of simplified carbon crediting mechanisms for distributed clean energy and agroforestry.', date: 'Technical Paper', tag: 'Research Publication', order: 0 },
        { title: 'EAC Regional Vulnerability and Sectoral Adaptation Priorities', description: 'Assessment of climate impacts on agriculture, housing, and infrastructure across landlocked EAC nations.', date: 'Policy Brief', tag: 'Climate Assessment', order: 1 },
        { title: 'Best Practices for Social & Environmental Impact Assessments in Rwanda', description: 'Practical guide to aligning national REMA guidelines with international ESG safeguards.', date: 'Guidelines', tag: 'Practical Manual', order: 2 },
      ],
    },
    {
      catId: 'updates',
      title: 'Updates',
      tagline: 'Links to Climate Change events, global negotiations, and Climate Concern news.',
      icon: '📰',
      order: 2,
      items: [
        { title: 'COP Negotiations & African Carbon Market Outcomes', description: 'Key insights and operational takeaways from recent UN Climate Change Conferences relevant to East Africa.', date: 'Global Update', tag: 'Event Coverage', order: 0 },
        { title: 'Climate Concern Expands EAC Advisory Desk', description: 'New technical support initiatives launched for cross-border feasibility studies in Uganda, Tanzania, and Kenya.', date: 'Company News', tag: 'Press Release', order: 1 },
        { title: 'Upcoming Training Cohorts for 2025–2026', description: 'Registration opens for Certified Carbon Market and Climate Adaptation Finance course cycles.', date: 'Announcement', tag: 'Training Schedule', order: 2 },
      ],
    },
  ];

  for (const cat of libraryCategories) {
    const result = await prisma.$queryRawUnsafe(
      `INSERT INTO library_categories (id, "catId", title, tagline, icon, "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("catId") DO NOTHING
       RETURNING id`,
      cat.catId, cat.title, cat.tagline, cat.icon, cat.order
    );
    const catId = result[0]?.id;
    if (!catId) {
      // Already exists — get the id
      const existing = await prisma.$queryRawUnsafe(
        `SELECT id FROM library_categories WHERE "catId" = $1`, cat.catId
      );
      if (!existing[0]) continue;
      // skip items if already seeded
      continue;
    }
    for (const item of cat.items) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO library_items (id, "categoryId", title, description, date, tag, "order", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        catId, item.title, item.description, item.date, item.tag, item.order
      );
    }
  }
  console.log(`  ✓ Library categories and items seeded`);

  // ── 8. LEGAL CONTENT ─────────────────────────────────────────
  console.log('⚖️  Seeding legal content...');
  await prisma.$executeRawUnsafe(
    `INSERT INTO legal_content (id, type, title, content, "updatedAt")
     VALUES (gen_random_uuid()::text, 'terms', 'Terms and Conditions',
     'Welcome to www.climateconcern.rw ("Website"). By accessing or using this Website, you agree to comply with and be bound by the following Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use this Website.',
     NOW()) ON CONFLICT (type) DO NOTHING`
  );
  await prisma.$executeRawUnsafe(
    `INSERT INTO legal_content (id, type, title, content, "updatedAt")
     VALUES (gen_random_uuid()::text, 'privacy', 'Privacy Policy',
     'Climate Concern ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard the information you provide when you visit www.climateconcern.rw ("Website").',
     NOW()) ON CONFLICT (type) DO NOTHING`
  );
  console.log('  ✓ Legal content seeded');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
