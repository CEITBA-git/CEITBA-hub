import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract email from query parameters
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  
  try {
    // Server-side requests don't have CORS restrictions
    const response = await fetch(`https://ceitba.org.ar/api/v1/user?email=${encodeURIComponent(email)}`, {
      headers: {
        'Content-Type': 'application/json',
        // Don't include x-forwarded-host as it's causing issues
      },
      // No need for credentials in server-to-server communication
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user details from server:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' }, 
      { status: 500 }
    );
  }
}