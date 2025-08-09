import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      const url = `${API}/api/v1/posts/feed${pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : ''}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loaderRef.current; if (!el || !hasNextPage) return;
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) fetchNextPage(); });
    io.observe(el); return () => io.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (status === 'pending') return <p>Loading…</p>;
  if (status === 'error') return <p>Failed to load feed</p>;
  const posts = data?.pages.flatMap((p: any) => p.posts) ?? [];
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Snapzy</h1>
      {posts.map((p: any) => (
        <article key={p._id} className="border rounded-lg p-3">
          <div className="font-medium">{p.author?.username || 'User'}</div>
          <p className="mt-2 text-sm">{p.caption}</p>
        </article>
      ))}
      {hasNextPage && <div ref={loaderRef} className="py-6 text-center text-sm text-gray-500">{isFetchingNextPage ? 'Loading…' : 'Load more'}</div>}
    </main>
  );
}