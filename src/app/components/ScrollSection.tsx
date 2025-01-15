'use client';

import { motion } from 'framer-motion';

interface ScrollSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ScrollSection({ title, children }: ScrollSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-medium text-foreground">{title}</h2>
      <div className="overflow-y-auto max-h-[60vh] pr-6 -mr-6 space-y-4
                    scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 
                    scrollbar-track-transparent">
        {children}
      </div>
    </motion.section>
  );
} 