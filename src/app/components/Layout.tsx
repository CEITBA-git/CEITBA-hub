import Topbar from './Topbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange?: (tab: string) => void;
  pagePadding?: string;
}

export default function Layout({ children, activeTab, onTabChange, pagePadding = "py-20" }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Topbar activeTab={activeTab} onTabChange={onTabChange} />
      <main className={`flex-grow container mx-auto px-6 sm:px-8 lg:px-12 ${pagePadding} max-w-6xl`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 