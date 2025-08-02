import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!event || error) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-64 object-cover mb-4 rounded-lg"
      />
      <p className="text-gray-700">{event.description}</p>
      <p className="text-gray-500 mt-2">
        Date: {new Date(event.event_date).toLocaleDateString()}
      </p>
      <span className={`inline-block mt-4 px-3 py-1 rounded-full text-white text-sm ${getTierColor(event.tier)}`}>
        {event.tier.toUpperCase()}
      </span>
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
