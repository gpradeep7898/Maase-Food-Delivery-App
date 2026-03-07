import { NextRequest, NextResponse } from 'next/server';

// Redirect to the client-side page that will handle the PKCE code exchange
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // Pass code to client-side page for localStorage-based session exchange
    return NextResponse.redirect(`${origin}/auth/confirm?code=${code}`);
  }

  return NextResponse.redirect(`${origin}/login?error=missing_code`);
}
