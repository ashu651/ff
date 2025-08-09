'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';
import { PostCard } from '../components/PostCard';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam as string);
      return fetchJson(`/api/posts/feed?${params.toString()}`, { credentials: 'include' });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (status === 'pending') return <p>Loading feed…</p>;
  if (status === 'error') return <p>Failed to load feed</p>;

  const posts = data?.pages.flatMap((p: any) => p.posts) ?? [];

  return (
    <div className="grid grid-cols-1 gap-6">
      {posts.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
      {hasNextPage && (
        <div ref={loaderRef} className="py-6 text-center text-sm text-gray-500">
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </div>
      )}
    </div>
  );
}