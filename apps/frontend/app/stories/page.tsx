'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../../lib/api';

export default function StoriesPage() {
  const { data } = useQuery({ queryKey: ['stories'], queryFn: () => fetchJson('/api/stories', { credentials: 'include' }) });
  const stories = data?.stories || [];
  return (
    <div className="flex gap-4 overflow-x-auto py-2">
      {stories.map((s: any) => (
        <div key={s._id} className="w-28 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.mediaUrl} alt="story" className="w-28 h-28 rounded-full object-cover" />
          <div className="text-xs mt-1 truncate">{s.user?.username}</div>
        </div>
      ))}
      {!stories.length && <p className="text-gray-500">No stories yet</p>}
    </div>
  );
}