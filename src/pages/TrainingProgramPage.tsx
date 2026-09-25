import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, GraduationCap, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { trainingProgram as staticTrainingProgram, type StaticTrainingCourse } from '../data/bossContent';
import { api } from '../lib/api';
import { useExchangeRate, formatPriceDisplay, formatRwf, convertUsdToRwf } from '../lib/currency';

export const TrainingProgramPage: React.FC = () => {
  const exchangeRate = useExchangeRate();
  const [registered, setRegistered] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Certified Carbon Market Courses',
  });

  // Live courses from API (falls back to static data if API fails)
  const [trainingCourses, setTrainingCourses] = useState<StaticTrainingCourse[]>(staticTrainingProgram.courses);
  const trainingProgram = { ...staticTrainingProgram, courses: trainingCourses };

  const currentCourse = trainingCourses.find((c: any) => c.title === form.course) || trainingCourses[0];
  const phase1Fee = currentCourse?.phase1Price ?? 50;
  const phase1Display = formatPriceDisplay(phase1Fee, exchangeRate.rate);
  const phase2Fee = currentCourse?.phase2Price ?? 50;
  const phase2Display = formatPriceDisplay(phase2Fee, exchangeRate.rate);

  useEffect(() => {
    api.get<any[]>('/training')
      .then((data) => {
        if (data && data.length > 0) setTrainingCourses(data as any);
      })
      .catch(() => { /* fall back to static */ });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setSubmitError('Please accept the two-phase learning notice and tuition terms before submitting.');
      return;
    }
    if (!paymentFile) {
      setSubmitError(`Please upload your proof of payment (${phase1Display.fullLabel}).`);
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.phone) formData.append('phone', form.phone);
      formData.append('course', form.course);
      formData.append('amountPaid', phase1Display.fullLabel);
      formData.append('termsAccepted', 'true');
      formData.append('paymentProof', paymentFile);

      await api.post('/applications', formData);
      setRegistered(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── HERO SPLIT GRID ── */}
      <section className="relative text-white pt-32 pb-24 px-layout overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-hills.jpg"
            alt="Rwanda hills"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/95 via-[#032415]/80 to-black/55" />
        </div>

        <div className="max-w-layout mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7">
              <AnimateIn direction="up">
                <span className="text-[#00e074] text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm block mb-3">
                  ✦ Professional Capacity Building
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  Training Program
                </h1>
                <p className="text-white/95 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8 font-medium">
                  {trainingProgram.lead}
                </p>
              </AnimateIn>

              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#courses"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <span>Browse Certified Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#enroll"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <span>Direct Enrollment Form</span>
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Navigator Hub / Pool for Training */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Training Tracks
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      Certification
                    </span>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    <a
                      href="#courses"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🌱
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Certified Carbon Market Courses
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Article 6, PDD Preparation, MRV & Crediting
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>

                    <a
                      href="#courses"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          💰
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Certified Climate Adaptation Finance
                          </div>
                          <div className="text-[11px] text-gray-300">
                            GCF & Sovereign Funding Proposals
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>

                    <a
                      href="#enroll"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🎓
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Flexible Hybrid Learning Model
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Self-paced modules + interactive expert Q&A
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">World-class faculty</span>
                    <a
                      href="#enroll"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>Enroll in Next Cohort ↓</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFIED COURSES SECTION (EXACT BOSS OFFERINGS) ── */}
      <section id="courses" className="py-20 px-layout bg-white scroll-mt-20">
        <div className="max-w-layout mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-16">
              <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                Curriculum & Certifications
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                World-Class Certified Programs
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Designed and taught by seasoned practitioners who actively structure sovereign Article 6 projects and Green Climate Fund frameworks.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {trainingProgram.courses.map((course, i) => (
              <AnimateIn key={course.id} direction="up" delay={i * 100}>
                <div className="bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-soft flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#00652c] text-xs font-bold uppercase tracking-wide">
                        {course.badge}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-emerald-700">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#00652c] mb-4">
                      {course.subtitle}
                    </p>

                    {/* Admin editable Course Overview */}
                    {course.overview && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5">
                        {course.overview}
                      </p>
                    )}

                    {/* Admin editable Curriculum Modules */}
                    {course.modules && Array.isArray(course.modules) && course.modules.length > 0 && (
                      <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#00652c] mb-2.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#00652c]" />
                          <span>Curriculum Modules</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {course.modules.map((mod: string, modIdx: number) => (
                            <li key={modIdx} className="flex items-start gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00a859] shrink-0 mt-0.5" />
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-3 mb-8">
                      {/* Phase 1 */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                            <CheckCircle2 className="w-4 h-4 text-[#00a859] shrink-0" />
                            <span>{course.phase1Title || 'Phase 1: Self-Paced Online Learning'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#00652c] text-[10px] font-bold border border-emerald-100 shrink-0">
                            Certificate of Completion
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 pl-6 leading-relaxed mb-2.5">
                          {course.phase1Desc || 'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.'}
                        </p>
                        <div className="pl-6 flex items-center justify-between text-xs pt-1.5 border-t border-gray-100">
                          <span className="text-[11px] font-semibold text-emerald-800">Phase 1 Fee:</span>
                          <span className="font-extrabold text-gray-900">
                            {formatPriceDisplay(course.phase1Price ?? 50, exchangeRate.rate).fullLabel}
                          </span>
                        </div>
                      </div>

                      {/* Phase 2 */}
                      <div className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{course.phase2Title || 'Phase 2: Interactive Expert Support & Hands-On Practice'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 shrink-0">
                            Optional & Paid · In Rwanda 🇷🇼
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 pl-6 leading-relaxed mb-2">
                          {course.phase2Desc || 'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.'}
                        </p>
                        <div className="pl-6 mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-medium border border-rose-100">
                            ⚠️ Prerequisite: Must complete Phase 1 first. Cannot be taken alone.
                          </span>
                        </div>
                        <div className="pl-6 flex items-center justify-between text-xs pt-1.5 border-t border-amber-100/60">
                          <span className="text-[11px] font-semibold text-amber-900">Phase 2 Fee:</span>
                          <span className="font-extrabold text-gray-900">
                            {formatPriceDisplay(course.phase2Price ?? 50, exchangeRate.rate).fullLabel}
                          </span>
                        </div>
                      </div>

                      {/* Summary Enrollment Fee for Phase 1 */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#00652c] block">Enroll in Phase 1 (Self-Paced)</span>
                          <span className="text-[10px] text-gray-500">Includes Certificate of Completion · Phase 2 optional afterwards</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-gray-900">
                            ${course.phase1Price ?? 50} USD
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            ≈ {formatRwf(convertUsdToRwf(course.phase1Price ?? 50, exchangeRate.rate))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500 font-medium">Hybrid: Self-paced & Live Q&A</span>
                    <a
                      href="#enroll"
                      onClick={(e) => {
                        e.preventDefault();
                        setForm((prev) => ({ ...prev, course: course.title }));
                        const el = document.getElementById('enroll');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Quick Enrollment Card */}
          <div id="enroll" className="max-w-2xl mx-auto scroll-mt-24">
            <AnimateIn direction="up">
              <div className="bg-[#031d12] text-white rounded-3xl p-8 sm:p-10 border border-emerald-800/50 shadow-xl">
                <div className="text-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#00e074] block mb-1">
                    Direct Registration
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                    Enroll in Training Program
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    Register your seat for the upcoming certified cohort. Tuition includes self-paced online modules with a Certificate of Completion, with optional interactive expert support.
                  </p>
                </div>

                {registered ? (
                  <div className="p-6 rounded-2xl bg-white/10 border border-emerald-400/30 text-center">
                    <ShieldCheck className="w-10 h-10 text-[#00e074] mx-auto mb-3" />
                    <h4 className="font-bold text-lg text-white mb-1">Registration & Payment Submitted!</h4>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      Thank you, <strong>{form.name}</strong>. We have received your application for <strong>{form.course}</strong> along with your proof of payment ({phase1Display.fullLabel}).
                    </p>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-emerald-200 text-left space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00e074] shrink-0 mt-0.5" />
                        <span><strong>Phase 1:</strong> Online self-paced learning portal credentials will be sent to <strong>{form.email}</strong>. Finishing awards your official Certificate of Completion.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Phase 2 (Optional):</strong> After completing Phase 1, you can optionally register for Phase 2 ({phase2Display.fullLabel}) for hands-on practice in Rwanda and direct expert mentorship.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRegistered(false);
                        setTermsAccepted(false);
                        setPaymentFile(null);
                        setForm({ name: '', email: '', phone: '', course: trainingCourses[0]?.title || 'Certified Carbon Market Courses' });
                      }}
                      className="text-xs font-bold text-[#00e074] hover:underline"
                    >
                      ← Submit another registration
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {submitError && (
                      <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-500/50 flex items-center gap-2 text-rose-200 text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00e074]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@organization.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00e074]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+250 78..."
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00e074]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Select Course *</label>
                      <select
                        value={form.course}
                        onChange={(e) => setForm({ ...form, course: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00e074]"
                      >
                        {trainingCourses.map((c: any) => (
                          <option key={c.id || c.title} value={c.title} className="bg-[#031d12] text-white">
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ── Two-Phase Learning Notice & Tuition Agreement ── */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/90 border border-[#00e074]/30 text-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-white text-sm">
                        <GraduationCap className="w-5 h-5 text-[#00e074]" />
                        <span>Training Structure, Certification & Hands-On Practice in Rwanda</span>
                      </div>
                      <p className="text-emerald-100/90 leading-relaxed text-[12px]">
                        Enrollment in <strong>{form.course}</strong> is structured in two sequential phases:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="font-bold text-[#00e074] block mb-0.5">1. Self-Paced Online (Enrolling Now)</span>
                          <span className="text-[11px] text-gray-300 block mb-1">
                            Complete modular curriculum and resources. Upon finishing, you earn an official <strong>Certificate of Completion</strong>.
                          </span>
                          <span className="text-[11px] font-bold text-white">
                            Fee: {phase1Display.fullLabel}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-amber-400/30">
                          <span className="font-bold text-amber-300 block mb-0.5">2. Hands-On Practice in Rwanda (Optional)</span>
                          <span className="text-[11px] text-gray-300 block mb-1">
                            Direct expert mentorship & field practice in Rwanda 🇷🇼. <strong>Prerequisite:</strong> you cannot take Phase 2 alone without first completing Phase 1.
                          </span>
                          <span className="text-[11px] font-bold text-amber-200">
                            Fee: {phase2Display.fullLabel} (after Phase 1)
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#00a859]/20 border border-[#00e074]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Phase 1 Fee Due Now</span>
                          <div className="text-base font-extrabold text-white">
                            ${phase1Fee} USD <span className="text-xs font-normal text-emerald-200">({phase1Display.approxRwf})</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-emerald-200 bg-white/10 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                          Live Rate: 1 USD ≈ {Math.round(exchangeRate.rate)} RWF
                        </span>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-white/10">
                        <input
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-gray-400 text-[#00a859] focus:ring-[#00e074] cursor-pointer"
                        />
                        <span className="text-xs text-gray-200 select-none">
                          I acknowledge that this registration is for <strong>Phase 1 (Self-Paced Online)</strong> at <strong>${phase1Fee} USD ({phase1Display.approxRwf})</strong>, which awards an official Certificate of Completion. I understand that <strong>Phase 2 (hands-on practice in Rwanda)</strong> is optional, paid separately (${phase2Fee} USD), and cannot be taken without first completing Phase 1. *
                        </span>
                      </label>
                    </div>

                    {/* ── Proof of Payment Upload ── */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        Proof of Payment ({phase1Display.fullLabel}) *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          required
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPaymentFile(e.target.files[0]);
                            }
                          }}
                          className="block w-full text-xs text-gray-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#00a859] file:text-white hover:file:bg-[#00c968] file:cursor-pointer cursor-pointer border border-white/20 rounded-xl bg-white/10 p-2 focus:outline-none focus:ring-2 focus:ring-[#00e074]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                        <span>Accepted formats: PDF, PNG, JPG, WEBP (Max 15MB)</span>
                        {paymentFile && (
                          <span className="text-emerald-400 font-semibold truncate max-w-[220px]">
                            ✓ {paymentFile.name} ({(paymentFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-[#00a859] hover:bg-[#00c968] active:scale-95 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all mt-4 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Application & Proof of Payment...</span>
                        </>
                      ) : (
                        <span>Submit Course Registration & Proof of Payment</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </div>
  );
};
