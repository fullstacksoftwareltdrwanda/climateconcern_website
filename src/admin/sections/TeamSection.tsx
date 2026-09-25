import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  isFounder: boolean;
  initials: string;
  image?: string;
  bio?: string;
  education: string[];
  keyAreas: string[];
  order: number;
}

export const TeamSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('team', 'edit');
  const canDelete = hasPermission('team', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: '',
    initials: '',
    image: '',
    isFounder: false,
    bio: '',
    education: '',
    keyAreas: '',
    order: 0,
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await api.get<TeamMember[]>('/team');
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setForm({
      name: '',
      role: '',
      initials: '',
      image: '',
      isFounder: false,
      bio: '',
      education: '',
      keyAreas: '',
      order: members.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      initials: member.initials,
      image: member.image || '',
      isFounder: member.isFounder,
      bio: member.bio || '',
      education: (member.education || []).join('\n'),
      keyAreas: (member.keyAreas || []).join('\n'),
      order: member.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      role: form.role,
      initials: form.initials || form.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      image: form.image.trim() || undefined,
      isFounder: form.isFounder,
      bio: form.bio,
      education: form.education.split('\n').map((s) => s.trim()).filter(Boolean),
      keyAreas: form.keyAreas.split('\n').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order),
    };

    try {
      if (editingMember) {
        const updated = await api.put<TeamMember>(`/team/${editingMember.id}`, payload);
        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      } else {
        const created = await api.post<TeamMember>('/team', payload);
        setMembers((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingMember ? 'Team member updated successfully!' : 'Team member added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving team member');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: 'Delete Team Member',
      message: `Are you sure you want to permanently delete "${name}" from the team? This action cannot be undone.`,
      confirmText: 'Delete Member',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/team/${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success(`"${name}" removed from the team`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            People & Experts
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Team Members
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage consultants, leadership, and founder bios displayed on Who We Are and About pages.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading team...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">No team members found.</div>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-emerald-50 text-[#00652c] font-bold text-sm flex items-center justify-center border border-emerald-100 shrink-0 shadow-2xs">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      m.initials
                    )}
                  </div>
                  {m.isFounder && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>Founder</span>
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900 leading-snug">{m.name}</h3>
                <p className="text-xs text-[#00652c] font-semibold mb-3">{m.role}</p>
                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {m.bio || 'No biography available.'}
                </p>

                {m.keyAreas && m.keyAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.keyAreas.slice(0, 3).map((area, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                {canEdit && (
                  <button
                    onClick={() => openEditModal(m)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(m.id, m.name)}
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
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Role / Position *</label>
                  <input
                    required
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initials (max 3)</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={form.initials}
                    onChange={(e) => setForm({ ...form, initials: e.target.value })}
                    placeholder="JN"
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
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFounder}
                      onChange={(e) => setForm({ ...form, isFounder: e.target.checked })}
                      className="w-4 h-4 rounded text-[#00652c] focus:ring-[#00652c]"
                    />
                    <span className="font-bold text-gray-700">Founder Flag</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">Member Photo URL</label>
                  <span className="text-[10px] text-gray-400">e.g. /images/jean.jpg</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover object-top" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold">{form.initials || 'No Img'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/images/jean.jpg"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="text-[10px] text-gray-400 font-medium">Quick Presets:</span>
                      {[
                        { label: 'Jean', path: '/images/jean.jpg' },
                        { label: 'Peter', path: '/images/peter.jpg' },
                        { label: 'Alice', path: '/images/alice.jpg' },
                        { label: 'Dieudonné', path: '/images/dieudonne.jpg' },
                      ].map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setForm({ ...form, image: preset.path })}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#00652c] font-medium border border-emerald-200 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                      {form.image && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: '' })}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium border border-rose-200 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Biography / Overview</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Key Practice Areas (one per line)
                </label>
                <textarea
                  rows={2}
                  value={form.keyAreas}
                  onChange={(e) => setForm({ ...form, keyAreas: e.target.value })}
                  placeholder="Article 6 of Paris Agreement&#10;Carbon Accounting&#10;Green Climate Fund"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Education & Credentials (one per line)
                </label>
                <textarea
                  rows={2}
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  placeholder="MSc in Climate Resilience — Andrews University&#10;BSc in Geography — University of Rwanda"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
