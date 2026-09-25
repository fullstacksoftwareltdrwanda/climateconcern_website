import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  BookOpen,
  GraduationCap,
  DollarSign,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Award,
  MapPin,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';
import { useExchangeRate, convertUsdToRwf, formatRwf } from '../../lib/currency';

interface TrainingCourse {
  id: string;
  courseId: string;
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
  order: number;
}

const DEFAULT_PHASE1_TITLE = 'Phase 1: Self-Paced Online Learning';
const DEFAULT_PHASE1_DESC =
  'Complete online portal access with comprehensive modular curriculum, case studies, and reading materials. You earn an official Certificate of Completion upon finishing this phase.';

const DEFAULT_PHASE2_TITLE = 'Phase 2: Interactive Expert Support & Hands-On Practice';
const DEFAULT_PHASE2_DESC =
  'Direct live mentoring with climate finance specialists, project design reviews, and hands-on practice in Rwanda. Note: Phase 2 cannot be taken alone without first completing Phase 1.';

export const TrainingSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('training', 'edit');
  const canDelete = hasPermission('training', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const exchangeRate = useExchangeRate();
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [manualRateInput, setManualRateInput] = useState('');
  const [updatingRate, setUpdatingRate] = useState(false);

  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    subtitle: '',
    badge: 'Certified Professional Course',
    overview: '',
    modules: '',
    phase1Price: 50,
    phase2Price: 50,
    phase1Title: DEFAULT_PHASE1_TITLE,
    phase1Desc: DEFAULT_PHASE1_DESC,
    phase2Title: DEFAULT_PHASE2_TITLE,
    phase2Desc: DEFAULT_PHASE2_DESC,
    order: 0,
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.get<TrainingCourse[]>('/training');
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (exchangeRate.rate) {
      setManualRateInput(exchangeRate.rate.toString());
    }
  }, [exchangeRate.rate]);

  const handleToggleAutoRate = async () => {
    try {
      setUpdatingRate(true);
      await exchangeRate.updateRate('auto');
      setIsEditingRate(false);
      toast.success('Exchange rate set to Live Automatic (Open Exchange Rates / BNR)');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update exchange rate');
    } finally {
      setUpdatingRate(false);
    }
  };

  const handleSaveManualRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualRateInput);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid positive exchange rate in RWF per 1 USD');
      return;
    }
    try {
      setUpdatingRate(true);
      await exchangeRate.updateRate('manual', val);
      setIsEditingRate(false);
      toast.success(`Exchange rate manually set to 1 USD = ${val.toLocaleString('en-US')} RWF`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save manual exchange rate');
    } finally {
      setUpdatingRate(false);
    }
  };

  const handleRefreshRate = async () => {
    try {
      setUpdatingRate(true);
      await exchangeRate.refreshRate();
      toast.success('Live exchange rate synchronized successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to refresh exchange rate');
    } finally {
      setUpdatingRate(false);
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm({
      courseId: '',
      title: '',
      subtitle: '',
      badge: 'Certified Professional Course',
      overview: '',
      modules: '',
      phase1Price: 50,
      phase2Price: 50,
      phase1Title: DEFAULT_PHASE1_TITLE,
      phase1Desc: DEFAULT_PHASE1_DESC,
      phase2Title: DEFAULT_PHASE2_TITLE,
      phase2Desc: DEFAULT_PHASE2_DESC,
      order: courses.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (c: TrainingCourse) => {
    setEditingCourse(c);
    setForm({
      courseId: c.courseId,
      title: c.title,
      subtitle: c.subtitle,
      badge: c.badge,
      overview: c.overview || '',
      modules: (c.modules || []).join('\n'),
      phase1Price: c.phase1Price ?? 50,
      phase2Price: c.phase2Price ?? 50,
      phase1Title: c.phase1Title || DEFAULT_PHASE1_TITLE,
      phase1Desc: c.phase1Desc || DEFAULT_PHASE1_DESC,
      phase2Title: c.phase2Title || DEFAULT_PHASE2_TITLE,
      phase2Desc: c.phase2Desc || DEFAULT_PHASE2_DESC,
      order: c.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      courseId: form.courseId.toLowerCase().replace(/\s+/g, '-'),
      title: form.title,
      subtitle: form.subtitle,
      badge: form.badge,
      overview: form.overview,
      modules: form.modules
        .split('\n')
        .map((m) => m.trim())
        .filter(Boolean),
      phase1Price: Number(form.phase1Price) >= 0 ? Number(form.phase1Price) : 50,
      phase2Price: Number(form.phase2Price) >= 0 ? Number(form.phase2Price) : 50,
      phase1Title: form.phase1Title,
      phase1Desc: form.phase1Desc,
      phase2Title: form.phase2Title,
      phase2Desc: form.phase2Desc,
      order: Number(form.order),
    };

    try {
      if (editingCourse) {
        const updated = await api.put<TrainingCourse>(`/training/${editingCourse.id}`, payload);
        setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await api.post<TrainingCourse>('/training', payload);
        setCourses((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingCourse ? 'Course updated successfully!' : 'Course added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving course');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: 'Delete Training Course',
      message: `Are you sure you want to permanently delete course "${title}"? This action cannot be undone.`,
      confirmText: 'Delete Course',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/training/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Course "${title}" deleted successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting course');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Capacity Building
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Training Programs & Curriculum
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage certified courses, Phase 1 & Phase 2 pricing, Certificate of Completion tracks, and live currency rates.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course Track</span>
          </button>
        )}
      </div>

      {/* ── Currency Exchange Rate Control Bar ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#012716] to-[#021f12] rounded-3xl p-5 sm:p-6 text-white border border-emerald-800/40 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Live USD to RWF Rate
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    exchangeRate.mode === 'auto'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  {exchangeRate.mode === 'auto' ? '● Live Auto Sync' : '● Manual Override'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  1 USD = {exchangeRate.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RWF
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">
                All training fees in USD are automatically converted to Rwandan Francs using this rate.
                {exchangeRate.lastUpdated && (
                  <span className="ml-1 text-emerald-300/50">
                    (Updated {new Date(exchangeRate.lastUpdated).toLocaleDateString()}{' '}
                    {new Date(exchangeRate.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {canEdit && (
              <>
                <button
                  type="button"
                  disabled={updatingRate}
                  onClick={handleRefreshRate}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
                  title="Force re-fetch from open exchange rate API"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${updatingRate ? 'animate-spin' : ''}`} />
                  <span>Sync Rate</span>
                </button>

                {exchangeRate.mode === 'manual' ? (
                  <button
                    type="button"
                    disabled={updatingRate}
                    onClick={handleToggleAutoRate}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Switch to Auto Sync</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingRate(!isEditingRate)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{isEditingRate ? 'Cancel Edit' : 'Edit Rate'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Manual Rate Input Form */}
        {isEditingRate && canEdit && (
          <form
            onSubmit={handleSaveManualRate}
            className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200 font-medium">1 USD =</span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={manualRateInput}
                onChange={(e) => setManualRateInput(e.target.value)}
                placeholder="1476.78"
                className="w-36 px-3 py-1.5 rounded-xl bg-black/40 text-white font-mono text-sm border border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-xs text-emerald-200 font-medium">RWF</span>
            </div>

            <button
              type="submit"
              disabled={updatingRate}
              className="px-4 py-1.5 rounded-xl bg-[#00a859] hover:bg-[#00c968] text-white font-bold text-xs transition-all shadow-sm"
            >
              {updatingRate ? 'Saving...' : 'Apply Manual Rate'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditingRate(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* ── Courses List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">No courses found.</div>
        ) : (
          courses.map((c) => {
            const p1Price = c.phase1Price ?? 50;
            const p2Price = c.phase2Price ?? 50;
            const p1Rwf = convertUsdToRwf(p1Price, exchangeRate.rate);
            const p2Rwf = convertUsdToRwf(p2Price, exchangeRate.rate);

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#00652c] text-[10px] font-bold border border-emerald-100">
                      {c.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#00652c]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-xs font-semibold text-[#00652c] mb-3">{c.subtitle}</p>
                  {c.overview && (
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-3">{c.overview}</p>
                  )}

                  {/* Modules */}
                  {c.modules && c.modules.length > 0 && (
                    <div className="space-y-1.5 mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-[#00652c]" />
                        <span>Curriculum Modules ({c.modules.length}):</span>
                      </span>
                      {c.modules.slice(0, 4).map((mod, i) => (
                        <div key={i} className="text-[11px] text-gray-700 flex items-start gap-2">
                          <span className="text-[#00652c] font-bold mt-0.5">•</span>
                          <span className="line-clamp-1">{mod}</span>
                        </div>
                      ))}
                      {c.modules.length > 4 && (
                        <span className="text-[10px] text-gray-400 block pt-1">
                          + {c.modules.length - 4} more modules
                        </span>
                      )}
                    </div>
                  )}

                  {/* Phases Breakdown Box */}
                  <div className="space-y-2.5 mb-5">
                    {/* Phase 1 Box */}
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#00652c]" />
                          <span>Phase 1 (Certificate of Completion)</span>
                        </span>
                        <span className="font-extrabold text-emerald-800">
                          ${p1Price} USD <span className="font-normal text-emerald-600">(~{formatRwf(p1Rwf)})</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900/70 leading-relaxed line-clamp-2">
                        {c.phase1Desc || DEFAULT_PHASE1_DESC}
                      </p>
                    </div>

                    {/* Phase 2 Box */}
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-amber-950 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          <span>Phase 2 (Optional & Paid · In Rwanda 🇷🇼)</span>
                        </span>
                        <span className="font-extrabold text-amber-800">
                          ${p2Price} USD <span className="font-normal text-amber-600">(~{formatRwf(p2Rwf)})</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900/70 leading-relaxed line-clamp-2">
                        {c.phase2Desc || DEFAULT_PHASE2_DESC}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-rose-700">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Prerequisite: Phase 1 completion required.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono">Slug: {c.courseId}</span>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        title="Edit Course"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal (Add / Edit Course) ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00652c] block mb-0.5">
                Curriculum Editor
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900">
                {editingCourse ? 'Edit Course Track' : 'Add Course Track'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Course Identifier & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Course Slug *</label>
                  <input
                    required
                    type="text"
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    placeholder="carbon-market-courses"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Used for URL hashes and enrollment targeting.</span>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Tag *</label>
                  <input
                    required
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Certified Professional Course"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Course Title *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Certified Carbon Market Courses"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Course Subtitle *</label>
                <input
                  required
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="From Fundamentals to Article 6 & Verified Credit Issuance"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              {/* Overview */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Course Overview (Publicly displayed on training page) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.overview}
                  onChange={(e) => setForm({ ...form, overview: e.target.value })}
                  placeholder="Comprehensive description of the course content and learning outcomes..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              {/* Modules */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Core Modules (one per line — renders as bullet points on public page)
                </label>
                <textarea
                  rows={4}
                  value={form.modules}
                  onChange={(e) => setForm({ ...form, modules: e.target.value })}
                  placeholder="Introduction to Compliance and Voluntary Carbon Markets&#10;Article 6 of the Paris Agreement & Standardized Crediting Frameworks&#10;Project Design Document (PDD) Preparation and Validation&#10;MRV Systems"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              {/* ── Phase 1 Configuration Card ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00652c]" />
                    <span className="font-bold text-emerald-950">Phase 1 Configuration</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900">
                    Official Certificate of Completion
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Phase 1 Title</label>
                    <input
                      type="text"
                      value={form.phase1Title}
                      onChange={(e) => setForm({ ...form, phase1Title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Fee (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={form.phase1Price}
                        onChange={(e) => setForm({ ...form, phase1Price: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-800 font-medium block mt-1">
                      ≈ {formatRwf(convertUsdToRwf(Number(form.phase1Price) || 0, exchangeRate.rate))}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phase 1 Description</label>
                  <textarea
                    rows={2}
                    value={form.phase1Desc}
                    onChange={(e) => setForm({ ...form, phase1Desc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              {/* ── Phase 2 Configuration Card ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-amber-950">Phase 2 Configuration</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                    Optional & Paid · In Rwanda 🇷🇼
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Phase 2 Title</label>
                    <input
                      type="text"
                      value={form.phase2Title}
                      onChange={(e) => setForm({ ...form, phase2Title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Fee (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={form.phase2Price}
                        onChange={(e) => setForm({ ...form, phase2Price: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                    <span className="text-[10px] text-amber-800 font-medium block mt-1">
                      ≈ {formatRwf(convertUsdToRwf(Number(form.phase2Price) || 0, exchangeRate.rate))}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phase 2 Description</label>
                  <textarea
                    rows={2}
                    value={form.phase2Desc}
                    onChange={(e) => setForm({ ...form, phase2Desc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <span className="text-[10px] text-amber-800 font-semibold block mt-1">
                    ⚠️ Prerequisite rule: Enrollees cannot take Phase 2 without completing Phase 1 first.
                  </span>
                </div>
              </div>

              {/* Display Order */}
              <div className="w-32">
                <label className="font-bold text-gray-700 block mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white font-bold shadow-sm"
                >
                  Save Course Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
