import { KNOWLEDGE_GAPS } from '@/lib/mock-data';
import { Card, CardHeader } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  trending: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
  info: { icon: Info, color: 'text-purple-500', bg: 'bg-purple-50' },
};

export function KnowledgeGapsCard() {
  return (
    <Card>
      <CardHeader title="Knowledge Gaps & Trends" tooltip="AI-identified patterns in transfer behavior" />
      <ul className="space-y-3">
        {KNOWLEDGE_GAPS.map((gap) => {
          const { icon: Icon, color, bg } = icons[gap.type];
          return (
            <li key={gap.id} className="flex items-start gap-3">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{gap.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{gap.description}</p>
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-1.5 group">
                  {gap.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
