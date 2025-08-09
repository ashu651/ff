import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    try {
      await axios.post(`${API}/api/v1/auth/register`, { username, email, password, name }, { withCredentials: true });
      window.location.href = '/';
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button className="w-full bg-black text-white rounded py-2">Sign up</button>
      </form>
    </main>
  );
}