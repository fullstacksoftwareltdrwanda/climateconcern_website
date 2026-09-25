import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Shield, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth, type AdminUser } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

const SECTIONS = [
  { id: 'applications', label: 'Course Applications' },
  { id: 'consultant_requests', label: 'Consultant Requests' },
  { id: 'team', label: 'Team Members' },
  { id: 'services', label: 'Services' },
  { id: 'training', label: 'Training Programs' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'stats', label: 'Stats & Records' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'legal', label: 'Legal Pages' },
  { id: 'library', label: 'Library & Updates' },
];

export const AdminsSection: React.FC = () => {
  const { admin: currentUser } = useAdminAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    fullAccess: true,
    permissions: {} as Record<string, { view: boolean; edit: boolean; delete: boolean }>,
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await api.get<AdminUser[]>('/admins');
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    const initialPerms: Record<string, { view: boolean; edit: boolean; delete: boolean }> = {};
    SECTIONS.forEach((s) => {
      initialPerms[s.id] = { view: true, edit: true, delete: true };
    });
    setForm({
      name: '',
      email: '',
      password: '',
      fullAccess: true,
      permissions: initialPerms,
    });
    setModalOpen(true);
  };

  const openEditModal = (a: AdminUser) => {
    setEditingAdmin(a);
    const initialPerms: Record<string, { view: boolean; edit: boolean; delete: boolean }> = {};
    SECTIONS.forEach((s) => {
      const p = a.permissions?.[s.id];
      initialPerms[s.id] = {
        view: !!p?.view,
        edit: !!p?.edit,
        delete: !!p?.delete,
      };
    });
    setForm({
      name: a.name,
      email: a.email,
      password: '',
      fullAccess: false,
      permissions: initialPerms,
    });
    setModalOpen(true);
  };

  const handlePermToggle = (section: string, action: 'view' | 'edit' | 'delete') => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [action]: !prev.permissions[section]?.[action],
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        const payload: Record<string, unknown> = {
          name: form.name,
          permissions: form.permissions,
        };
        if (form.password) payload.password = form.password;
        const updated = await api.put<AdminUser>(`/admins/${editingAdmin.id}`, payload);
        setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          fullAccess: form.fullAccess,
          permissions: form.fullAccess ? undefined : form.permissions,
        };
        const created = await api.post<AdminUser>('/admins', payload);
        setAdmins((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingAdmin ? 'Admin updated successfully!' : 'Admin account created successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving admin');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: 'Revoke Admin Account',
      message: `Permanently revoke and delete admin account "${name}"? This administrator will immediately lose all panel access.`,
      confirmText: 'Revoke & Delete',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Admin account "${name}" revoked successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting admin');
    }
  };

  if (!currentUser?.isMainAdmin) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="font-bold text-lg text-gray-800">Access Restricted</h2>
        <p className="text-xs text-gray-500 mt-1">
          Only the Main Administrator has authority to manage admin credentials and roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Access Control & Roles
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Accounts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create staff administrators and configure granular permissions across each website section.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Admin Account</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading admin accounts...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-5">Name & Email</th>
                <th className="py-3.5 px-5">Access Tier</th>
                <th className="py-3.5 px-5">Section Rights</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-gray-900">{a.name}</div>
                    <div className="text-[11px] text-gray-500">{a.email}</div>
                  </td>
                  <td className="py-4 px-5">
                    {a.isMainAdmin ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#00652c] font-bold text-[10px]">
                        ★ Main Admin
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px]">
                        Staff Admin
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {a.isMainAdmin ? (
                      <span className="text-emerald-700 font-medium text-[11px]">
                        Full Unrestricted Access
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {SECTIONS.filter((s) => a.permissions?.[s.id]?.view).map((s) => (
                          <span
                            key={s.id}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px]"
                          >
                            {s.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    {!a.isMainAdmin && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {editingAdmin ? `Configure Rights: ${editingAdmin.name}` : 'Create Admin Account'}
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
                    placeholder="Staff Coordinator"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    required
                    disabled={!!editingAdmin}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="coordinator@climateconcern.rw"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {editingAdmin ? 'New Password (leave empty to keep current)' : 'Account Password *'}
                </label>
                <input
                  required={!editingAdmin}
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              {!editingAdmin && (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.fullAccess}
                      onChange={(e) => setForm({ ...form, fullAccess: e.target.checked })}
                      className="w-4 h-4 rounded text-[#00652c] focus:ring-[#00652c]"
                    />
                    <div>
                      <span className="font-bold text-gray-800 block">Grant Full Access</span>
                      <span className="text-[11px] text-gray-500">
                        Admin will have view, edit, and delete rights across all content and applications.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* Granular permissions table */}
              {(!form.fullAccess || editingAdmin) && (
                <div>
                  <label className="font-bold text-gray-800 block mb-2">
                    Section-by-Section Permissions
                  </label>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-4">Section</th>
                          <th className="py-2.5 px-4 text-center">View</th>
                          <th className="py-2.5 px-4 text-center">Edit / Create</th>
                          <th className="py-2.5 px-4 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {SECTIONS.map((s) => {
                          const p = form.permissions[s.id] || {
                            view: false,
                            edit: false,
                            delete: false,
                          };
                          return (
                            <tr key={s.id} className="hover:bg-gray-50/50">
                              <td className="py-2 px-4 font-semibold text-gray-800">{s.label}</td>
                              <td className="py-2 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.view}
                                  onChange={() => handlePermToggle(s.id, 'view')}
                                  className="w-4 h-4 rounded text-[#00652c] focus:ring-[#00652c]"
                                />
                              </td>
                              <td className="py-2 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.edit}
                                  onChange={() => handlePermToggle(s.id, 'edit')}
                                  className="w-4 h-4 rounded text-[#00652c] focus:ring-[#00652c]"
                                />
                              </td>
                              <td className="py-2 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.delete}
                                  onChange={() => handlePermToggle(s.id, 'delete')}
                                  className="w-4 h-4 rounded text-[#00652c] focus:ring-[#00652c]"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
                  Save Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
