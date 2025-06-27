import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer')
  const allowedDomain = 'patient-phone-pro.learnworlds.com'
  
  // Allow access to embed page only from the specific LearnWorlds domain
  if (request.nextUrl.pathname.startsWith('/embed')) {
    if (!referer || !referer.includes(allowedDomain)) {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }
  
  // Block direct access to the root page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/access-denied', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/embed/:path*']
} 