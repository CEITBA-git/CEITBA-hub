import ThemeSwitcher from './ThemeSwitcher';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface TopbarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export default function Topbar({ activeTab, onTabChange }: TopbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    setIsMenuOpen(false);
    
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
      case 'benefits':
        router.push('/benefits');
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
          
          <div className="flex items-center">
            <div className="md:hidden">
              <ThemeSwitcher />
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
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
                <button
                  onClick={() => handleTabChange('benefits')}
                  className={`text-sm lg:text-base transition-colors ${
                    activeTab === 'benefits' ? 'text-primary' : 'text-gray hover:text-textDefault'
                  }`}
                >
                  Beneficios
                </button>
              </nav>
              <ThemeSwitcher />
            </div>

            {isMounted && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="block md:hidden ml-6"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-textDefault" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-textDefault" />
                )}
              </button>
            )}
          </div>
        </div>

        {isMounted && (
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <nav className="flex flex-col space-y-4 pb-6">
              <button
                onClick={() => handleTabChange('staff')}
                className={`text-sm transition-colors text-left ${
                  activeTab === 'staff' ? 'text-primary' : 'text-gray hover:text-textDefault'
                }`}
              >
                Miembros
              </button>
              <button
                onClick={() => handleTabChange('faq')}
                className={`text-sm transition-colors text-left ${
                  activeTab === 'faq' ? 'text-primary' : 'text-gray hover:text-textDefault'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => handleTabChange('benefits')}
                className={`text-sm transition-colors text-left ${
                  activeTab === 'benefits' ? 'text-primary' : 'text-gray hover:text-textDefault'
                }`}
              >
                Beneficios
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 