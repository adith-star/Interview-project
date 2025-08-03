'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createSupabaseClientWithToken } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


const tierPriority = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
} as const;

export default function ActualEventsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseClientWithToken> | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userTier = (user?.publicMetadata?.tier as keyof typeof tierPriority) || 'free';
  const userTierLevel = tierPriority[userTier];

  // Initialize Supabase client with token
  useEffect(() => {
    const setupClient = async () => {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        setSupabase(createSupabaseClientWithToken(token));

        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);
        console.log('User Tier from JWT:', payload?.tier);
      } else {
        console.warn('No Clerk token found');
      }
    };
    setupClient();
  }, [getToken]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !user) router.push('/sign-in');
  }, [isLoaded, user]);

  // Fetch events
  useEffect(() => {
    if (!supabase || !user) return;

    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('events').select('*');
      if (error) setError(error.message);
      else setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, [supabase, user]);

  const upgradeTier = async () => {
    const newTier = prompt('Enter new tier: free, silver, gold, platinum');
    if (!newTier || !(newTier in tierPriority)) return alert('Invalid tier');

    const token = await getToken();
    const res = await fetch('/api/upgrade-tier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tier: newTier }),
    });

    res.ok ? location.reload() : alert('Tier upgrade failed');
  };

  if (!isLoaded || loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Events</h1>
        <button
          onClick={upgradeTier}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upgrade Tier
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventTierLevel = tierPriority[event.tier];
          const accessible = eventTierLevel <= userTierLevel;

          return (
            <div
              key={event.id}
              className={`cursor-pointer bg-white shadow-md rounded-2xl overflow-hidden border transition ${
                accessible ? 'hover:shadow-lg' : 'opacity-60 pointer-events-none'
              }`}
              onClick={() => accessible && router.push(`/events/${event.id}`)}
            >
              <img
                src={
                  event.image_url ||
                  'https://www.globalsign.com/application/files/3916/0397/8810/iStock-833750208.png'
                }
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600 text-sm">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {new Date(event.event_date).toLocaleDateString()}
                </p>
                <span className={`mt-2 inline-block text-xs px-2 py-1 rounded-full text-white ${getTierColor(event.tier)}`}>
                  {event.tier.toUpperCase()}
                </span>
                {!accessible && (
                  <p className="text-xs text-red-600 mt-2">Upgrade to {event.tier} to access this event</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTierColor(tier: string) {
  return {
    free: 'bg-gray-500',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-purple-600',
  }[tier] || 'bg-gray-300';
}


