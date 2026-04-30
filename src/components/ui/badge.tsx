import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    completed: { label: 'Completed', variant: 'success' },
    pending_review: { label: 'Pending Review', variant: 'info' },
    escalated: { label: 'Escalated', variant: 'warning' },
    invalid: { label: 'Invalid', variant: 'danger' },
    draft: { label: 'Draft', variant: 'neutral' },
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'neutral' },
    suspended: { label: 'Suspended', variant: 'danger' },
    scheduled: { label: 'Scheduled', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'neutral' },
  };

  const config = map[status] ?? { label: status, variant: 'neutral' as const };

  return (
    <Badge variant={config.variant}>
      {config.variant === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {config.variant === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
      {config.variant === 'danger' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
      {config.variant === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      {config.label}
    </Badge>
  );
}
