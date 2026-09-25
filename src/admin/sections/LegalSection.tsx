import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Shield, FileText } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';

interface LegalContent {
  id: string;
  type: 'terms' | 'privacy';
  title: string;
  content: string;
}

export const LegalSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('legal', 'edit');
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
  const [data, setData] = useState<{ terms: LegalContent | null; privacy: LegalContent | null }>({
    terms: null,
    privacy: null,
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchLegal = async () => {
    try {
      setLoading(true);
      const [terms, privacy] = await Promise.all([
        api.get<LegalContent>('/legal/terms').catch(() => null),
        api.get<LegalContent>('/legal/privacy').catch(() => null),
      ]);
      setData({ terms, privacy });
      if (activeTab === 'terms' && terms) {
        setTitle(terms.title);
        setContent(terms.content);
      } else if (activeTab === 'privacy' && privacy) {
        setTitle(privacy.title);
        setContent(privacy.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegal();
  }, []);

  const switchTab = (tab: 'terms' | 'privacy') => {
    setActiveTab(tab);
    const item = data[tab];
    if (item) {
      setTitle(item.title);
      setContent(item.content);
    } else {
      setTitle(tab === 'terms' ? 'Terms and Conditions' : 'Privacy Policy');
      setContent('');
    }
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    try {
      setSaving(true);
      setSaved(false);
      const updated = await api.put<LegalContent>(`/legal/${activeTab}`, { title, content });
      setData((prev) => ({ ...prev, [activeTab]: updated }));
      setSaved(true);
      toast.success('Legal content updated successfully!');
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating legal content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Compliance & Governance
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Legal Content
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage Terms of Use and Privacy Policy documents with full Markdown formatting.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 self-start sm:self-auto">
          <button
            onClick={() => switchTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-white text-[#00652c] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Use</span>
          </button>
          <button
            onClick={() => switchTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-white text-[#00652c] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-5 text-xs">
        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{activeTab === 'terms' ? 'Terms' : 'Privacy Policy'} updated successfully!</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading document...</div>
        ) : (
          <>
            <div>
              <label className="font-bold text-gray-700 block mb-1.5">Page Title *</label>
              <input
                required
                disabled={!canEdit}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60 text-sm font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-700">Document Body (Markdown formatted) *</label>
                <span className="text-[10px] text-gray-400">Supports headers (#, ##), bullet points, and links</span>
              </div>
              <textarea
                required
                disabled={!canEdit}
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter markdown content..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c] disabled:opacity-60 leading-relaxed"
              />
            </div>

            {canEdit && (
              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#00652c] hover:bg-[#00873b] disabled:opacity-50 text-white font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Document'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};
