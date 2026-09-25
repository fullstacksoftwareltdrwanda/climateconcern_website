import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FULL_PERMISSIONS = {
  team:                { view: true, edit: true, delete: true },
  services:            { view: true, edit: true, delete: true },
  training:            { view: true, edit: true, delete: true },
  faqs:                { view: true, edit: true, delete: true },
  stats:               { view: true, edit: true, delete: true },
  contact:             { view: true, edit: true, delete: true },
  legal:               { view: true, edit: true, delete: true },
  library:             { view: true, edit: true, delete: true },
  applications:        { view: true, edit: true, delete: true },
  consultant_requests: { view: true, edit: true, delete: true },
  admins:              { view: true, edit: true, delete: true },
};

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Main Admin ───────────────────────────────────────────
  const existingAdmin = await prisma.admin.findUnique({ where: { email: 'admin@climateconcern.rw' } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('ChangeMe123!', 12);
    await prisma.admin.create({
      data: {
        name: 'Main Admin',
        email: 'admin@climateconcern.rw',
        passwordHash: hash,
        isMainAdmin: true,
        isActive: true,
        permissions: FULL_PERMISSIONS,
      },
    });
    console.log('✅ Main admin created: admin@climateconcern.rw / ChangeMe123!');
  } else {
    console.log('⏭️  Main admin already exists, skipping.');
  }

  // ─── Team Members ────────────────────────────────────────
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'Jean NTAZINDA',
          role: 'Founder',
          isFounder: true,
          initials: 'JN',
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
          order: 0,
        },
        {
          name: 'UMUGISHA Dieudonné',
          role: 'Managing Consultant',
          isFounder: false,
          initials: 'UD',
          bio: 'Oversees organizational strategy, project operations, and coordination across Climate Concern consulting assignments in Rwanda and the East African Community.',
          education: [],
          keyAreas: ['Consulting Operations', 'Multi-stakeholder Coordination', 'Project Delivery'],
          order: 1,
        },
        {
          name: 'BAMUSIIME Alice',
          role: 'Lead Consultant, Gender & Environmental Safeguards',
          isFounder: false,
          initials: 'BA',
          bio: 'Leads gender integration, social inclusion, and environmental safeguards frameworks to ensure climate and development interventions adhere to international standards.',
          education: [],
          keyAreas: ['Gender Equality in Climate Action', 'Environmental & Social Safeguards', 'Community Engagement'],
          order: 2,
        },
        {
          name: 'Peter KATANISA',
          role: 'Lead Consultant, Circular Economy and Natural Resources Management and Climate Policy',
          isFounder: false,
          initials: 'PK',
          bio: `Peter Katanisa is a seasoned development professional with over 15 years of experience in environment natural resources management (NRM) and climate change policy, natural capital accounting, conservation, tourism development, and project management. With a strong academic background including a postgraduate diploma in Project Management (with distinction) and a Bachelor's degree in Economics, Peter combines technical expertise with strategic leadership across a wide spectrum of sustainability initiatives.`,
          education: [
            'Postgraduate Diploma in Project Management (with distinction)',
            'Bachelor\'s degree in Economics',
          ],
          keyAreas: [
            'Natural Capital Accounting (NCA)',
            'Circular Economy Strategy',
            'NDC Partnership Coordination (COP27–COP29)',
            'World Bank Climate & Nature Finance Initiatives',
          ],
          order: 3,
        },
        {
          name: 'Dominique KAYIGIRE',
          role: 'Lead Consultant, Environmental Compliance',
          isFounder: false,
          initials: 'DK',
          bio: 'Specializes in regulatory environmental audits, national environmental standards compliance, and environmental management systems across East African industries.',
          education: [],
          keyAreas: ['Environmental Compliance Audits', 'REMA Regulations', 'Environmental Management Systems'],
          order: 4,
        },
        {
          name: 'Omer ELAWAD',
          role: 'Lead Consultant, Carbon Market',
          isFounder: false,
          initials: 'OE',
          bio: 'Senior carbon market specialist advising on voluntary and compliance market mechanisms, project design documentation, and carbon crediting methodologies.',
          education: [],
          keyAreas: ['Carbon Market Structuring', 'Emission Reduction Methodologies', 'Article 6 Crediting'],
          order: 5,
        },
      ],
    });
    console.log('✅ Team members seeded');
  }

  // ─── Services ────────────────────────────────────────────
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          serviceId: 'advisory',
          icon: '🌿',
          tabLabel: 'Advisory',
          headline: 'Advisory Services',
          shortSummary: 'Expert guidance on environmental protection and climate change finance — helping governments, businesses, and communities make the right decisions.',
          deliverables: [
            'National and district environmental action plans',
            'Green finance proposals and investment strategies',
            'Climate risk assessments and compliance reviews',
            'Bilateral partnership frameworks for green projects',
          ],
          subAreas: [
            { title: 'Environmental Protection', description: 'We help organizations understand, manage, and reduce their environmental impact through practical assessments, policy guidance, and compliance reviews.' },
            { title: 'Climate Change Finance', description: 'We design climate finance proposals and green investment strategies that unlock funding from international and regional climate funds.' },
          ],
          cta: 'Get Advisory Support',
          ctaLink: '/meet-us',
          color: 'green',
          order: 0,
        },
        {
          serviceId: 'project-design',
          icon: '📐',
          tabLabel: 'Project Design',
          headline: 'Project Design',
          shortSummary: 'End-to-end design of environmental and climate projects — from concept to certified, field-ready implementation plans.',
          deliverables: [
            'Project feasibility and baseline assessments',
            'Full Project Design Documents (PDD)',
            'Third-party audit preparation and certification support',
            'Field monitoring, measurement, and reporting plans',
          ],
          subAreas: [],
          cta: 'Start a Project',
          ctaLink: '/meet-us',
          color: 'black',
          order: 1,
        },
        {
          serviceId: 'training',
          icon: '🎓',
          tabLabel: 'Training',
          headline: 'Training Programs',
          shortSummary: 'Hybrid professional training — self-paced online learning combined with optional in-person practicum for hands-on certification.',
          deliverables: [
            'Self-paced online sessions (Intro, Discussion, Test)',
            'Certification upon passing the final test',
            'Optional in-person practicum for field skills',
            'Designed for environmental officers, finance teams, and project managers',
          ],
          subAreas: [],
          cta: 'Enroll Now',
          ctaLink: '/training',
          color: 'green',
          order: 2,
        },
      ],
    });
    console.log('✅ Services seeded');
  }

  // ─── Training Courses ────────────────────────────────────
  const trainingCount = await prisma.trainingCourse.count();
  if (trainingCount === 0) {
    await prisma.trainingCourse.createMany({
      data: [
        {
          courseId: 'carbon-market-courses',
          title: 'Certified Carbon Market Courses',
          subtitle: 'From Fundamentals to Article 6 & Verified Credit Issuance',
          badge: 'Certified Professional Course',
          overview: '',
          modules: [],
          order: 0,
        },
        {
          courseId: 'climate-adaptation-courses',
          title: 'Certified Climate Adaptation Finance Courses',
          subtitle: 'Designing Bankable Projects for Sovereign & Regional Adaptation',
          badge: 'Executive Certification',
          overview: '',
          modules: [],
          order: 1,
        },
      ],
    });
    console.log('✅ Training courses seeded');
  }

  // ─── FAQs ─────────────────────────────────────────────────
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        { question: 'How quickly will your team respond to my inquiry?', answer: 'We reply to all inquiries within 24 working hours. If you need urgent assistance, you can also call our office directly at (+250) 0788481439 or message us on WhatsApp.', order: 0 },
        { question: 'Who are your typical clients?', answer: 'We work with a wide range of partners: government ministries and district authorities in Rwanda, international development agencies (such as UNDP and FONERWA), private companies investing in renewable energy or agriculture, and local farming cooperatives.', order: 1 },
        { question: 'Can you help us design and register a carbon credit project?', answer: 'Yes, absolutely. We support you from day one: assessing whether your land or activity qualifies, preparing required documentation, conducting field measurements, and guiding you through independent third-party audits under leading standards like Verra and Gold Standard.', order: 2 },
        { question: 'Where is your office located, and can we visit in person?', answer: 'Our main office is located along KN 3 Avenue in Kigali, Rwanda. We welcome scheduled visits from Monday through Friday between 8:30 AM and 5:00 PM. Please get in touch beforehand so we can ensure the right specialist is available to meet with you.', order: 3 },
        { question: 'Are your training courses open to international participants?', answer: 'Yes! Our lectures are conducted online and open to professionals across East Africa and beyond. For courses with field lab components in Rwanda, we provide logistics guidance and scheduling options to accommodate regional travelers.', order: 4 },
        { question: 'How does Climate Concern Rwanda ensure scientific accuracy?', answer: 'Our team includes senior environmental scientists, GIS mapping experts, and agricultural economists. Every report is grounded in verified satellite remote sensing and physical field sampling aligned with national environmental regulations.', order: 5 },
      ],
    });
    console.log('✅ FAQs seeded');
  }

  // ─── Stats ────────────────────────────────────────────────
  const statCount = await prisma.stat.count();
  if (statCount === 0) {
    await prisma.stat.createMany({
      data: [
        { statId: 'carbon', label: 'Carbon Reduced & Measured', value: '1.4M+', unit: 'Tons of CO₂', tag: 'Verified by international carbon registries', order: 0 },
        { statId: 'compliance', label: 'Policy & Regulatory Approval', value: '100%', unit: 'Compliance Rate', tag: 'Aligned with Rwanda national climate standards', order: 1 },
        { statId: 'projects', label: 'Completed Engagements', value: '50+', unit: 'Delivered Projects', tag: 'Serving businesses, farmers, and government agencies', order: 2 },
        { statId: 'districts', label: 'National Reach', value: '30', unit: 'Districts of Rwanda', tag: 'Field teams active across all provinces', order: 3 },
      ],
    });
    console.log('✅ Stats seeded');
  }

  // ─── Contact Info ─────────────────────────────────────────
  const contactCount = await prisma.contactInfo.count();
  if (contactCount === 0) {
    await prisma.contactInfo.create({
      data: {
        id: 'singleton',
        phone: '(250) 0788 481439',
        phoneClean: '+250788481439',
        email: 'info@climateconcern.rw',
        physicalAddress: 'Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda',
        xHandle: '@ClimateConcern',
        xUrl: 'https://x.com/ClimateConcern',
        linkedinHandle: '@ClimateConcern',
        linkedinUrl: 'https://linkedin.com/company/climateconcern',
        igHandle: '@ClimateConcern',
        igUrl: 'https://instagram.com/ClimateConcern',
      },
    });
    console.log('✅ Contact info seeded');
  }

  // ─── Legal Content ────────────────────────────────────────
  const legalCount = await prisma.legalContent.count();
  if (legalCount === 0) {
    await prisma.legalContent.createMany({
      data: [
        {
          type: 'terms',
          title: 'Terms and Conditions',
          content: `Welcome to www.climateconcern.rw ("Website"). By accessing or using this Website, you agree to comply with and be bound by the following Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use this Website.\n\n## Use of Website\n\n- Use the Website for lawful and non-commercial purposes only.\n- Not engage in any activity that could harm, disrupt, or interfere with the Website or its users.\n- Not attempt to gain unauthorized access to any part of the Website or its systems.\n\n## Intellectual Property\n\nAll content on this Website, including but not limited to text, graphics, logos, images, videos, and design, is the property of Climate Concern or its content providers and is protected by copyright and intellectual property laws.\n\nYou may:\n- View, download, or print content for personal, non-commercial use only.\n- Not copy, reproduce, modify, or distribute content without prior written permission.\n\n## Disclaimer\n\nThe information provided on this Website is for general informational purposes only. While we strive for accuracy, we make no warranties regarding the completeness, reliability, or suitability of the content. Climate Concern is not liable for any loss or damage resulting from your reliance on the information on this Website.\n\n## Governing Law\n\nThese Terms shall be governed by and construed in accordance with the laws of Rwanda. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.\n\nContact: info@climateconcern.rw`,
        },
        {
          type: 'privacy',
          title: 'Privacy Policy',
          content: `Climate Concern ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard the information you provide when you visit www.climateconcern.rw ("Website").\n\n**Effective Date:** 1st July 2025 | **Last Updated:** 30th June 2030\n\n## 1. Information We Collect\n\nWe may collect the following types of information:\n\n**a) Personal Information:** Name, Email address, Organization or affiliation, Phone number, and any other information you provide via contact forms, email, or event registrations.\n\n**b) Non-Personal Information:** IP address, Browser type, Pages visited and time spent, Referring websites, Device and operating system information.\n\n## 2. How We Use Your Information\n\nWe use the collected information to:\n- Respond to your inquiries or messages\n- Send newsletters or updates (with your consent)\n- Improve website content and user experience\n- Analyze usage trends and optimize website performance\n- Promote climate change awareness, events, and initiatives\n\n## 3. Cookies and Tracking Technologies\n\nOur Website uses cookies to enhance user experience and understand website traffic patterns.\n\n## 4. Information Sharing\n\nWe do not sell, rent, or trade your personal information unless you paid for a subscription and consented to include your CV in the Climate Concern pool of consultants.\n\n## 5. Data Security\n\nWe implement reasonable administrative, technical, and physical safeguards to protect your personal information.\n\n## 6. Your Rights\n\nYou may have the right to access, correct, update, or request deletion of your personal data. Contact us at info@climateconcern.rw.\n\nContact: info@climateconcern.rw`,
        },
      ],
    });
    console.log('✅ Legal content seeded');
  }

  // ─── Library ──────────────────────────────────────────────
  const libraryCount = await prisma.libraryCategory.count();
  if (libraryCount === 0) {
    const podcast = await prisma.libraryCategory.create({
      data: {
        catId: 'podcast',
        title: 'Podcasts (Free Videos)',
        tagline: 'Expert video conversations, webinars, and field discussions with carbon and climate finance specialists.',
        icon: '🎙️',
        order: 0,
        items: {
          create: [
            { title: 'Episode 1: Navigating Article 6 of the Paris Agreement in Rwanda', description: 'Founder Jean Ntazinda breaks down how Article 6 works, bilateral carbon trades, and what it means for East Africa.', date: 'Recent Episode', tag: 'Video Discussion', order: 0 },
            { title: 'Episode 2: Natural Capital Accounting in Africa', description: 'Peter Katanisa discusses integrating environmental accounts into national economic planning across 48 African countries.', date: 'Recent Episode', tag: 'Policy Webinar', order: 1 },
            { title: 'Episode 3: Unlocking Climate Adaptation Finance for Infrastructure', description: 'A deep dive into preparing bankable proposals for regional flood and drought resilience.', date: 'Recent Episode', tag: 'Expert Roundtable', order: 2 },
          ],
        },
      },
    });

    const publications = await prisma.libraryCategory.create({
      data: {
        catId: 'publications',
        title: 'Publications',
        tagline: 'Research publications, policy briefs, and technical guidance developed by Climate Concern and research partners.',
        icon: '📚',
        order: 1,
        items: {
          create: [
            { title: 'Standardized Crediting Framework for East African Carbon Projects', description: 'Technical policy analysis of simplified carbon crediting mechanisms for distributed clean energy and agroforestry.', date: 'Technical Paper', tag: 'Research Publication', order: 0 },
            { title: 'EAC Regional Vulnerability and Sectoral Adaptation Priorities', description: 'Assessment of climate impacts on agriculture, housing, and infrastructure across landlocked EAC nations.', date: 'Policy Brief', tag: 'Climate Assessment', order: 1 },
            { title: 'Best Practices for Social & Environmental Impact Assessments in Rwanda', description: 'Practical guide to aligning national REMA guidelines with international ESG safeguards.', date: 'Guidelines', tag: 'Practical Manual', order: 2 },
          ],
        },
      },
    });

    await prisma.libraryCategory.create({
      data: {
        catId: 'updates',
        title: 'Updates',
        tagline: 'Links to Climate Change events, global negotiations, and Climate Concern news.',
        icon: '📰',
        order: 2,
        items: {
          create: [
            { title: 'COP Negotiations & African Carbon Market Outcomes', description: 'Key insights and operational takeaways from recent UN Climate Change Conferences relevant to East Africa.', date: 'Global Update', tag: 'Event Coverage', order: 0 },
            { title: 'Climate Concern Expands EAC Advisory Desk', description: 'New technical support initiatives launched for cross-border feasibility studies in Uganda, Tanzania, and Kenya.', date: 'Company News', tag: 'Press Release', order: 1 },
            { title: 'Upcoming Training Cohorts for 2025–2026', description: 'Registration opens for Certified Carbon Market and Climate Adaptation Finance course cycles.', date: 'Announcement', tag: 'Training Schedule', order: 2 },
          ],
        },
      },
    });
    console.log('✅ Library seeded');
    void podcast; void publications;
  }

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
