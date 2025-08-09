'use client';
import { useEffect, useState } from 'react';
import { fetchJson } from '../../lib/api';
import { PostGrid } from '../../components/PostGrid';

export default function ExplorePage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any>({ users: [], posts: [], hashtags: [] });
  const [trending, setTrending] = useState<any>({ posts: [], hashtags: [] });

  useEffect(() => {
    (async () => {
      const [tp, th] = await Promise.all([
        fetchJson('/api/explore/trending', { credentials: 'include' }),
        fetchJson('/api/explore/hashtags', { credentials: 'include' }),
      ]);
      setTrending({ posts: tp.posts, hashtags: th.hashtags });
    })();
  }, []);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetchJson(`/api/search?q=${encodeURIComponent(q)}`, { credentials: 'include' });
    setResults(res);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2 bg-transparent" placeholder="Search users, hashtags, locations" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="bg-brand text-white rounded-md px-4">Search</button>
      </form>
      {!!results.users.length && (
        <div>
          <h2 className="font-semibold mb-2">Users</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.users.map((u: any) => (
              <div key={u._id} className="p-3 rounded-lg border hover:shadow-card transition">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.avatarUrl || 'https://placehold.co/48'} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-medium">{u.username}</div>
                    <div className="text-xs text-gray-500">{u.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!!results.hashtags.length && (
        <div>
          <h2 className="font-semibold mb-2">Hashtags</h2>
          <div className="flex gap-2 flex-wrap">
            {results.hashtags.map((h: any) => (
              <span key={h._id} className="px-3 py-1 rounded-full border text-sm">#{h.name}</span>
            ))}
          </div>
        </div>
      )}
      <h2 className="font-semibold">Trending</h2>
      <div className="flex gap-2 flex-wrap">
        {trending.hashtags.map((h: any) => (
          <span key={h._id} className="px-3 py-1 rounded-full border text-sm">#{h.name}</span>
        ))}
      </div>
      <PostGrid posts={trending.posts} />
    </div>
  );
}