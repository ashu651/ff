import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function Login() {
  const [emailOrUsername, setId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    try {
      await axios.post(`${API}/api/v1/auth/login`, { emailOrUsername, password }, { withCredentials: true });
      window.location.href = '/';
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email or username" value={emailOrUsername} onChange={(e) => setId(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button className="w-full bg-black text-white rounded py-2">Sign in</button>
      </form>
    </main>
  );
}