'use client';
import { useState } from 'react';
import { fetchJson } from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, name, password }),
        credentials: 'include',
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-card bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-brand text-white rounded-md py-2 hover:bg-brand-dark transition">Sign up</button>
      </form>
      <p className="text-sm text-center mt-4">Already have an account? <Link className="text-brand" href="/login">Sign in</Link></p>
    </div>
  );
}