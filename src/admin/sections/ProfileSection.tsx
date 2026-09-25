import React, { useState } from 'react';
import { User, Mail, Lock, Save, Send, CheckCircle2 } from 'lucide-react';
import { api, setAuthToken } from '../../lib/api';
import { useAdminAuth, type AdminUser } from '../AdminAuthContext';
import { useToast } from '../Toast';

export const ProfileSection: React.FC = () => {
  const { admin, updateAdmin } = useAdminAuth();
  const toast = useToast();

  const [nameVal, setNameVal] = useState(admin?.name ?? '');
  const [emailVal, setEmailVal] = useState(admin?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Email test state
  const [testEmailAddress, setTestEmailAddress] = useState(admin?.email ?? '');
  const [testingMail, setTestingMail] = useState(false);
  const [mailTestSuccess, setMailTestSuccess] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim() || !emailVal.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.put<{ message: string; admin: AdminUser; token?: string }>('/auth/profile', {
        name: nameVal.trim(),
        email: emailVal.trim(),
      });
      if (res.token) {
        setAuthToken(res.token);
      }
      if (res.admin) {
        updateAdmin(res.admin);
      } else {
        updateAdmin({ name: nameVal.trim(), email: emailVal.trim() });
      }
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      toast.error('All password fields are required');
      return;
    }
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPw.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/profile', { currentPassword: currentPw, newPassword: newPw });
      toast.success('Password updated successfully!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error changing password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      toast.error('Please enter a recipient email address');
      return;
    }
    setTestingMail(true);
    setMailTestSuccess(null);
    try {
      const res = await api.post<{ success: boolean; message: string }>('/auth/test-email', {
        email: testEmailAddress.trim(),
      });
      toast.success(res.message || 'Test email sent successfully!');
      setMailTestSuccess(res.message || `Test email dispatched to ${testEmailAddress.trim()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send test email');
    } finally {
      setTestingMail(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account credentials, password, and verify system mail configuration.
        </p>
      </div>

      {/* Profile Info */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <User className="w-4 h-4 text-[#00a859]" /> Account Information
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
              placeholder="admin@climateconcern.rw"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="flex items-center gap-2 px-4 py-2 bg-[#00a859] hover:bg-[#00652c] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {savingProfile ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#00a859]" /> Change Password
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Min. 6 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
            placeholder="Repeat new password"
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="flex items-center gap-2 px-4 py-2 bg-[#00a859] hover:bg-[#00652c] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5" />
          {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* SMTP Email Diagnostics */}
      <form onSubmit={handleSendTestEmail} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#00a859]" /> Verify Email Notifications (SMTP)
        </h2>
        <p className="text-xs text-gray-500">
          Send a test email to verify that applicant confirmations and admin alerts are working correctly.
        </p>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]/40"
              placeholder="your-email@gmail.com"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={testingMail}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          {testingMail ? 'Sending Test Email...' : 'Send Test Email'}
        </button>
        {mailTestSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mailTestSuccess}</span>
          </div>
        )}
      </form>
    </div>
  );
};

