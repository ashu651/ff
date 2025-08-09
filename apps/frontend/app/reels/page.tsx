'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../../lib/api';

export default function ReelsPage() {
  const { data } = useQuery({ queryKey: ['reels'], queryFn: () => fetchJson('/api/posts/feed', { credentials: 'include' }) });
  const posts = (data?.posts || []).filter((p: any) => p.mediaType === 'video');
  return (
    <div className="grid gap-6">
      {posts.map((p: any) => (
        <video key={p._id} src={p.mediaUrl} controls className="w-full rounded-xl shadow-card" />
      ))}
      {!posts.length && <p className="text-gray-500">No reels yet</p>}
    </div>
  );
}