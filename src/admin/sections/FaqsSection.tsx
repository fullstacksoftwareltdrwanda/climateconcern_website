import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, HelpCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export const FaqsSection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('faqs', 'edit');
  const canDelete = hasPermission('faqs', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    order: 0,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await api.get<FAQ[]>('/faqs');
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setForm({ question: '', answer: '', order: faqs.length });
    setModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setForm({ question: faq.question, answer: faq.answer, order: faq.order });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const updated = await api.put<FAQ>(`/faqs/${editingFaq.id}`, form);
        setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      } else {
        const created = await api.post<FAQ>('/faqs', form);
        setFaqs((prev) => [...prev, created]);
      }
      setModalOpen(false);
      toast.success(editingFaq ? 'FAQ updated successfully!' : 'FAQ added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving FAQ');
    }
  };

  const handleDelete = async (id: string, questionText?: string) => {
    const ok = await confirm({
      title: 'Delete FAQ',
      message: questionText
        ? `Are you sure you want to delete the FAQ: "${questionText}"?`
        : 'Are you sure you want to delete this FAQ question? This action cannot be undone.',
      confirmText: 'Delete FAQ',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success('FAQ deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Questions & Support
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage FAQs displayed across the website accordion components.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-xs text-gray-400 border border-gray-200">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center text-xs text-gray-400 border border-gray-200">
            No FAQs found.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00652c] shrink-0" />
                  <h3 className="font-bold text-sm text-gray-900">{faq.question}</h3>
                </div>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {canEdit && (
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(faq.id)}
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Question *</label>
                <input
                  required
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="How quickly will your team respond?"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="We reply within 24 working hours..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
