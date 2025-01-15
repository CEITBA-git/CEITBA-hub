import Link from 'next/link';

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  emoji: string;
}

export default function QuickAccessCard({ title, description, href, emoji }: QuickAccessCardProps) {
  return (
    <Link 
      href={href}
      className="group block p-6 rounded-lg bg-surface hover:bg-secondaryBackground 
                 transition-colors duration-200"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="defaultText font-medium mb-2">{title}</h3>
          <p className="text-sm text-gray">{description}</p>
        </div>
      </div>
    </Link>
  );
} 