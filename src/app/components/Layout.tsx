import Topbar from './Topbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Topbar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-20 max-w-6xl">
        {children}
      </main>
      <Footer />
    </div>
  );
} 