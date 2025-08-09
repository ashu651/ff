'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../../lib/api';

export default function NotificationsPage() {
  const { data } = useQuery({ queryKey: ['notifications'], queryFn: () => fetchJson('/api/notifications', { credentials: 'include' }) });
  const notifications = data?.notifications || [];
  return (
    <div className="space-y-3">
      {notifications.map((n: any) => (
        <div key={n._id} className="p-3 rounded-lg border">
          <span className="font-medium">{n.type}</span> from {n.fromUser?.username}
        </div>
      ))}
      {!notifications.length && <p className="text-gray-500">No notifications</p>}
    </div>
  );
}