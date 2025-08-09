'use client';
import { Heart, Bookmark } from 'lucide-react';
import { fetchJson } from '../lib/api';
import { useState } from 'react';

export function PostCard({ post }: { post: any }) {
  const [saved, setSaved] = useState<boolean>(false);
  async function like() {
    await fetchJson(`/api/posts/${post._id}/like`, { method: 'POST', credentials: 'include' });
  }
  async function toggleSave() {
    if (saved) {
      await fetchJson(`/api/users/saved/${post._id}`, { method: 'DELETE', credentials: 'include' });
      setSaved(false);
    } else {
      await fetchJson(`/api/users/saved/${post._id}`, { method: 'POST', credentials: 'include' });
      setSaved(true);
    }
  }
  return (
    <article className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 shadow-card">
      <header className="flex items-center gap-3 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.user?.avatarUrl || 'https://placehold.co/40'} alt="avatar" className="w-10 h-10 rounded-full" />
        <div className="font-medium">{post.user?.username || 'user'}</div>
      </header>
      {post.media?.length ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.media[0].url} alt="media" className="w-full max-h-[700px] object-cover" />
      ) : post.mediaType === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.mediaUrl} alt="media" className="w-full max-h-[700px] object-cover" />
      ) : (
        <video src={post.mediaUrl} controls className="w-full max-h-[700px]" />
      )}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3">
          <button onClick={like} className="inline-flex items-center gap-1 text-sm hover:text-brand"><Heart size={18}/> Like</button>
          <button onClick={toggleSave} className="inline-flex items-center gap-1 text-sm hover:text-brand"><Bookmark size={18}/> {saved ? 'Saved' : 'Save'}</button>
        </div>
        {post.caption && <p>{post.caption}</p>}
        <div className="text-xs text-gray-500">{post.likes?.length || 0} likes • {post.commentsCount || 0} comments</div>
      </div>
    </article>
  );
}