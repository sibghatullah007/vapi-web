import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer')
  const origin = request.headers.get('origin')
  const allowedDomain = 'patient-phone-pro.learnworlds.com'
  
  // For embed page, be more permissive - allow iframe access
  if (request.nextUrl.pathname.startsWith('/embed')) {
    // Allow if no referer (iframe access) or if from allowed domain
    const hasValidReferer = referer && referer.includes(allowedDomain)
    const hasValidOrigin = origin && origin.includes(allowedDomain)
    const isDirectAccess = !referer && !origin
    
    // Allow access if:
    // 1. Has valid referer from LearnWorlds, OR
    // 2. Has valid origin from LearnWorlds, OR  
    // 3. No referer/origin (likely iframe access)
    if (hasValidReferer || hasValidOrigin || isDirectAccess) {
      return NextResponse.next()
    }
    
    // Only block if we have a clear referer from a different domain
    if (referer && !referer.includes(allowedDomain)) {
      console.log('Blocking access from unauthorized domain:', referer)
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