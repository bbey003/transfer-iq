'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { success } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name });
    setSaving(false);
    success('Profile updated', 'Your changes have been saved.');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Profile & Settings" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-xl mx-auto space-y-5">
          {/* Avatar */}
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">
                  {user?.role} · {user?.role === 'agent' ? (user?.brid ?? user?.aid) : user?.aid}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input label="Email" value={user?.email ?? ''} disabled hint="Email cannot be changed for internal accounts." />
              {user?.role === 'agent'
                ? <Input label="BRID" value={user?.brid ?? user?.aid ?? ''} disabled hint="Your Barclays Role ID." />
                : <Input label="AID" value={user?.aid ?? ''} disabled />
              }

              <Button loading={saving} onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>

          {/* Preferences */}
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Email me when a transfer is flagged', defaultOn: true },
                { label: 'Email me about coaching sessions', defaultOn: true },
                { label: 'In-app alerts for pending reviews', defaultOn: true },
              ].map((pref) => (
                <label key={pref.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{pref.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={pref.defaultOn}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </Card>

          {/* Danger zone */}
          <Card>
            <h2 className="text-base font-semibold text-red-600 mb-3">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-3">Permanently delete your account data from this system.</p>
            <Button variant="danger" size="sm">Request Account Deletion</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
