This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# 🎟️ Tiered Events App

A full-stack Next.js 13+ app with Clerk authentication and Supabase backend. Access to events is restricted based on the user's subscription tier (e.g., Free, Pro, Premium).

---

## 🔧 Setup Instructions

1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tiered-events-app.git
cd tiered-events-app
```

2. Install Dependencies
```bash
npm install
```

3. Create .env.local
In the project root, create a .env.local file and add your credentials:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Clerk Configuration

1.Go to your Clerk Dashboard.

2.Navigate to JWT Templates and create one named: supabase.

3.Add this to the template:

```json
{
  "public_metadata": {
    "tier": "{{ user.public_metadata.tier }}"
  }
}
```

4.Set up tiers manually in each user's public metadata (e.g., free, pro, premium).

## 🛠️ Supabase Configuration

1.Go to Supabase → Your Project → SQL Editor.

2.Create the events table:

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tier text not null -- free, pro, premium
);
```
3.Enable Row Level Security (RLS) on the events table.

4.Add the policy:

```sql

create policy "Tiered Access"
on events
for select
using (
  auth.jwt() ->> 'tier' >= tier
);
```

## 🚀 Run the App Locally

```bash
npm run dev
```

Visit http://localhost:3000

## 👤 Demo User Credentials

| Tier    | Email                                             | Password |
| ------- | ------------------------------------------------- | -------- |
| Free    | [free@example.com](mailto:free@example.com)       | password |
| Pro     | [pro@example.com](mailto:pro@example.com)         | password |
| Premium | [premium@example.com](mailto:premium@example.com) | password |


(Make sure to create and assign public_metadata tiers for these users in Clerk)

## 🧩 Dependencies Used
```json
"dependencies": {
  "next": "^13.4.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@clerk/nextjs": "^4.29.0",
  "@supabase/auth-helpers-nextjs": "^0.9.0",
  "@supabase/supabase-js": "^2.39.0"
}
```

##🌐 Deployment
Deploy this app to Vercel and set the environment variables under Settings → Environment Variables.
