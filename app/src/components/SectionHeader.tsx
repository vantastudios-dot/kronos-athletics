interface SectionHeaderProps {
  label: string;
  title: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({ label, title, centered = false, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <span className="font-mono-label text-fitness-accent text-xs uppercase tracking-[0.12em] block mb-3">
        {label}
      </span>
      <h2 className="font-display text-white tracking-[0.03em]" style={{ fontSize: 'var(--type-section-title)' }}>
        {title}
      </h2>
    </div>
  );
}
