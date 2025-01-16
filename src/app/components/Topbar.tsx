import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export default function Topbar({ activeTab, onTabChange }: TopbarProps) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    
    switch (tab) {
      case 'inicio':
        router.push('/');
        break;
      case 'staff':
        router.push('/staff');
        break;
      case 'faq':
        router.push('/faq');
        break;
    }
  };

  return (
    <header className="w-full bg-background relative z-50 pt-4">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-auto items-center justify-between pb-4">
          <button
            onClick={() => handleTabChange('inicio')}
            className="flex-shrink-0 group hover:opacity-80 transition-opacity"
          >
            <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-textDefault">
              CEITBA
            </h2>
          </button>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => handleTabChange('staff')}
                className={`text-sm lg:text-base transition-colors ${
                  activeTab === 'staff' ? 'text-primary' : 'text-gray hover:text-textDefault'
                }`}
              >
                Miembros
              </button>
              <button
                onClick={() => handleTabChange('faq')}
                className={`text-sm lg:text-base transition-colors ${
                  activeTab === 'faq' ? 'text-primary' : 'text-gray hover:text-textDefault'
                }`}
              >
                FAQ
              </button>
            </nav>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
} 