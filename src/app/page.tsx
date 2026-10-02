import { redirect } from 'next/navigation';

// The middleware (next-intl localePrefix: 'always', defaultLocale: 'en') redirects
// `/` to `/en`. This root page is a safe fallback in case it is reached directly.
export default function RootPage() {
  redirect('/en');
}