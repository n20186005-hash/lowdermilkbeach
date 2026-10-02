import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const APEX_HOST = 'lowdermilkbeach.com';
const WWW_HOST = `www.${APEX_HOST}`;

/**
 * Canonical host + protocol for Search Console.
 *
 * Search Console reported five competing URL variants, so everything that is
 * not `https://lowdermilkbeach.com/...` is 301-redirected there before the
 * next-intl locale middleware runs. Domain-level rules cannot be expressed in
 * Cloudflare Workers static assets, so this is handled at the edge.
 */
function canonicalRedirect(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = (request.headers.get('host') || '').toLowerCase();
  const hostname = hostHeader.split(':')[0];
  const protocol = (request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')).toLowerCase();

  const isApex = hostname === APEX_HOST;
  const isWww = hostname === WWW_HOST;
  if (!isApex && !isWww) return null; // local preview / other host – nothing to normalise

  if (hostname !== APEX_HOST || protocol === 'http') {
    const target = new URL(url.toString());
    target.protocol = 'https';
    target.hostname = APEX_HOST;
    return NextResponse.redirect(target, 301);
  }

  return null;
}

export default function middleware(request: NextRequest) {
  const canonical = canonicalRedirect(request);
  if (canonical) return canonical;
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
