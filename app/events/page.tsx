import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ActualEventsPage from './ActualEventsPage';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  return <ActualEventsPage />;
}
