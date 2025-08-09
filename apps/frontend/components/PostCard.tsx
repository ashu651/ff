'use client';
import { Heart } from 'lucide-react';
import { fetchJson } from '../lib/api';

export function PostCard({ post }: { post: any }) {
  async function like() {
    await fetchJson(`/api/posts/${post._id}/like`, { method: 'POST', credentials: 'include' });
  }
  return (
    <article className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 shadow-card">
      <header className="flex items-center gap-3 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.user?.avatarUrl || 'https://placehold.co/40'} alt="avatar" className="w-10 h-10 rounded-full" />
        <div className="font-medium">{post.user?.username || 'user'}</div>
      </header>
      {post.mediaType === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.mediaUrl} alt="media" className="w-full max-h-[700px] object-cover" />
      ) : (
        <video src={post.mediaUrl} controls className="w-full max-h-[700px]" />
      )}
      <div className="p-3 space-y-2">
        <button onClick={like} className="inline-flex items-center gap-1 text-sm hover:text-brand"><Heart size={18}/> Like</button>
        {post.caption && <p>{post.caption}</p>}
        <div className="text-xs text-gray-500">{post.likes?.length || 0} likes • {post.commentsCount || 0} comments</div>
      </div>
    </article>
  );
}