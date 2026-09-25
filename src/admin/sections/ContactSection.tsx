import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';

interface ContactInfo {
  phone: string;
  phoneClean: string;
  email: string;
  physicalAddress: string;
  xHandle: string;
  xUrl: string;
  linkedinHandle: string;
  linkedinUrl: string;
  igHandle: string;
  igUrl: string;
}

export const ContactSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('contact', 'edit');
  const toast = useToast();

  const [form, setForm] = useState<ContactInfo>({
    phone: '',
    phoneClean: '',
    email: '',
    physicalAddress: '',
    xHandle: '',
    xUrl: '',
    linkedinHandle: '',
    linkedinUrl: '',
    igHandle: '',
    igUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await api.get<ContactInfo>('/contact');
        if (data) setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    try {
      setSaving(true);
      setSaved(false);
      await api.put('/contact', form);
      setSaved(true);
      toast.success('Contact info updated successfully!');
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating contact info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center text-xs text-gray-400 border border-gray-200">
        Loading contact information...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
          Reach & Coordinates
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          Contact Information
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Update the global hotline phone, official email, physical headquarters, and social media handles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 text-xs">
        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Contact details updated successfully across the site!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00652c]" />
              <span>Display Phone Number *</span>
            </label>
            <input
              required
              disabled={!canEdit}
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(250) 0788 481439"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1.5">
              Clean Dial Number (tel: URL) *
            </label>
            <input
              required
              disabled={!canEdit}
              type="text"
              value={form.phoneClean}
              onChange={(e) => setForm({ ...form, phoneClean: e.target.value })}
              placeholder="+250788481439"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#00652c]" />
            <span>Official Email Address *</span>
          </label>
          <input
            required
            disabled={!canEdit}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="info@climateconcern.rw"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00652c]" />
            <span>Physical Address (Kigali HQ) *</span>
          </label>
          <textarea
            required
            disabled={!canEdit}
            rows={2}
            value={form.physicalAddress}
            onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
            placeholder="Rusororo, Intare Are Concrete Road, plot 5746 Kigali, Rwanda"
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 mb-4">Social Media Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">X (Twitter) Handle</label>
              <input
                disabled={!canEdit}
                type="text"
                value={form.xHandle}
                onChange={(e) => setForm({ ...form, xHandle: e.target.value })}
                placeholder="@ClimateConcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">X URL</label>
              <input
                disabled={!canEdit}
                type="url"
                value={form.xUrl}
                onChange={(e) => setForm({ ...form, xUrl: e.target.value })}
                placeholder="https://x.com/ClimateConcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">LinkedIn Handle / Name</label>
              <input
                disabled={!canEdit}
                type="text"
                value={form.linkedinHandle}
                onChange={(e) => setForm({ ...form, linkedinHandle: e.target.value })}
                placeholder="@ClimateConcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">LinkedIn URL</label>
              <input
                disabled={!canEdit}
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/climateconcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Instagram Handle</label>
              <input
                disabled={!canEdit}
                type="text"
                value={form.igHandle}
                onChange={(e) => setForm({ ...form, igHandle: e.target.value })}
                placeholder="@ClimateConcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Instagram URL</label>
              <input
                disabled={!canEdit}
                type="url"
                value={form.igUrl}
                onChange={(e) => setForm({ ...form, igUrl: e.target.value })}
                placeholder="https://instagram.com/ClimateConcern"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#00652c] hover:bg-[#00873b] disabled:opacity-50 text-white font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Contact Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
