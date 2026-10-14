import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Copy, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../Toast';
import { defaultPaymentDetails, type PaymentDetails } from '../../data/bossContent';

export const PaymentSettingsCard: React.FC = () => {
  const toast = useToast();
  const [form, setForm] = useState<PaymentDetails>(defaultPaymentDetails);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api.get<PaymentDetails>('/payment-settings');
        if (data && data.momoNumber) {
          setForm(data);
        }
      } catch (err) {
        console.error('Failed to load payment settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaved(false);
      const res = await api.put<PaymentDetails>('/payment-settings', form);
      if (res && res.momoNumber) {
        setForm(res);
      }
      setSaved(true);
      toast.success('Official payment account details updated successfully!');
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update payment settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a859]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c]">
              Tuition & Consultation Payment Coordinates
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Official Receiving Accounts (MoMo & Bank)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            These accounts are displayed on the public website when clients apply for certified training courses or request expert consultants.
          </p>
        </div>
        <span className="self-start sm:self-auto text-[11px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shrink-0">
          Publicly Visible to Clients
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-gray-400">
          Loading payment settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment account settings updated successfully across the website!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Mobile Money (MoMo) Box ── */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    📱
                  </div>
                  <span>Mobile Money (MTN MoMo)</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Local / EAC
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  MoMo Receiving Phone Number *
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={form.momoNumber}
                    onChange={(e) => setForm({ ...form, momoNumber: e.target.value })}
                    placeholder="e.g. 0788481439"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(form.momoNumber, 'MoMo Number')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy number"
                  >
                    {copiedField === 'MoMo Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  MoMo Registered Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.momoName}
                  onChange={(e) => setForm({ ...form, momoName: e.target.value })}
                  placeholder="e.g. Climate Concern Rwanda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
            </div>

            {/* ── Bank Account Box ── */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    🏦
                  </div>
                  <span>Bank Wire / Direct Deposit</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Domestic & Regional
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Bank Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    placeholder="e.g. Equity Bank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Account Number *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={form.bankAccountNumber}
                      onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                      placeholder="e.g. 4002200136744"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(form.bankAccountNumber, 'Bank Account Number')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy account number"
                    >
                      {copiedField === 'Bank Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Account Name / Beneficiary *
                </label>
                <input
                  required
                  type="text"
                  value={form.bankAccountName}
                  onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                  placeholder="e.g. Climate Concern Rwanda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Instructions for Client when Attaching Proof
            </label>
            <textarea
              rows={2}
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              placeholder="e.g. Transfer the fee via MTN Mobile Money or Equity Bank, then attach your proof of payment receipt below."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#00652c]"
            />
          </div>

          {/* ── Client Visual Preview ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Live Preview (How Clients See It on Website Forms):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <div className="text-[11px] text-gray-400 font-bold uppercase">MoMo Receiver</div>
                <div className="text-sm font-extrabold text-[#00652c]">{form.momoNumber || '0788481439'}</div>
                <div className="text-[10px] text-gray-500 font-medium">{form.momoName || 'Climate Concern Rwanda'}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-blue-200 shadow-2xs">
                <div className="text-[11px] text-gray-400 font-bold uppercase">{form.bankName || 'Equity Bank'}</div>
                <div className="text-sm font-extrabold text-blue-900">{form.bankAccountNumber || '4002200136744'}</div>
                <div className="text-[10px] text-gray-500 font-medium">{form.bankAccountName || 'Climate Concern Rwanda'}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00a859] hover:bg-[#00c968] active:scale-95 disabled:opacity-60 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Payment Accounts'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
