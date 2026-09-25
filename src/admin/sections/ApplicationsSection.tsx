import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, Mail, Phone, Download, ShieldCheck, Eye, ExternalLink, X } from 'lucide-react';
import { api, API_BASE, getAuthToken } from '../../lib/api';
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
  const [previewingApp, setPreviewingApp] = useState<Application | null>(null);

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
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/applications/${app.id}/payment-proof`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error || `File download failed (HTTP ${res.status})`);
      }
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
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setPreviewingApp(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3 h-3 shrink-0" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadProof(app)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#00652c] font-bold text-[10px] transition-colors cursor-pointer border border-emerald-200"
                            title={app.paymentProofName || 'Download Receipt'}
                          >
                            <Download className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[85px]">{app.paymentProofName || 'Download'}</span>
                          </button>
                        </div>
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

      {/* ── Payment Proof Preview Modal ── */}
      {previewingApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00652c]" />
                  <span>Payment Proof Document</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Applicant: <strong>{previewingApp.name}</strong> · Tuition: <strong>{previewingApp.amountPaid || '$500 USD / ~675,000 RWF'}</strong>
                </p>
              </div>
              <button
                onClick={() => setPreviewingApp(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-auto my-4 bg-gray-50 rounded-2xl p-4 flex items-center justify-center min-h-[320px]">
              {(() => {
                const token = getAuthToken() || '';
                const previewUrl = `${API_BASE}/applications/${previewingApp.id}/payment-proof?token=${token}&preview=1`;
                const filename = (previewingApp.paymentProofName || '').toLowerCase();
                const isPdf = filename.endsWith('.pdf');

                if (isPdf) {
                  return (
                    <iframe
                      src={previewUrl}
                      title="Payment Proof PDF"
                      className="w-full h-[60vh] rounded-xl border border-gray-200 bg-white"
                    />
                  );
                }

                return (
                  <img
                    src={previewUrl}
                    alt={previewingApp.paymentProofName || 'Payment Proof'}
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallbackEl = document.getElementById('preview-fallback-msg');
                      if (fallbackEl) fallbackEl.style.display = 'block';
                    }}
                  />
                );
              })()}
              <div id="preview-fallback-msg" style={{ display: 'none' }} className="text-center text-xs text-gray-500 p-8">
                <p className="font-semibold text-gray-700 mb-2">Preview not supported directly in browser for this file type.</p>
                <p>Please use the Download button below to inspect the document.</p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-gray-500 truncate max-w-[250px]">
                {previewingApp.paymentProofName || 'Proof Document'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`${API_BASE}/applications/${previewingApp.id}/payment-proof?token=${getAuthToken() || ''}&preview=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleDownloadProof(previewingApp)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00652c] hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
