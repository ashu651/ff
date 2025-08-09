'use client';
import { useEffect, useState } from 'react';
import { fetchJson } from '../../lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [qr, setQr] = useState<string>('');
  const [code, setCode] = useState('');

  useEffect(() => {
    fetchJson('/api/users/me/privacy', { credentials: 'include' }).then((d) => setSettings(d.settings));
  }, []);

  async function togglePrivacy() {
    const next = !settings.isPrivate;
    await fetchJson('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isPrivate: next })
    });
    setSettings({ ...settings, isPrivate: next });
  }

  async function start2FA() {
    const data = await fetchJson('/api/auth/2fa/setup', { method: 'POST', credentials: 'include' });
    setQr(data.qr);
  }
  async function enable2FA() {
    await fetchJson('/api/auth/2fa/enable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ code }) });
    setSettings({ ...settings, twoFactorEnabled: true });
  }
  async function disable2FA() {
    await fetchJson('/api/auth/2fa/disable', { method: 'POST', credentials: 'include' });
    setSettings({ ...settings, twoFactorEnabled: false });
    setQr('');
    setCode('');
  }

  if (!settings) return <p>Loading…</p>;
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Private account</div>
            <div className="text-sm text-gray-500">Only approved followers can see your content</div>
          </div>
          <button onClick={togglePrivacy} className="px-3 py-1 rounded-md border">{settings.isPrivate ? 'Disable' : 'Enable'}</button>
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Two-Factor Authentication</div>
            <div className="text-sm text-gray-500">Protect your account with an authenticator app</div>
          </div>
          {settings.twoFactorEnabled ? (
            <button onClick={disable2FA} className="px-3 py-1 rounded-md border">Disable</button>
          ) : (
            <button onClick={start2FA} className="px-3 py-1 rounded-md border">Set up</button>
          )}
        </div>
        {qr && !settings.twoFactorEnabled && (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR" className="w-48 h-48" />
            <div className="flex gap-2 items-center">
              <input className="rounded-md border px-3 py-2 bg-transparent" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} />
              <button onClick={enable2FA} className="px-3 py-2 rounded-md bg-brand text-white">Enable</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}