'use client';
import { useState } from 'react';
import { fetchJson } from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include',
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-card bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Snapzy</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Username or Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-brand text-white rounded-md py-2 hover:bg-brand-dark transition">Sign in</button>
      </form>
      <p className="text-sm text-center mt-4">No account? <Link className="text-brand" href="/register">Sign up</Link></p>
    </div>
  );
}