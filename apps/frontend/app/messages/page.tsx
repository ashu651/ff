'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../../lib/api';

export default function MessagesPage() {
  const { data } = useQuery({ queryKey: ['conversations'], queryFn: () => fetchJson('/api/messages/conversations', { credentials: 'include' }) });
  const conversations = data?.conversations || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 border rounded-lg overflow-hidden">
        <div className="p-3 font-semibold border-b">Conversations</div>
        <ul>
          {conversations.map((c: any) => (
            <li key={c._id} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
              {c.members.map((m: any) => m.username).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2 border rounded-lg min-h-[300px] flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    </div>
  );
}