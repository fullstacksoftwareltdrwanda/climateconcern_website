import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  FileText,
  Users,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAdminAuth } from './AdminAuthContext';

interface AppSummary {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface ConsultantSummary {
  id: string;
  clientName: string;
  title: string;
  country: string;
  status: string;
  createdAt: string;
}

export const AdminDashboardPage: React.FC = () => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState({
    pendingApps: 0,
    totalApps: 0,
    pendingRequests: 0,
    totalRequests: 0,
    teamCount: 0,
    coursesCount: 0,
  });
  const [recentApps, setRecentApps] = useState<AppSummary[]>([]);
  const [recentRequests, setRecentRequests] = useState<ConsultantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [apps, requests, team, courses] = await Promise.all([
          api.get<AppSummary[]>('/applications').catch(() => []),
          api.get<ConsultantSummary[]>('/consultant-requests').catch(() => []),
          api.get<{ id: string }[]>('/team').catch(() => []),
          api.get<{ id: string }[]>('/training').catch(() => []),
        ]);

        setStats({
          pendingApps: apps.filter((a) => a.status === 'PENDING').length,
          totalApps: apps.length,
          pendingRequests: requests.filter((r) => r.status === 'PENDING').length,
          totalRequests: requests.length,
          teamCount: team.length,
          coursesCount: courses.length,
        });

        setRecentApps(apps.slice(0, 5));
        setRecentRequests(requests.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Welcome Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00652c] block mb-1">
            Control Center
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Here is a snapshot of current operations and pending submissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/applications"
            className="px-4 py-2.5 rounded-xl bg-[#00652c] hover:bg-[#00873b] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Applications ({stats.pendingApps} pending)</span>
          </Link>
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Applications */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Pending Applications</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.pendingApps}</div>
          <div className="text-[11px] text-gray-400 mt-1">out of {stats.totalApps} total</div>
        </div>

        {/* Pending Consultant Requests */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Consultant Requests</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</div>
          <div className="text-[11px] text-gray-400 mt-1">out of {stats.totalRequests} total</div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Active Team</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.teamCount}</div>
          <div className="text-[11px] text-gray-400 mt-1">Listed consultants & leaders</div>
        </div>

        {/* Training Courses */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Training Programs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.coursesCount}</div>
          <div className="text-[11px] text-gray-400 mt-1">Published tracks</div>
        </div>
      </div>

      {/* ── Two Column: Recent Applications & Recent Requests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Training Applications */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-base text-gray-900">Recent Course Applications</h2>
              <p className="text-xs text-gray-400">Direct candidate submissions</p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-[#00652c] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading applications...</div>
          ) : recentApps.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No applications received yet.</div>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{app.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{app.course}</div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Consultant Requests */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-base text-gray-900">Recent Consultant Requests</h2>
              <p className="text-xs text-gray-400">Pool allocation requests</p>
            </div>
            <Link
              to="/admin/consultant-requests"
              className="text-xs font-bold text-[#00652c] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading requests...</div>
          ) : recentRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No consultant requests yet.</div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{req.clientName}</div>
                    <div className="text-[11px] text-gray-500 truncate">{req.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {req.country} · {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      req.status === 'FULFILLED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : req.status === 'REVIEWED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
