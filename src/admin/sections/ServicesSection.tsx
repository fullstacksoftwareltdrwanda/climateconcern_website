import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

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

export const ServicesSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('services', 'edit');
  const canDelete = hasPermission('services', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [form, setForm] = useState({
    serviceId: '',
    icon: '🌿',
    tabLabel: '',
    headline: '',
    shortSummary: '',
    deliverables: '',
    cta: 'Learn More',
    ctaLink: '/meet-us',
    color: 'green',
    order: 0,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get<Service[]>('/services');
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      serviceId: '',
      icon: '🌿',
      tabLabel: '',
      headline: '',
      shortSummary: '',
      deliverables: '',
      cta: 'Get Support',
      ctaLink: '/meet-us',
      color: 'green',
      order: services.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setForm({
      serviceId: s.serviceId,
      icon: s.icon,
      tabLabel: s.tabLabel,
      headline: s.headline,
      shortSummary: s.shortSummary,
      deliverables: (s.deliverables || []).join('\n'),
      cta: s.cta,
      ctaLink: s.ctaLink,
      color: s.color,
      order: s.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      serviceId: form.serviceId.toLowerCase().replace(/\s+/g, '-'),
      icon: form.icon,
      tabLabel: form.tabLabel,
      headline: form.headline,
      shortSummary: form.shortSummary,
      deliverables: form.deliverables.split('\n').map((s) => s.trim()).filter(Boolean),
      cta: form.cta,
      ctaLink: form.ctaLink,
      color: form.color,
      order: Number(form.order),
    };

    try {
      if (editingService) {
        const updated = await api.put<Service>(`/services/${editingService.id}`, payload);
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await api.post<Service>('/services', payload);
        setServices((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingService ? 'Service updated successfully!' : 'Service added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving service');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: 'Delete Service',
      message: `Are you sure you want to delete service "${name}"? This action cannot be undone.`,
      confirmText: 'Delete Service',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success(`Service "${name}" deleted successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Offerings & Capabilities
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Services
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage services displayed on the homepage and What We Offer pages.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">No services found.</div>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    ID: {s.serviceId}
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 leading-snug">{s.headline}</h3>
                <p className="text-[11px] text-[#00652c] font-semibold mb-2">Tab: {s.tabLabel}</p>
                <p className="text-xs text-gray-600 line-clamp-3 mb-4">{s.shortSummary}</p>

                {s.deliverables && s.deliverables.length > 0 && (
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Deliverables:
                    </span>
                    {s.deliverables.slice(0, 3).map((d, i) => (
                      <div key={i} className="text-[11px] text-gray-700 flex items-center gap-1.5">
                        <span className="text-[#00652c] font-bold">•</span>
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                {canEdit && (
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(s.id, s.headline)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Unique Slug *</label>
                  <input
                    required
                    type="text"
                    value={form.serviceId}
                    onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                    placeholder="advisory"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Icon (Emoji) *</label>
                  <input
                    required
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🌿"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tab Label *</label>
                  <input
                    required
                    type="text"
                    value={form.tabLabel}
                    onChange={(e) => setForm({ ...form, tabLabel: e.target.value })}
                    placeholder="Advisory"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Service Headline *</label>
                <input
                  required
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="Advisory Services"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Short Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={form.shortSummary}
                  onChange={(e) => setForm({ ...form, shortSummary: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Deliverables (one per line)</label>
                <textarea
                  rows={3}
                  value={form.deliverables}
                  onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                  placeholder="Green finance proposals&#10;Climate risk assessments&#10;Baseline studies"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Call to Action Label</label>
                  <input
                    type="text"
                    value={form.cta}
                    onChange={(e) => setForm({ ...form, cta: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
