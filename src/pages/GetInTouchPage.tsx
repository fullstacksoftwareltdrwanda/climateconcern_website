import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Upload, CheckCircle2, ArrowRight, CreditCard, Smartphone, ChevronRight, AlertCircle } from 'lucide-react';
import { AnimateIn } from '../components/ui/AnimateIn';
import { contactHandles as staticContactHandles } from '../data/bossContent';
import { api } from '../lib/api';

export const GetInTouchPage: React.FC = () => {
  const [contactHandles, setContactHandles] = useState(staticContactHandles);

  useEffect(() => {
    api.get<any>('/contact')
      .then((data) => {
        if (data) {
          setContactHandles({
            phone: data.phone || staticContactHandles.phone,
            phoneClean: data.phoneClean || staticContactHandles.phoneClean,
            email: data.email || staticContactHandles.email,
            physicalAddress: data.physicalAddress || staticContactHandles.physicalAddress,
            x: data.xHandle || staticContactHandles.x,
            xUrl: data.xUrl || staticContactHandles.xUrl,
            linkedin: data.linkedinHandle || staticContactHandles.linkedin,
            linkedinUrl: data.linkedinUrl || staticContactHandles.linkedinUrl,
            ig: data.igHandle || staticContactHandles.ig,
            igUrl: data.igUrl || staticContactHandles.igUrl,
          });
        }
      })
      .catch(() => { /* fall back to static */ });
  }, []);

  const [form, setForm] = useState({
    title: '',
    country: 'Rwanda',
    position: '',
    education: 'Masters',
    experience: '5',
    startMonthYear: '',
    endMonthYear: '',
    personDays: '60',
    file: null as File | null,
    paymentMode: 'Visa',
    momoPhone: '',
    clientName: '',
    clientEmail: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('clientName', form.clientName);
      fd.append('clientEmail', form.clientEmail);
      fd.append('title', form.title);
      fd.append('country', form.country);
      fd.append('position', form.position);
      fd.append('education', form.education);
      fd.append('experience', form.experience);
      fd.append('startMonth', form.startMonthYear);
      fd.append('endMonth', form.endMonthYear);
      fd.append('personDays', form.personDays);
      fd.append('paymentMode', form.paymentMode);
      if (form.momoPhone) fd.append('momoPhone', form.momoPhone);
      if (form.file) fd.append('torFile', form.file);

      await api.post('/consultant-requests', fd);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
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
            src="/assets/hero-kigali.jpg"
            alt="Kigali skyline"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02180d]/95 via-[#032415]/80 to-black/55" />
        </div>

        <div className="max-w-layout mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Jump Actions */}
            <div className="lg:col-span-7">
              <AnimateIn direction="up">
                <span className="text-[#00e074] text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm block mb-3">
                  ✦ Direct Advisory Desk & Pool Allocation
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-xl mb-6">
                  Get in Touch
                </h1>
                <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-8">
                  Connect directly with our Kigali office or request a seasoned technical consultant from our expert pool across Rwanda and the EAC region.
                </p>
              </AnimateIn>

              <AnimateIn direction="up" delay={120}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#hire-consultant"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <span>Request a Consultant from Pool</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${contactHandles.phoneClean}`}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <Phone className="w-4 h-4 text-[#00e074]" />
                    <span>Call Kigali Office</span>
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Hero Quick Hotline & Pool Navigator Hub */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <AnimateIn direction="right" delay={160}>
                <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white/15 via-[#022415]/75 to-[#01140b]/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00e074]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00a859]/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/15 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e074] shadow-[0_0_8px_#00e074]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Direct Advisory Hotline
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      Kigali Desk
                    </span>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    <a
                      href={`tel:${contactHandles.phoneClean}`}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          📞
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {contactHandles.phone}
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Phone & WhatsApp Direct Line
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>

                    <a
                      href={`mailto:${contactHandles.email}`}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          ✉️
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {contactHandles.email}
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Official Inquiries & ToR Submissions
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>

                    <a
                      href="#hire-consultant"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00e074]/40 transition-all group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                          🌍
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                            Consultant Pool: 5 EAC Countries
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Rwanda, Uganda, Tanzania, Kenya, South-Sudan
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                    </a>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between relative z-10">
                    <span className="text-[11px] text-gray-300">Rapid 24-hr allocation</span>
                    <a
                      href="#hire-consultant"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e074] hover:text-white hover:underline transition-colors"
                    >
                      <span>Fill Request Form ↓</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICIAL CONTACT HANDLES ── */}
      <section className="py-12 px-layout bg-emerald-950/20 border-b border-emerald-900/40">
        <div className="max-w-layout mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phone */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-soft flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-[#00652c] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Phone</span>
                <a href={`tel:${contactHandles.phoneClean}`} className="text-sm font-bold text-gray-900 hover:text-[#00652c] transition-colors">
                  {contactHandles.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-soft flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-[#00652c] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Email</span>
                <a href={`mailto:${contactHandles.email}`} className="text-sm font-bold text-gray-900 hover:text-[#00652c] transition-colors">
                  {contactHandles.email}
                </a>
              </div>
            </div>

            {/* Social Handles */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-soft flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Social Channels</span>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#00652c]">
                <a href={contactHandles.xUrl} target="_blank" rel="noreferrer" className="hover:underline">X: {contactHandles.x}</a>
                <span>•</span>
                <a href={contactHandles.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                <span>•</span>
                <a href={contactHandles.igUrl} target="_blank" rel="noreferrer" className="hover:underline">IG</a>
              </div>
            </div>

            {/* Physical Address */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-soft flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-[#00652c] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Physical Address</span>
                <span className="text-xs font-medium text-gray-700 leading-snug block">
                  {contactHandles.physicalAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTANT POOL REQUEST FORM (EXACT FIELDS FROM BOSS DOCUMENT) ── */}
      <section id="hire-consultant" className="py-20 px-layout bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-12">
              <span className="text-[#00652c] text-xs font-bold uppercase tracking-widest block mb-2">
                Consultant Pool Allocation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Request a Local Expert from Our Pool
              </h2>
              <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
                To have a local expert from our pool of consultants to support your work in Rwanda and East Africa Community Region, fill in the form bellow:
              </p>
            </div>
          </AnimateIn>

          {submitted ? (
            <AnimateIn direction="up">
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-soft-lg">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8 text-[#00a859]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                  Request Received!
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for submitting your request for <strong>{form.position || 'Consultant'}</strong> in <strong>{form.country}</strong>. Our technical coordination desk will review the project terms and reach out to you within 24 hours.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 max-w-sm mx-auto text-left space-y-1">
                  <div><strong>Tender / Project:</strong> {form.title || 'N/A'}</div>
                  <div><strong>Allocated Days:</strong> {form.personDays} Person-Days</div>
                  <div><strong>Selected Payment:</strong> {form.paymentMode}</div>
                </div>
              </div>
            </AnimateIn>
          ) : (
            <AnimateIn direction="up" delay={80}>
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-soft-lg space-y-6">
                {/* Client Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-gray-100">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Name / Organization Name *</label>
                    <input
                      required
                      type="text"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      placeholder="e.g. Ministry of Environment / Agency"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      placeholder="contact@agency.org"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                  </div>
                </div>

                {/* 1. Project/Tender Title [Type] */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Project / Tender Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter full project or tender title"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>

                {/* 2. Country of Intervention [Dropdown] */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Country of Intervention *
                    </label>
                    <select
                      required
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    >
                      <option value="Rwanda">Rwanda</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South-Sudan">South-Sudan</option>
                    </select>
                  </div>

                  {/* 3. Position of the needed consultant [Type] */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Position of the Needed Consultant *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="e.g. Lead Carbon Specialist, EIA Assessor"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                  </div>
                </div>

                {/* 4. Level of Education & 5. Years of Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Level of Education *
                    </label>
                    <select
                      required
                      value={form.education}
                      onChange={(e) => setForm({ ...form, education: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    >
                      <option value="Bachelor degree">Bachelor degree</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Years of Experience *
                    </label>
                    <select
                      required
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                        <option key={y} value={String(y)}>
                          {y} {y === 1 ? 'Year' : 'Years'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Project Period (Calendar Start MM/YYYY, End MM/YYYY) */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Project Period (Start & End Dates) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="text-[11px] text-gray-500 block mb-0.5">Start: MM/YYYY</span>
                      <input
                        required
                        type="month"
                        value={form.startMonthYear}
                        onChange={(e) => setForm({ ...form, startMonthYear: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                      />
                    </div>
                    <div className="relative">
                      <span className="text-[11px] text-gray-500 block mb-0.5">End: MM/YYYY</span>
                      <input
                        required
                        type="month"
                        value={form.endMonthYear}
                        onChange={(e) => setForm({ ...form, endMonthYear: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Estimated Allocated Person-Days (Dropdown 15 to 500) */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Estimated Allocated Person-Days *
                  </label>
                  <select
                    required
                    value={form.personDays}
                    onChange={(e) => setForm({ ...form, personDays: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  >
                    {[15, 30, 45, 60, 90, 120, 150, 200, 250, 300, 350, 400, 450, 500].map((d) => (
                      <option key={d} value={String(d)}>
                        {d} Person-Days
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Attach ToRs if Available (Upload Button) */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Attach ToRs If Available
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 cursor-pointer hover:bg-emerald-50/40 hover:border-[#00652c] transition-colors">
                    <Upload className="w-6 h-6 text-[#00652c]" />
                    <div className="text-center">
                      <span className="text-xs font-semibold text-gray-800 block">
                        {form.file ? form.file.name : 'Click to upload Terms of Reference (PDF, DOCX, ZIP)'}
                      </span>
                      <span className="text-[11px] text-gray-400">Max file size 15MB</span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 9. Select Payment Mode: Visa, MasterCard, MoMo */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-gray-700 block mb-2">
                    Select Payment Mode *
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {['Visa', 'MasterCard', 'MoMo (Phone number)'].map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setForm({ ...form, paymentMode: mode })}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          form.paymentMode === mode
                            ? 'bg-emerald-50 border-[#00652c] text-[#00652c] shadow-xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {mode.includes('MoMo') ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        <span>{mode}</span>
                      </button>
                    ))}
                  </div>

                  {form.paymentMode.includes('MoMo') && (
                    <div className="mt-3">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        MoMo Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.momoPhone}
                        onChange={(e) => setForm({ ...form, momoPhone: e.target.value })}
                        placeholder="e.g. 0788481439"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                      />
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#00a859] hover:bg-[#00c968] active:scale-95 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Consultant Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </AnimateIn>
          )}
        </div>
      </section>
    </div>
  );
};
