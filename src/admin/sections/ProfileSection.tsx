import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { useAdminAuth } from '../AdminAuthContext';
import { useToast } from '../Toast';

export const ProfileSection: React.FC = () => {
  const { admin } = useAdminAuth();
  const toast = useToast();

  const [nameVal, setNameVal] = useState(admin?.name ?? '');
  const [emailVal, setEmailVal] = useState(admin?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim() || !emailVal.trim()) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      await api.patch('/auth/profile', { name: nameVal, email: emailVal });
      toast.success('Profile updated! Please log in again if you changed your email.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating profile');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) { toast.error('All password fields are required'); return; }
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await api.patch('/auth/profile', { currentPassword: currentPw, newPassword: newPw });
      toast.success('Password changed successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error changing password');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your name, email address, and password.</p>
      </div>

      {/* Profile Info */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2"><User className="w-4 h-4 text-[#00a859]" /> Account Information</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text" value={nameVal} onChange={e => setNameVal(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email" value={emailVal} onChange={e => setEmailVal(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
              placeholder="admin@climateconcern.rw"
            />
          </div>
        </div>
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#00a859] hover:bg-[#00652c] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Lock className="w-4 h-4 text-[#00a859]" /> Change Password</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
          <input
            type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
          <input
            type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Min. 6 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Repeat new password"
          />
        </div>
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#00a859] hover:bg-[#00652c] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5" />{saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};
