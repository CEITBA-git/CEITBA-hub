'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabSectionProps {
  tabs: Tab[];
}

export default function TabSection({ tabs }: TabSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full bg-background/30 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145]
                    shadow-[0_0_1000px_0_rgba(0,0,255,0.05)] dark:shadow-[0_0_1000px_0_rgba(255,255,255,0.02)]">
      <div className="flex gap-2 p-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'text-foreground bg-black/[.05] dark:bg-white/[.06]' 
                        : 'text-foreground/70 hover:text-foreground/90 hover:bg-black/[.02] dark:hover:bg-white/[.02]'
                      }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative mix-blend-multiply dark:mix-blend-difference">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="p-6 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(tab => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 