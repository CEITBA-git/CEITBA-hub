export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // console.log("Sending inscription request to:", `${apiUrl}/api/v1/inscription`);
    // console.log("Request body:", JSON.stringify(body, null, 2));
    
    try {
      const response = await fetch(`${apiUrl}/api/v1/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      console.log("Response status:", response.status);
      
      const contentType = response.headers.get("content-type");
      console.log("Response content-type:", contentType);
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Response data:", data);
        
        if (!response.ok) {
          console.error("API error response:", data);
          return Response.json(
            { error: data.error || 'Failed to submit inscription' }, 
            { status: response.status }
          );
        }
        
        return Response.json(data, { status: response.status });
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 200) + "...");
        
        return Response.json(
          { error: `Server responded with non-JSON data (${response.status})` }, 
          { status: 500 }
        );
      }
    } catch (fetchError) {
      console.error("Fetch error details:", fetchError);
      return Response.json(
        { error: 'Network error: ' + (fetchError || 'Unable to connect to API server') }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in inscription API route:', error);
    return Response.json(
      { error: 'Internal server error: ' + (error || 'Unknown error') }, 
      { status: 500 }
    );
  }
}