import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, BarChart3 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface Stat {
  id: string;
  statId: string;
  label: string;
  value: string;
  unit: string;
  tag: string;
  order: number;
}

export const StatsSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('stats', 'edit');
  const canDelete = hasPermission('stats', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);

  const [form, setForm] = useState({
    statId: '',
    label: '',
    value: '',
    unit: '',
    tag: '',
    order: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.get<Stat[]>('/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openCreateModal = () => {
    setEditingStat(null);
    setForm({ statId: '', label: '', value: '', unit: '', tag: '', order: stats.length });
    setModalOpen(true);
  };

  const openEditModal = (stat: Stat) => {
    setEditingStat(stat);
    setForm({
      statId: stat.statId,
      label: stat.label,
      value: stat.value,
      unit: stat.unit,
      tag: stat.tag,
      order: stat.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      statId: form.statId.toLowerCase().replace(/\s+/g, '-'),
      order: Number(form.order),
    };

    try {
      if (editingStat) {
        const updated = await api.put<Stat>(`/stats/${editingStat.id}`, payload);
        setStats((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await api.post<Stat>('/stats', payload);
        setStats((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingStat ? 'Stat updated successfully!' : 'Stat added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving stat');
    }
  };

  const handleDelete = async (id: string, label: string) => {
    const ok = await confirm({
      title: 'Delete Metric Stat',
      message: `Are you sure you want to delete the metric "${label}"? This action cannot be undone.`,
      confirmText: 'Delete Stat',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/stats/${id}`);
      setStats((prev) => prev.filter((s) => s.id !== id));
      toast.success(`Metric "${label}" deleted successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting stat');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Impact & Metrics
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Stats & Records
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage impact statistics (carbon reduced, projects delivered, districts reached) on the home and about pages.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stat Metric</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading stats...</div>
        ) : stats.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">No stats found.</div>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-400">slug: {stat.statId}</span>
                  <BarChart3 className="w-4 h-4 text-[#00652c]" />
                </div>
                <div className="text-3xl font-display font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-bold text-[#00652c] mt-0.5">{stat.unit}</div>
                <div className="text-xs font-semibold text-gray-800 mt-2">{stat.label}</div>
                <p className="text-[11px] text-gray-500 mt-1">{stat.tag}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-1.5">
                {canEdit && (
                  <button
                    onClick={() => openEditModal(stat)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(stat.id, stat.label)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {editingStat ? 'Edit Stat Metric' : 'Add Stat Metric'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Slug Identifier *</label>
                  <input
                    required
                    type="text"
                    value={form.statId}
                    onChange={(e) => setForm({ ...form, statId: e.target.value })}
                    placeholder="carbon"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Display Value *</label>
                  <input
                    required
                    type="text"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="1.4M+"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Unit / Measurement *</label>
                  <input
                    required
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="Tons of CO₂"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Headline Label *</label>
                <input
                  required
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Carbon Reduced & Measured"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Verification / Subtitle Tag *</label>
                <input
                  required
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Verified by international carbon registries"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
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
                  Save Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
