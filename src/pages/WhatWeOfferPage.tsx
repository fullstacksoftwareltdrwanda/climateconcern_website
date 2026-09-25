import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { whatWeOffer as staticWhatWeOffer } from '../data/bossContent';
import { api } from '../lib/api';

interface Service {
  id: string;
  serviceId: string;
  icon: string;
  tabLabel: string;
  headline: string;
  shortSummary: string;
  deliverables: string[];
  cta: string;
  ctaLink: string;
  color: string;
  order: number;
}

export const WhatWeOfferPage: React.FC = () => {
  const [services, setServices] = useState<any[]>(staticWhatWeOffer);

  useEffect(() => {
    api.get<Service[]>('/services')
      .then((data) => {
        if (data && data.length > 0) {
          // Map API service shape to the shape the UI expects
          setServices(data.map((s) => ({
            id: s.serviceId,
            title: s.headline,
            shortDesc: s.shortSummary,
            icon: s.icon || '🌱',
            scope: s.deliverables,
          })));
        }
      })
      .catch(() => { /* silently fall back to static data */ });
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
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7">
              <AnimateIn direction="up">
                <span className="text-[#00e074] text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm block mb-3">
                  ✦ Core Practice Areas
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  What We Offer
                </h1>
                <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8">
                  Specialized consultancy across climate finance proposals, carbon market project origination, stakeholder consultation, and strategic environmental impact assessments.
                </p>
              </AnimateIn>

              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/get-in-touch#hire-consultant"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <span>Hire a Consultant for Your Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Practice Navigator Hub / Pool */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Select a Practice Area
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      5 Pillars
                    </span>
                  </div>

                  {/* 5 Quick Anchors to Services Below */}
                  <div className="space-y-2 relative z-10">
                    {services.map((offer, idx) => (
                      <a
                        key={offer.id}
                        href={`#${offer.id}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0">
                            {offer.icon}
                          </span>
                          <span className="font-semibold text-white group-hover/item:text-[#00e074] transition-colors line-clamp-1">
                            {idx + 1}. {offer.title}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">Bankable proposals & credits</span>
                    <Link
                      to="/get-in-touch"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>Request Expert ↓</span>
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 CORE OFFERINGS FROM BOSS DOCUMENT ── */}
      <section className="py-20 px-layout bg-gray-50">
        <div className="max-w-layout mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-16">
              <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                Mandate & Methodologies
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Five Specialized Service Pillars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                Delivering bankable project design, environmental safeguards, and carbon crediting mechanisms for government ministries, multilateral agencies, and private developers.
              </p>
            </div>
          </AnimateIn>

          <div className="space-y-8">
            {services.map((offer, index) => (
              <div key={offer.id} id={offer.id} className="scroll-mt-24">
                <AnimateIn direction="up" delay={index * 60}>
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Number, Title, Short Description */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shadow-xs">
                          {offer.icon}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00652c] px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                          Pillar 0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {offer.shortDesc}
                      </p>

                      <div className="pt-2">
                        <Link
                          to="/get-in-touch"
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00652c] hover:text-[#004018] group"
                        >
                          <span>Request expert advisory for this service</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Scope & Deliverables Checklist */}
                    <div className="lg:col-span-6 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#00652c]" />
                        <span>Technical Scope & Execution Mandate</span>
                      </h4>
                      <ul className="space-y-3">
                        {(offer.scope as string[]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimateIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM BANNER ── */}
      <section className="bg-[#00652c] py-16 px-layout text-center text-white">
        <div className="max-w-2xl mx-auto">
          <AnimateIn direction="up">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Need a Local Expert to Support Your Project?
            </h3>
            <p className="text-emerald-100 text-sm mb-8 leading-relaxed">
              We provide qualified technical staff for environment and climate assignments in Rwanda, Uganda, Tanzania, Kenya, and South-Sudan.
            </p>
            <Link
              to="/get-in-touch#hire-consultant"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#00652c] font-bold text-sm hover:bg-gray-100 transition-all shadow-lg"
            >
              <span>Fill Consultant Request Form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
};
