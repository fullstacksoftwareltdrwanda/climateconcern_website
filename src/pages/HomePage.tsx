import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { ourRecord as staticOurRecord } from '../data/bossContent';
import { api } from '../lib/api';

export const HomePage: React.FC = () => {
  const [ourRecord, setOurRecord] = useState(staticOurRecord);

  useEffect(() => {
    api.get<any[]>('/stats')
      .then((stats) => {
        if (stats && stats.length > 0) {
          // Map DB stats (label, value, description) to ourRecord.metrics format
          setOurRecord((prev) => ({
            ...prev,
            metrics: stats.slice(0, 4).map((s) => ({
              value: s.value,
              label: s.label,
              description: s.description || '',
            })),
          }));
        }
      })
      .catch(() => {});
  }, []);


  const services = [
    { label: 'Climate Finance', to: '/what-we-offer', icon: '💰' },
    { label: 'Carbon Markets', to: '/what-we-offer', icon: '🌱' },
    { label: 'Env. Safeguards', to: '/what-we-offer', icon: '🛡️' },
    { label: 'Training', to: '/training', icon: '🎓' },
    { label: 'Hire a Consultant', to: '/get-in-touch#hire-consultant', icon: '🤝' },
  ];

  return (
    <div className="w-full">
      {/* ── FULL-SCREEN HERO ── */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-layout overflow-hidden py-4 sm:py-6">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-hills.jpg"
            alt="Rwanda green hills"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#01160a]/97 via-[#02200f]/90 to-[#031d12]/80" />
        </div>

        <div className="max-w-layout mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* LEFT — Core message */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
              <AnimateIn direction="up" delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-[11px] sm:text-xs font-semibold backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e074] animate-pulse" />
                  Kigali, Rwanda · Est. 2012 · EAC Region
                </div>
              </AnimateIn>

              <AnimateIn direction="up" delay={80}>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-extrabold leading-[1.08] tracking-tight text-white">
                  Climate.<br />
                  Finance.<br />
                  <span className="text-[#00e074]">Impact.</span>
                </h1>
              </AnimateIn>

              <AnimateIn direction="up" delay={150}>
                <p className="text-white/80 text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed">
                  East Africa's specialist in climate finance, carbon markets, and environmental safeguards — turning complex climate policy into bankable projects.
                </p>
              </AnimateIn>

              <AnimateIn direction="up" delay={210}>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Link
                    to="/what-we-offer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                  >
                    <span>What We Offer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/get-in-touch#hire-consultant"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-sm transition-all"
                  >
                    <span>Hire a Consultant</span>
                  </Link>
                </div>
              </AnimateIn>

              {/* Compact stats row */}
              <AnimateIn direction="up" delay={280}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15">
                  {ourRecord.metrics.map((m) => (
                    <div key={m.label} className="text-white">
                      <div className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-[#00e074] leading-tight">
                        {m.value}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-white/70 leading-snug line-clamp-1" title={m.label}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* RIGHT — Quick navigation hub */}
            <div className="lg:col-span-5">
              <AnimateIn direction="right" delay={180}>
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white/8 backdrop-blur-xl border border-white/18 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#00e074]/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#00a859]/15 blur-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 mb-2.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00e074] shadow-[0_0_6px_#00e074]" />
                      Pick what you are looking for !
                    </p>
                    <div className="space-y-1.5">
                      {services.map((s) => (
                        <Link
                          key={s.label}
                          to={s.to}
                          className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 hover:border-[#00e074]/40 transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg w-7 text-center">{s.icon}</span>
                            <span className="text-xs sm:text-sm font-semibold text-white">{s.label}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/10 text-center">
                      <Link
                        to="/who-we-are"
                        className="text-[11px] text-white/60 hover:text-emerald-300 font-medium transition-colors"
                      >
                        Meet the Team →
                      </Link>
                      <span className="mx-2.5 text-white/20">|</span>
                      <Link
                        to="/library"
                        className="text-[11px] text-white/60 hover:text-emerald-300 font-medium transition-colors"
                      >
                        Library & Resources →
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
