import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';
import { useConfirm } from '../ConfirmDialog';

interface LibraryItem {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  date?: string;
  link?: string;
  tag?: string;
  order: number;
}

interface LibraryCategory {
  id: string;
  catId: string;
  title: string;
  tagline: string;
  icon: string;
  items: LibraryItem[];
}

export const LibrarySection: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('library', 'edit');
  const canDelete = hasPermission('library', 'delete');
  const toast = useToast();
  const confirm = useConfirm();

  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);

  const [itemForm, setItemForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    date: '',
    link: '',
    tag: '',
    order: 0,
  });

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const data = await api.get<LibraryCategory[]>('/library');
      setCategories(data);
      if (data.length > 0 && !selectedCatId) {
        setSelectedCatId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const openAddItemModal = () => {
    if (!currentCategory) return;
    setEditingItem(null);
    setItemForm({
      categoryId: currentCategory.id,
      title: '',
      description: '',
      date: '',
      link: '',
      tag: '',
      order: currentCategory.items.length,
    });
    setItemModalOpen(true);
  };

  const openEditItemModal = (item: LibraryItem) => {
    setEditingItem(item);
    setItemForm({
      categoryId: item.categoryId,
      title: item.title,
      description: item.description,
      date: item.date || '',
      link: item.link || '',
      tag: item.tag || '',
      order: item.order,
    });
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await api.put<LibraryItem>(`/library/items/${editingItem.id}`, itemForm);
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((it) => (it.id === updated.id ? updated : it)),
          }))
        );
      } else {
        const created = await api.post<LibraryItem>('/library/items', itemForm);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === created.categoryId ? { ...cat, items: [...cat.items, created] } : cat
          )
        );
      }
      setItemModalOpen(false);
      toast.success(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error saving library item');
    }
  };

  const handleDeleteItem = async (itemId: string, title: string) => {
    const ok = await confirm({
      title: 'Delete Library Resource',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete Item',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await api.delete(`/library/items/${itemId}`);
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.filter((it) => it.id !== itemId),
        }))
      );
      toast.success(`"${title}" deleted successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Knowledge & Media
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Library & Publications
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage podcasts (video discussions), research publications, and company updates.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={openAddItemModal}
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item to {currentCategory?.title || 'Library'}</span>
          </button>
        )}
      </div>

      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              selectedCatId === cat.id
                ? 'bg-[#00652c] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10">
              {cat.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading library...</div>
        ) : !currentCategory || currentCategory.items.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            No items in this category yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentCategory.items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    {item.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00652c] text-[10px] font-bold border border-emerald-100">
                        {item.tag}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[10px] text-gray-400">· {item.date}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#00652c] hover:underline font-semibold pt-1"
                    >
                      <span>{item.link}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {canEdit && (
                    <button
                      onClick={() => openEditItemModal(item)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setItemModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'} to {currentCategory.title}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Item Title *</label>
                <input
                  required
                  type="text"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Episode title, paper name, or article..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={itemForm.tag}
                    onChange={(e) => setItemForm({ ...itemForm, tag: e.target.value })}
                    placeholder="Video Discussion / Policy Brief"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Date or Edition Label</label>
                  <input
                    type="text"
                    value={itemForm.date}
                    onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })}
                    placeholder="Recent Episode / 2025"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  External URL / Video / Document Link
                </label>
                <input
                  type="url"
                  value={itemForm.link}
                  onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white font-bold shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
