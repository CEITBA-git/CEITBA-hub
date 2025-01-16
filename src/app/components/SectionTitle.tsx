interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-3xl font-bold text-center mb-12 ${className}`}>
      {children}
    </h2>
  );
} 