'use client';

import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = NOTIFICATIONS.filter((n) => !n.isRead && n.userId === user?.id).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-56">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search transfers..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 w-full focus:outline-none"
            aria-label="Search"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-30 w-80 bg-white rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={n.actionUrl ?? '#'}
                        onClick={() => setNotifOpen(false)}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors',
                          !n.isRead && 'bg-blue-50/40'
                        )}
                      >
                        <span className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          n.isRead ? 'bg-gray-300' : 'bg-blue-500'
                        )} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                  <Link href="/notifications" className="text-xs text-blue-600 hover:underline" onClick={() => setNotifOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
