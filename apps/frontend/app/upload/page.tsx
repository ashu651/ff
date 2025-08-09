'use client';
import { useState } from 'react';
import { fetchJson, uploadFile } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const upload = await uploadFile(isVideo ? '/api/uploads/video' : '/api/uploads/image', file);
    await fetchJson('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ caption, mediaUrl: upload.url, mediaType: isVideo ? 'video' : 'image' }),
    });
    router.push('/');
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-4 p-6 rounded-xl border">
        <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <textarea className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button disabled={!file} className="bg-brand text-white rounded-md px-4 py-2 disabled:opacity-50">Upload</button>
      </form>
    </div>
  );
}