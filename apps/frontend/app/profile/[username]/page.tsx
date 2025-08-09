'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../../../lib/api';
import { useParams } from 'next/navigation';
import { PostGrid } from '../../../components/PostGrid';

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { data } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchJson(`/api/users/${username}`, { credentials: 'include' }),
  });
  const { data: posts } = useQuery({
    queryKey: ['userPosts', username],
    queryFn: () => fetchJson(`/api/posts/user/${username}`, { credentials: 'include' }),
  });
  const user = data?.user;
  return (
    <div className="space-y-6">
      {user && (
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl || 'https://placehold.co/96x96'} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-sm text-gray-500">{user.name}</p>
            <p className="mt-2 max-w-xl text-sm">{user.bio}</p>
          </div>
        </div>
      )}
      <PostGrid posts={posts?.posts || []} />
    </div>
  );
}