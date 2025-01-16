'use client'

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  emoji: string;
  comingSoon?: boolean;
}

export default function QuickAccessCard({ title, description, href, emoji, comingSoon }: QuickAccessCardProps) {
  return (
    <div 
      className={`relative block p-6 bg-surface hover:bg-surface/80 rounded-xl border border-black/[.08] dark:border-white/[.145] transition-all duration-300 ${comingSoon ? 'cursor-not-allowed' : 'hover:scale-[1.02]'}`}
    >
      {comingSoon && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full shadow-sm">
          MUY PRONTO
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-background rounded-xl">
          <span className="text-2xl">{emoji}</span>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-gray text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
} 