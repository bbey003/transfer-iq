'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '@/types';
import { CURRENT_USER } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'alex.carter@transferiq.internal': {
    password: 'manager123',
    user: CURRENT_USER,
  },
  'jessica.lee@transferiq.internal': {
    password: 'agent123',
    user: {
      id: 'u-101',
      name: 'Jessica Lee',
      email: 'jessica.lee@transferiq.internal',
      role: 'agent',
      aid: 'AID-87321',
      brid: 'BRID-10421',
      department: 'Operations',
      status: 'active',
      createdAt: '2024-02-01',
    },
  },
  'admin@transferiq.internal': {
    password: 'admin123',
    user: {
      id: 'u-admin',
      name: 'Admin User',
      email: 'admin@transferiq.internal',
      role: 'admin',
      aid: 'AID-00000',
      department: 'IT',
      status: 'active',
      createdAt: '2024-01-01',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tiq_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('tiq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const entry = MOCK_USERS[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }
    setUser(entry.user);
    localStorage.setItem('tiq_user', JSON.stringify(entry.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiq_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('tiq_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRequireRole(roles: UserRole[]) {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
}
