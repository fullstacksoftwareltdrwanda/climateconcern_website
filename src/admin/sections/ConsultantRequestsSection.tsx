import React, { useState, useEffect } from 'react';
import { Download, FileText, X, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface ConsultantRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  country: string;
  position: string;
  education: string;
  experience: string;
  startMonth: string;
  endMonth: string;
  personDays: string;
  paymentMode: string;
  momoPhone?: string;
  torFilePath?: string;
  torFileName?: string;
  status: 'PENDING' | 'REVIEWED' | 'FULFILLED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

export const ConsultantRequestsSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('consultant_requests', 'edit');
  const toast = useToast();
  const confirm = useConfirm();

  const [requests, setRequests] = useState<ConsultantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<ConsultantRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get<ConsultantRequest[]>('/consultant-requests');
      setRequests(data);
    } catch (err) {
      console.error('Failed to load consultant requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openDetails = (req: ConsultantRequest) => {
    setSelectedReq(req);
    setAdminNotes(req.adminNotes || '');
  };

  const handleUpdateStatus = async (status: 'PENDING' | 'REVIEWED' | 'FULFILLED' | 'REJECTED') => {
    if (!selectedReq) return;

    if (status === 'REJECTED' || status === 'FULFILLED') {
      const isRejected = status === 'REJECTED';
      const ok = await confirm({
        title: isRejected ? 'Reject Consultant Request' : 'Mark Request as Fulfilled',
        message: isRejected
          ? `Are you sure you want to mark the request from "${selectedReq.clientName}" as REJECTED?`
          : `Mark this consultant request from "${selectedReq.clientName}" as FULFILLED?`,
        confirmText: isRejected ? 'Reject Request' : 'Mark Fulfilled',
        variant: isRejected ? 'danger' : 'success',
      });
      if (!ok) return;
    }

    try {
      setUpdating(true);
      const updated = await api.patch<ConsultantRequest>(
        `/consultant-requests/${selectedReq.id}/status`,
        { status, adminNotes }
      );
      setRequests((prev) => prev.map((r) => (r.id === selectedReq.id ? updated : r)));
      setSelectedReq(updated);
      toast.success('Request status updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Consultant Pool Allocation
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Consultant Requests
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Inquiries from partners seeking experts from the Climate Concern East Africa pool.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#00652c] border border-emerald-100">
            Total: {requests.length}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
            Pending: {requests.filter((r) => r.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, title, position, country..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'REVIEWED', 'FULFILLED', 'REJECTED'].map((st) => (
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
          <div className="py-16 text-center text-xs text-gray-400">Loading consultant requests...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No consultant requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-5">Client / Org</th>
                  <th className="py-3.5 px-5">Project / Position</th>
                  <th className="py-3.5 px-5">Country & Days</th>
                  <th className="py-3.5 px-5">ToR File</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900">{r.clientName}</div>
                      <div className="text-[11px] text-gray-500">{r.clientEmail}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-gray-900">{r.title}</div>
                      <div className="text-[11px] text-[#00652c] font-medium">{r.position}</div>
                    </td>
                    <td className="py-4 px-5 text-gray-600">
                      <div>{r.country}</div>
                      <div className="text-[11px] text-gray-400">{r.personDays} person-days</div>
                    </td>
                    <td className="py-4 px-5">
                      {r.torFileName ? (
                        <a
                          href={`http://localhost:4000/api/consultant-requests/${r.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#00652c] hover:underline font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{r.torFileName}</span>
                          <Download className="w-3 h-3 text-gray-400" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No file</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          r.status === 'FULFILLED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : r.status === 'REVIEWED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => openDetails(r)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#00652c] uppercase tracking-wider block mb-1">
                Consultant Pool Assignment
              </span>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                {selectedReq.title}
              </h2>
              <p className="text-xs text-gray-500">
                Submitted on {new Date(selectedReq.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6">
              <div>
                <span className="text-gray-400 font-medium block">Client Name</span>
                <span className="font-bold text-gray-800">{selectedReq.clientName}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Client Email</span>
                <span className="font-bold text-gray-800">{selectedReq.clientEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Position Needed</span>
                <span className="font-bold text-emerald-700">{selectedReq.position}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Country of Intervention</span>
                <span className="font-bold text-gray-800">{selectedReq.country}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Education Required</span>
                <span className="font-bold text-gray-800">{selectedReq.education}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Experience Required</span>
                <span className="font-bold text-gray-800">{selectedReq.experience} Years</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Project Period</span>
                <span className="font-bold text-gray-800">
                  {selectedReq.startMonth} → {selectedReq.endMonth}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Allocated Person-Days</span>
                <span className="font-bold text-gray-800">{selectedReq.personDays} Days</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Payment Method</span>
                <span className="font-bold text-gray-800">
                  {selectedReq.paymentMode}
                  {selectedReq.momoPhone ? ` (${selectedReq.momoPhone})` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Terms of Reference</span>
                {selectedReq.torFileName ? (
                  <a
                    href={`http://localhost:4000/api/consultant-requests/${selectedReq.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#00652c] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {selectedReq.torFileName}</span>
                  </a>
                ) : (
                  <span className="text-gray-400 italic">None attached</span>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Internal Administrative Notes / Assigned Consultant
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Assigned Peter Katanisa for 45 days. Proposal sent to client on Oct 1."
                className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
              />
            </div>

            {/* Status Change Buttons */}
            {canEdit && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500">
                  Current Status: <strong>{selectedReq.status}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus('REVIEWED')}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus('FULFILLED')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
                  >
                    Mark Fulfilled
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus('REJECTED')}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
