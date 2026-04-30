'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  ArrowRightLeft,
  History,
  Users,
  GraduationCap,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronLeft,
  LogOut,
  BookOpen,
  Phone,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['agent', 'manager', 'admin'] },
  { href: '/log-transfer', label: 'Log Transfer', icon: ArrowRightLeft, roles: ['agent', 'manager', 'admin'] },
  { href: '/history', label: 'History', icon: History, roles: ['agent', 'manager', 'admin'] },
  { href: '/knowledge', label: 'Knowledge Centre', icon: BookOpen, roles: ['agent', 'manager', 'admin'] },
  { href: '/phonebook', label: 'Phone Book', icon: Phone, roles: ['agent', 'manager', 'admin'] },
  { href: '/team-insights', label: 'Team Insights', icon: Users, roles: ['manager', 'admin'] },
  { href: '/coaching', label: 'Coaching', icon: GraduationCap, roles: ['manager', 'admin'] },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare, roles: ['manager', 'admin'] },
  { href: '/admin', label: 'Admin', icon: Settings, roles: ['admin', 'manager'] },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[#0f1d35] text-white transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L3 7l9 5 9-5-9-5z" />
            <path d="M3 17l9 5 9-5M3 12l9 5 9-5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none">TransferIQ</p>
            <p className="text-xs text-blue-300 mt-0.5">Call Transfer Analytics</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-0.5 px-2">
          {visibleNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200/70 hover:text-white hover:bg-white/10'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-all text-left',
            collapsed && 'justify-center'
          )}
          aria-expanded={userMenuOpen}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-blue-300 capitalize truncate">{user?.role === 'manager' ? 'Team Manager' : user?.role}</p>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-blue-300 transition-transform', userMenuOpen && 'rotate-180')} />
            </>
          )}
        </button>

        {userMenuOpen && !collapsed && (
          <div className="mt-1 py-1 bg-[#1a2d4a] rounded-lg border border-white/10">
            <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-xs text-blue-200 hover:text-white hover:bg-white/10 rounded-md mx-1">
              Profile & Settings
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/10 rounded-md mx-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="w-full mt-2 flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-xs text-blue-300 hover:text-white hover:bg-white/10 transition-all"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );
}
