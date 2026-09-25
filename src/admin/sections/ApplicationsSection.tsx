import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, Mail, Phone, Download, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface Application {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course: string;
  amountPaid?: string;
  termsAccepted?: boolean;
  paymentProofPath?: string | null;
  paymentProofName?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const ApplicationsSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('applications', 'edit');
  const toast = useToast();
  const confirm = useConfirm();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.get<Application[]>('/applications');
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const isApproved = status === 'APPROVED';
    const ok = await confirm({
      title: isApproved ? 'Approve Course Application' : 'Reject Course Application',
      message: `Are you sure you want to mark this application as ${status}? An automated email notification will be delivered to the applicant.`,
      confirmText: isApproved ? 'Approve & Notify' : 'Reject & Notify',
      variant: isApproved ? 'success' : 'danger',
    });
    if (!ok) return;

    try {
      setUpdatingId(id);
      await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      toast.success(`Application ${status.toLowerCase()} successfully!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadProof = async (app: Application) => {
    try {
      const token = localStorage.getItem('cc_admin_token');
      const res = await fetch(`http://localhost:4000/api/applications/${app.id}/payment-proof`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Proof file could not be downloaded');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = app.paymentProofName || `payment-proof-${app.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error downloading payment proof');
    }
  };

  const filtered = applications.filter((app) => {
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Student Intake
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Training Applications
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review and approve candidate enrollments for Climate Concern certified courses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#00652c] border border-emerald-100">
            Total: {applications.length}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
            Pending: {applications.filter((a) => a.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or course..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                filterStatus === st
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No applications match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-5">Applicant</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Selected Course</th>
                  <th className="py-3.5 px-5">Tuition & Proof</th>
                  <th className="py-3.5 px-5">Applied On</th>
                  <th className="py-3.5 px-5">Status</th>
                  {canEdit && <th className="py-3.5 px-5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900">{app.name}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{app.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {app.phone ? (
                        <div className="text-gray-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{app.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No phone</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-gray-800">{app.course}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-gray-900 text-[11px]">
                        {app.amountPaid || '$500 USD / ~675,000 RWF'}
                      </div>
                      {app.termsAccepted && (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>2-Phase Terms Accepted</span>
                        </div>
                      )}
                      {app.paymentProofPath ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadProof(app)}
                          className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#00652c] font-bold text-[10px] transition-colors cursor-pointer border border-emerald-200"
                        >
                          <Download className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[120px]">{app.paymentProofName || 'Download Receipt'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic block mt-0.5">No receipt attached</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-gray-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {app.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        <span>{app.status}</span>
                      </span>
                    </td>
                    {canEdit && (
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {updatingId === app.id ? (
                          <span className="text-[11px] text-gray-400">Updating...</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {app.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'APPROVED')}
                                className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {app.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
