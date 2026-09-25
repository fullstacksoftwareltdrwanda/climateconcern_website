import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, ArrowRight, BarChart3, Users, Briefcase, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { teamMembers as staticTeamMembers, ourRecord } from '../data/bossContent';
import { api } from '../lib/api';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  isFounder?: boolean;
  initials: string;
  image?: string;
  bio?: string;
  education?: string[];
  keyAreas?: string[];
  order?: number;
}

export const WhoWeArePage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState(staticTeamMembers);

  useEffect(() => {
    api.get<TeamMember[]>('/team')
      .then((data) => { if (data && data.length > 0) setTeamMembers(data as any); })
      .catch(() => { /* silently fall back to static data */ });
  }, []);

  return (
    <div className="w-full">
      {/* ── HERO SPLIT GRID ── */}
      <section className="relative text-white pt-32 pb-24 px-layout overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-hills.jpg"
            alt="Rwanda green hills"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/95 via-[#032415]/80 to-black/55" />
        </div>

        <div className="max-w-layout mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Jump Anchors */}
            <div className="lg:col-span-7">
              <AnimateIn direction="up">
                <span className="text-[#00e074] text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm block mb-3">
                  ✦ Our Identity & Leadership
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  Who We Are
                </h1>
                <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8">
                  A high-level team of carbon market, climate finance, and environmental safeguard leaders supporting sovereign and regional climate action.
                </p>
              </AnimateIn>

              {/* Jump Links without "Sub-menu" words */}
              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#our-team"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all shadow-md"
                  >
                    <span>Our Team & Experts</span>
                    <Users className="w-4 h-4" />
                  </a>
                  <a
                    href="#our-record"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <span>Our Track Record & Impact</span>
                    <BarChart3 className="w-4 h-4" />
                  </a>
                  <a
                    href="#terms"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <span>Terms & Conditions</span>
                    <FileText className="w-4 h-4" />
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Navigator Hub / Pool for Who We Are */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Leadership & Track Record
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      Overview
                    </span>
                  </div>

                  {/* Quick Cards inside the Hub */}
                  <div className="space-y-2.5 relative z-10">
                    <a
                      href="#our-team"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#00a859] flex items-center justify-center font-bold text-white text-xs shrink-0 border border-white/20 shadow-xs">
                          <img
                            src="/images/jean.jpg"
                            alt="Jean NTAZINDA"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Jean NTAZINDA • Founder
                          </div>
                          <div className="text-[11px] text-gray-300">
                            15+ Yrs Carbon Market & Article 6 Expert
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>

                    <a
                      href="#our-team"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#00652c] flex items-center justify-center font-bold text-white text-xs shrink-0 border border-white/20 shadow-xs">
                          <img
                            src="/images/peter.jpg"
                            alt="Peter KATANISA"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Peter KATANISA • Lead Policy
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Coordinator Africa NCA-CoP (World Bank GPS)
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>

                    <a
                      href="#our-record"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          📊
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            11 Projects • 11M People Impacted
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Energy, Housing, Infrastructure & Land Use
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">6 Core Senior Consultants</span>
                    <a
                      href="#our-team"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>View All Profiles ↓</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: OUR TEAM (NO SUB-MENU WORD) ── */}
      <section id="our-team" className="py-20 px-layout bg-white scroll-mt-20">
        <div className="max-w-layout mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-16">
              <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                Executive Leadership & Practice Leads
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Our Team: Profile Photo and Bio
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Meet our leadership and core consulting experts driving climate finance, carbon markets, policy, and safeguards across Rwanda and the EAC.
              </p>
            </div>
          </AnimateIn>

          {/* Featured Profiles: Jean NTAZINDA (Founder) & Peter KATANISA */}
          <div className="flex flex-col gap-10 mb-12">
            {teamMembers.filter(m => m.bio && m.bio.length > 200).map((member, i) => (
              <AnimateIn key={member.name} direction="up" delay={i * 80}>
                <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-soft-lg grid grid-cols-1 lg:grid-cols-12">
                  {/* Left Column: Monogram & Credentials */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-[#022415] via-[#004d21] to-[#01180e] p-8 sm:p-10 flex flex-col items-center justify-center text-center text-white relative border-b lg:border-b-0 lg:border-r border-emerald-800/40">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 shadow-2xl mb-5 flex items-center justify-center border-2 border-emerald-400/40 bg-gradient-to-br from-[#00a859] to-[#004018]">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover object-top shadow-inner"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#031d12] flex flex-col items-center justify-center">
                          <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                            {member.initials}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase mt-0.5">
                            {member.isFounder ? 'Founder' : 'Lead'}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#00a859] border-2 border-[#031d12] flex items-center justify-center text-white shadow-md">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#00e074] font-semibold text-xs sm:text-sm mb-4">
                      {member.role}
                    </p>

                    <div className="mt-2 pt-4 border-t border-emerald-800/60 w-full flex items-center justify-center gap-2 text-xs text-emerald-200">
                      <Award className="w-4 h-4 text-[#00e074] shrink-0" />
                      <span>15+ Years Track Record</span>
                    </div>
                  </div>

                  {/* Right Column: Verbatim Bio & Specializations */}
                  <div className="lg:col-span-8 p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00652c] text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                        {member.isFounder ? '✦ Founder Profile' : '✦ Senior Policy & NRM Lead'}
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                        {member.bio?.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>

                      {member.education && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Academic & Technical Qualifications:
                          </h4>
                          <ul className="space-y-1.5">
                            {member.education.map((edu) => (
                              <li key={edu} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00652c] shrink-0 mt-0.5" />
                                <span>{edu}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {member.keyAreas && (
                      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
                        {member.keyAreas.map((area) => (
                          <span
                            key={area}
                            className="px-3 py-1 rounded-full bg-emerald-50 text-[#00652c] text-xs font-medium border border-emerald-100"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Grid of Other Team Leaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.filter(m => !m.bio || m.bio.length < 200).map((member, i) => (
              <AnimateIn key={member.name} direction="up" delay={i * 80}>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gradient-to-br from-[#00652c] to-[#003816] text-white flex items-center justify-center font-display text-xl font-bold mb-4 shadow-sm border border-emerald-600/30">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        member.initials
                      )}
                    </div>
                    <h4 className="font-display text-lg font-bold text-gray-900 mb-1">
                      {member.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#00652c] mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                  {member.keyAreas && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-1.5">
                      {member.keyAreas.map((k) => (
                        <span key={k} className="text-[11px] px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: OUR RECORD (NO SUB-MENU WORD) ── */}
      <section id="our-record" className="py-20 px-layout bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-layout mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-14">
              <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                Demonstrated Field Impact
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Our Record
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                Infographics (Number of Projects, Impacted people, Sectors)
              </p>
            </div>
          </AnimateIn>

          {/* 3 Main Infographic Cards From Boss Document */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <AnimateIn direction="up" delay={0}>
              <div className="bg-[#031d12] text-white rounded-3xl p-8 sm:p-10 border border-emerald-800/40 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#00e074] block mb-2">
                    Verified Engagements
                  </span>
                  <div className="font-display text-5xl sm:text-6xl font-extrabold text-white mb-3">
                    {ourRecord.projectsCount}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Projects
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Over a decade of end-to-end design, feasibility studies, and credit issuance assignments delivered in Rwanda and the EAC.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-300">
                  <Briefcase className="w-4 h-4" />
                  <span>Verified carbon & climate finance projects</span>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="up" delay={100}>
              <div className="bg-[#00652c] text-white rounded-3xl p-8 sm:p-10 border border-emerald-600/40 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-200 block mb-2">
                    Socio-Economic Impact
                  </span>
                  <div className="font-display text-5xl sm:text-6xl font-extrabold text-white mb-3">
                    {ourRecord.impactedPeople}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Impacted People
                  </h3>
                  <p className="text-emerald-100 text-sm leading-relaxed">
                    Beneficiaries reached through climate adaptation resilience, clean energy transitions, and community forestry programs.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-emerald-700/60 flex items-center gap-2 text-xs text-emerald-200">
                  <Users className="w-4 h-4" />
                  <span>Sovereign & regional community reach</span>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="up" delay={200}>
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-soft-lg flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#00652c] block mb-2">
                    Intervention Areas
                  </span>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
                    Sectors
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Our interventions target high-need sectors vulnerable to climate variability across landlocked and agrarian communities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ourRecord.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#00652c] text-xs font-semibold border border-emerald-200"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <BarChart3 className="w-4 h-4 text-[#00652c]" />
                  <span>Energy, Housing, Infrastructure, Land Use</span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── SECTION: TERMS AND CONDITIONS (NO SUB-MENU WORD) ── */}
      <section id="terms" className="py-16 px-layout bg-gray-50 border-t border-gray-200 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn direction="up">
            <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
              Legal & Compliance Framework
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h2>
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft text-left">
              <p className="text-gray-700 text-sm leading-relaxed mb-5">
                Welcome to <strong>www.climateconcern.rw</strong> (“Website”). By accessing or using this Website, you agree to comply with and be bound by the following Terms and Conditions (“Terms”). If you do not agree to these Terms, please do not use this Website.
              </p>
              <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Governed under the laws of Rwanda.
                </span>
                <Link
                  to="/terms"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#00652c] hover:underline"
                >
                  <span>Read Full Terms and Conditions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
};
