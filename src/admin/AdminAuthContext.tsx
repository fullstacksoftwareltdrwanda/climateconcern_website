import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../lib/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isMainAdmin: boolean;
  permissions: Record<string, { view: boolean; edit: boolean; delete: boolean }>;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (token: string, adminUser: AdminUser) => void;
  logout: () => void;
  updateAdmin: (data: Partial<AdminUser>) => void;
  hasPermission: (section: string, action?: 'view' | 'edit' | 'delete') => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.get<AdminUser>('/auth/me')
      .then((data) => setAdmin(data))
      .catch(() => {
        removeAuthToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token: string, adminUser: AdminUser) => {
    setAuthToken(token);
    setAdmin(adminUser);
  };

  const logout = () => {
    removeAuthToken();
    setAdmin(null);
  };

  const updateAdmin = (data: Partial<AdminUser>) => {
    setAdmin((prev) => (prev ? { ...prev, ...data } : null));
  };

  const hasPermission = (section: string, action: 'view' | 'edit' | 'delete' = 'view'): boolean => {
    if (!admin) return false;
    if (admin.isMainAdmin) return true;
    const perms = admin.permissions?.[section];
    return !!perms?.[action];
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, updateAdmin, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};
