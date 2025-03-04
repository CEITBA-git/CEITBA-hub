import Link from 'next/link';
import { useUserStore } from '@/stores/user/userStore';

const MainLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: any) => state.user);
  
  return (
    <nav>
      {/* Other navigation links */}
      {user && user.roles && user.roles.some((role: string) => ['admin', 'sports', 'organization'].includes(role)) && (
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