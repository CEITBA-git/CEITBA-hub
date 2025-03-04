import Link from 'next/link';
import { useUserStore } from '@/stores/user/userStore';

// Add this to your existing MainLayout component
// This assumes you have a navigation component in your main layout

// Inside your navigation links section, add:
const MainLayout = () => {
  const user = useUserStore((state: any) => state.user);
  
  return (
    // Your existing layout code
    // ...
    <nav>
      {/* Other navigation links */}
      {user && user.roles.some((role: string) => ['admin', 'sports', 'organization'].includes(role)) && (
        <Link
          href="/admin"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Admin
        </Link>
      )}
      {/* Other navigation links */}
    </nav>
    // ...
  );
};

export default MainLayout; 