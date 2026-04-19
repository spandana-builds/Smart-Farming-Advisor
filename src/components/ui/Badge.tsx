interface BadgeProps {
  label: string;
  variant: 'low' | 'medium' | 'high' | 'info' | 'success';
}

const styles: Record<BadgeProps['variant'], string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {label}
    </span>
  );
}
