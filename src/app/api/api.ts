import { User } from "@/stores/user/modules";

// Cache to store user details by email
const userCache: Record<string, { data: User; timestamp: number }> = {};
// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000;

const fetchUserDetails = async (email: string | object): Promise<User> => {
  // Extract just the email if an object is passed
  let emailValue: string;
  
  if (typeof email === 'string') {
    emailValue = email;
  } else if (typeof email === 'object' && email !== null) {
    // Extract email from user object - using proper typing
    emailValue = (email as any).email || '';
    
    // Log the extracted email for debugging
    console.log('email', emailValue);
  } else {
    throw new Error('Invalid parameter: email is required');
  }
  
  // Ensure we have an email
  if (!emailValue) {
    throw new Error('Email is required to fetch user details');
  }
  
  // Check if we have a valid cached response
  const cachedUser = userCache[emailValue];
  const now = Date.now();
  
  if (cachedUser && (now - cachedUser.timestamp) < CACHE_EXPIRATION) {
    // Return cached data if it's still valid
    return cachedUser.data;
  }
  
  try {
    // Use our own Next.js API route instead of direct call to external API
    const response = await fetch(`/api/user?email=${encodeURIComponent(emailValue)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    userCache[emailValue] = {
      data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export { fetchUserDetails };