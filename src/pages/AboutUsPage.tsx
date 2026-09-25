import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Globe2, Shield, FileText, ChevronDown, ChevronUp, ArrowRight, ChevronRight } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { aboutContent, legalContent as staticLegalContent } from '../data/bossContent';
import { api } from '../lib/api';

export const AboutUsPage: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [legalContent, setLegalContent] = useState(staticLegalContent);

  useEffect(() => {
    // Fetch live legal docs — if they exist in DB, use them for display
    Promise.all([
      api.get<any>('/legal/terms').catch(() => null),
      api.get<any>('/legal/privacy').catch(() => null),
    ]).then(([termsDoc, privacyDoc]) => {
      if (termsDoc || privacyDoc) {
        setLegalContent((prev) => ({
          ...prev,
          // Overlay DB content if it exists (used for the intro display)
          terms: { ...prev.terms, ...(termsDoc ? { intro: termsDoc.content?.split('\n')[0] || prev.terms.intro } : {}) },
          privacy: { ...prev.privacy, ...(privacyDoc ? { intro: privacyDoc.content?.split('\n')[0] || prev.privacy.intro } : {}) },
        }));
      }
    });
  }, []);

  return (
    <div className="w-full">
      {/* ── HERO SPLIT GRID ── */}
      <section className="relative text-white pt-32 pb-24 px-layout overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-hills.jpg"
            alt="Rwanda landscape"
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
                  ✦ Institutional Profile
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  About Us
                </h1>
                <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8">
                  Established in 2012 in Kigali, delivering expert consulting services in sectors relevant to environment and climate change across Rwanda and East Africa.
                </p>
              </AnimateIn>

              {/* Jump Links */}
              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#story"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all shadow-md"
                  >
                    <span>Company Story</span>
                  </a>
                  <a
                    href="#regional"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <span>EAC Regional Focus</span>
                  </a>
                  <a
                    href="#policies"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <span>Terms & Privacy</span>
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Navigator Hub / Pool for About Us */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Institutional Summary
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      Est. 2012
                    </span>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    <a
                      href="#story"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🏛️
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Consulting Practice Founded in 2012
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Based in Kigali, Republic of Rwanda
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>

                    <a
                      href="#regional"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🗺️
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            EAC Regional Mandate (6 Countries)
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Rwanda, Burundi, Uganda, Tanzania, Kenya, South Sudan
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>

                    <a
                      href="#policies"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🛡️
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Legal & Compliance Safeguards
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Full Terms of Use & Privacy Policy (2025–2030)
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">Independent Consulting</span>
                    <a
                      href="#regional"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>Why East Africa Focus ↓</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: VERBATIM COPY FROM BOSS DOCUMENT ── */}
      <section id="story" className="py-20 px-layout bg-white scroll-mt-20">
        <div className="max-w-layout mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns: Story & Regional Focus */}
            <div className="lg:col-span-7 space-y-8">
              <AnimateIn direction="up">
                <div>
                  <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                    Company Profile
                  </span>
                  <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                    Climate Concern
                  </h2>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                    {aboutContent.paragraph1}
                  </p>
                </div>
              </AnimateIn>

              <AnimateIn direction="up" delay={80}>
                <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <h3 className="font-display text-lg font-bold text-[#00652c] mb-3">
                    Our Core Business
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {aboutContent.coreBusinessIntro}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-800 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                      <span>Climate Finance Proposal Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                      <span>Carbon Market Projects Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                      <span>Stakeholder Engagement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                      <span>Strategic EIA</span>
                    </li>
                    <li className="flex items-center gap-2 sm:col-span-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                      <span>Social and Environmental Impact Assessment</span>
                    </li>
                  </ul>
                </div>
              </AnimateIn>

              <AnimateIn direction="up" delay={120}>
                <div id="regional" className="scroll-mt-24">
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe2 className="w-6 h-6 text-[#00652c]" />
                    <span>Regional Footprint (EAC)</span>
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    {aboutContent.regionalFocus}
                  </p>
                </div>
              </AnimateIn>

              <AnimateIn direction="up" delay={160}>
                <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-200">
                  <h4 className="font-display text-lg font-bold text-gray-900 mb-3">
                    Why We Focus on This Region
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {aboutContent.regionalRationale}
                  </p>
                </div>
              </AnimateIn>
            </div>

            {/* Right 5 Columns: EAC Member Highlights & Legal Accordions */}
            <div id="policies" className="lg:col-span-5 space-y-6 scroll-mt-24">
              {/* Regional Scope Card */}
              <AnimateIn direction="up" delay={100}>
                <div className="bg-[#031d12] text-white rounded-3xl p-8 border border-emerald-800/40 shadow-xl">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#00e074] block mb-2">
                    Intervention Geography
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">
                    East African Community
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                    Active operational and advisory coverage across the 6 sovereign members:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                    {['Rwanda', 'Burundi', 'Uganda', 'Tanzania', 'Kenya', 'South Sudan'].map((country) => (
                      <div
                        key={country}
                        className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2 text-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#00e074]" />
                        <span>{country}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-300">
                    <span>Est. 2012 in Kigali</span>
                    <Link to="/what-we-offer" className="hover:text-white underline flex items-center gap-1">
                      <span>View Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </AnimateIn>

              {/* Terms & Conditions Expandable Accordion */}
              <AnimateIn direction="up" delay={140}>
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-soft">
                  <button
                    onClick={() => setTermsOpen(!termsOpen)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#00652c]" />
                      <span>Terms & Conditions</span>
                    </div>
                    {termsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {termsOpen && (
                    <div className="p-6 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-3 leading-relaxed">
                      <p>{legalContent.terms.intro}</p>
                      <h5 className="font-bold text-gray-800">Use of Website</h5>
                      <ul className="list-disc pl-4 space-y-1">
                        {legalContent.terms.useOfWebsite.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                      <div className="pt-2">
                        <Link to="/terms" className="text-[#00652c] font-semibold hover:underline">
                          Read full standalone terms →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </AnimateIn>

              {/* Privacy Policy Expandable Accordion */}
              <AnimateIn direction="up" delay={180}>
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-soft">
                  <button
                    onClick={() => setPrivacyOpen(!privacyOpen)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#00652c]" />
                      <span>Privacy Policy</span>
                    </div>
                    {privacyOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {privacyOpen && (
                    <div className="p-6 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-3 leading-relaxed">
                      <p>
                        <strong>Effective Date:</strong> {legalContent.privacy.effectiveDate} | <strong>Last Updated:</strong> {legalContent.privacy.lastUpdated}
                      </p>
                      <p>{legalContent.privacy.intro}</p>
                      <div className="pt-2">
                        <Link to="/privacy" className="text-[#00652c] font-semibold hover:underline">
                          Read full standalone privacy policy →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
