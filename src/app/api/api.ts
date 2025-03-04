import { User } from "@/stores/user/modules";

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
  
  try {
    // Use our own Next.js API route instead of direct call to external API
    const response = await fetch(`/api/user?email=${encodeURIComponent(emailValue)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export { fetchUserDetails };