import { auth } from '@clerk/nextjs/server';
import { createSupabaseClientWithToken } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const id = params.id;

  // 🔐 Get the Clerk token using the 'supabase' template
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });

  if (!token) {
    console.error("❌ No Clerk token available");
    return notFound();
  }

  // ✅ Create Supabase client with Bearer token
  const supabase = createSupabaseClientWithToken(token);

  console.log("📦 Fetching event with ID:", id);

  // 🟡 Debug all events the user can see
  const allVisible = await supabase.from('events').select('*');
  console.log("🟡 Visible events to current user:", allVisible.data);

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  console.log("🔍 Queried Event:", event);
  console.log("⚠️ Supabase Error:", error);

  if (!event || error) {
    console.error('❌ Event not found or Supabase error:', error?.message);
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      
      <img
        src="https://media.istockphoto.com/id/1597475039/photo/abstract-colorful-glass-background.jpg?s=612x612&w=0&k=20&c=Gv5iCYYzRnE7F_RwFDacJGmEgLfArYnkeyORu1umeZM="
        alt={event.title}
        className="rounded-lg w-full h-auto object-cover"
      />

      <p className="text-gray-700 mt-4">{event.description}</p>
      <p className="text-gray-500 mt-2">
        Date: {new Date(event.event_date).toLocaleDateString()}
      </p>
      <span
        className={`inline-block mt-4 px-3 py-1 rounded-full text-white text-sm ${getTierColor(
          event.tier
        )}`}
      >
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
