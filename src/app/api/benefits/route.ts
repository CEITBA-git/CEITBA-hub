
export async function GET() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ceitba.org.ar";
      const response = await fetch(`${apiUrl}/api/v1/benefits`);
      const data = await response.json();
      return Response.json(data);
    } catch {
      return Response.json({ error: 'Failed to fetch benefits' }, { status: 500 });
    }
  }