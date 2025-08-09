export function PostGrid({ posts }: { posts: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {posts.map((p) => (
        <div key={p._id} className="relative aspect-square overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.mediaUrl} alt="post" className="w-full h-full object-cover hover:scale-105 transition" />
        </div>
      ))}
    </div>
  );
}