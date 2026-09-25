import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, Play, ChevronRight } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { libraryData as staticLibraryData } from '../data/bossContent';
import { api } from '../lib/api';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [libraryData, setLibraryData] = useState(staticLibraryData);

  useEffect(() => {
    api.get<any[]>('/library')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLibraryData(data.map((cat: any) => ({
            id: cat.catId || cat.id,
            title: cat.title,
            tagline: cat.tagline || '',
            icon: cat.icon || '📚',
            items: (cat.items || []).map((item: any) => ({
              title: item.title,
              description: item.description,
              date: item.date || '',
              tag: item.tag || '',
              link: item.link || '',
            })),
          })));
        }
      })
      .catch(() => { /* fall back to static */ });
  }, []);

  return (
    <div className="w-full">
      {/* ── HERO SPLIT GRID ── */}
      <section className="relative text-white pt-32 pb-24 px-layout overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-kigali.jpg"
            alt="Kigali library background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/95 via-[#032415]/80 to-black/55" />
        </div>

        <div className="max-w-layout mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Filters */}
            <div className="lg:col-span-7">
              <AnimateIn direction="up">
                <span className="text-[#00e074] text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm block mb-3">
                  ✦ Knowledge Center & Research
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  Library
                </h1>
                <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8">
                  Free educational podcasts, scientific research publications, and verified updates on regional climate change events and Climate Concern initiatives.
                </p>
              </AnimateIn>

              {/* Filter Pills */}
              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'all', label: 'All Resources' },
                    { id: 'podcast', label: 'Podcast (Free Videos)' },
                    { id: 'publications', label: 'Publications' },
                    { id: 'updates', label: 'Updates' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#00a859] text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 backdrop-blur-sm'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Navigator Hub / Pool for Library */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Resource Categories
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      Free Access
                    </span>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    <button
                      onClick={() => setActiveTab('podcast')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all text-left group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🎙️
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Podcasts (Free Videos)
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Expert talks on Article 6 & Natural Capital
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </button>

                    <button
                      onClick={() => setActiveTab('publications')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all text-left group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          📚
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Research Publications
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Technical papers & policy assessments
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </button>

                    <button
                      onClick={() => setActiveTab('updates')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all text-left group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          📰
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Climate Change Updates
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Global negotiations & company announcements
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">Open access library</span>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>Show All Resources ↓</span>
                    </button>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 SECTIONS: PODCASTS, PUBLICATIONS, UPDATES ── */}
      <section className="py-20 px-layout bg-gray-50">
        <div className="max-w-layout mx-auto space-y-16">
          {libraryData
            .filter((cat) => activeTab === 'all' || activeTab === cat.id)
            .map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-24">
                <AnimateIn direction="up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{category.icon}</span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                          {category.title}
                        </h2>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                </AnimateIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.items.map((item, i) => (
                    <AnimateIn key={item.title} direction="up" delay={i * 70}>
                      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between h-full group">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00652c] text-[11px] font-bold border border-emerald-100">
                              {item.tag}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {item.date}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-[#00652c] transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#00652c]">
                          {category.id === 'podcast' ? (
                            <span className="inline-flex items-center gap-1.5 hover:underline cursor-pointer">
                              <Play className="w-3.5 h-3.5 fill-[#00652c]" />
                              <span>Watch Free Video</span>
                            </span>
                          ) : category.id === 'publications' ? (
                            <span className="inline-flex items-center gap-1.5 hover:underline cursor-pointer">
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 hover:underline cursor-pointer">
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Read Full Article</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── RESEARCH NOTICE BANNER ── */}
      <section className="bg-[#031d12] py-16 px-layout text-white text-center">
        <div className="max-w-2xl mx-auto">
          <AnimateIn direction="up">
            <span className="text-xs uppercase font-bold tracking-widest text-[#00e074] block mb-2">
              Academic & Research Partnerships
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Contributing Research or Seeking Data?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              We collaborate with universities, ministries, and international research organizations to co-author and publish verified climate impact data.
            </p>
            <Link
              to="/get-in-touch"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Contact our Research Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
};
