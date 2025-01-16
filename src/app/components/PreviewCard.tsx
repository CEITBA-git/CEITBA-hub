import { UserCircleIcon } from '@heroicons/react/24/solid';

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface PreviewCardProps {
  title: string;
  onViewAll: () => void;
  items: (StaffMember | FAQItem)[];
  type: 'staff' | 'faq';
}

export default function PreviewCard({ title, onViewAll, items, type }: PreviewCardProps) {
  return (
    <div className={`bg-surface p-8 rounded-lg transform transition-all duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={onViewAll}
          className="text-primary hover:underline"
        >
          Ver todos
        </button>
      </div>
      <div className={`space-y-${type === 'staff' ? '4' : '6'}`}>
        {type === 'staff' ? (
          // Staff Preview
          items.map((member, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-background hover:shadow-md transition-shadow"
            >
              {(member as StaffMember).image ? (
                <img 
                  src={(member as StaffMember).image} 
                  alt={(member as StaffMember).name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-gray" />
              )}
              <div>
                <h3 className="defaultText font-medium">{(member as StaffMember).name}</h3>
                <p className="text-sm text-gray">{(member as StaffMember).role}</p>
              </div>
            </div>
          ))
        ) : (
          // FAQ Preview
          items.map((item, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-background hover:shadow-md transition-shadow"
            >
              <h3 className="defaultText font-medium mb-2">{(item as FAQItem).question}</h3>
              <p className="text-sm text-gray">{(item as FAQItem).answer}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 