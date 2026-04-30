'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTransferStore } from '@/lib/transfer-store';
import type { KnowledgeArticle } from '@/types';
import {
  BookOpen, CheckCircle, XCircle, AlertCircle, Search,
  ChevronDown, ChevronUp, Shield, CreditCard, Users, Briefcase, TrendingUp, UserCheck, FileText,
} from 'lucide-react';

const DEPT_ICONS: Record<string, { icon: React.ElementType; iconColor: string; iconBg: string }> = {
  Fraud:         { icon: Shield,    iconColor: 'text-blue-600',   iconBg: 'bg-blue-50' },
  Deposits:      { icon: TrendingUp,iconColor: 'text-emerald-600',iconBg: 'bg-emerald-50' },
  Partners:      { icon: Users,     iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
  Credit:        { icon: CreditCard,iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
  Manager:       { icon: Briefcase, iconColor: 'text-red-600',    iconBg: 'bg-red-50' },
  'Top of Queue':{ icon: UserCheck, iconColor: 'text-teal-600',   iconBg: 'bg-teal-50' },
};

function getIconProps(department: string) {
  return DEPT_ICONS[department] ?? { icon: FileText, iconColor: 'text-gray-500', iconBg: 'bg-gray-100' };
}

function ArticleCard({ article }: { article: KnowledgeArticle }) {
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, iconColor, iconBg } = getIconProps(article.department);

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{article.department}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{article.summary}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-5 bg-white">
          <p className="text-sm text-gray-600 leading-relaxed">{article.summary}</p>

          {article.minNotes && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-0.5">Notes requirement</p>
                <p className="text-xs text-blue-700 leading-relaxed">{article.minNotes}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Valid transfer reasons</p>
              </div>
              <div className="space-y-2">
                {article.validReasons.map((item, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
                    <p className="text-xs font-medium text-emerald-800">{item.reason}</p>
                    {item.example && (
                      <p className="text-xs text-emerald-600 mt-0.5 italic">e.g. {item.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Invalid transfer reasons</p>
              </div>
              <div className="space-y-2">
                {article.invalidReasons.map((item, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                    <p className="text-xs font-medium text-red-800">{item.reason}</p>
                    {item.example && (
                      <p className="text-xs text-red-500 mt-0.5 italic">e.g. {item.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick tips</p>
            <ul className="space-y-1.5">
              {article.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const { articles } = useTransferStore();

  const active = articles.filter((a) => a.isActive);
  const filtered = active.filter((a) =>
    !search ||
    a.department.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase()) ||
    a.validReasons.some((r) => r.reason.toLowerCase().includes(search.toLowerCase())) ||
    a.invalidReasons.some((r) => r.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Knowledge Centre"
        subtitle="Department guides on what makes a valid or invalid transfer."
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4 max-w-4xl">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Use these articles to understand what qualifies as a valid transfer before logging. Referencing the correct criteria reduces flags and helps you improve your transfer accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by department or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 w-full focus:outline-none"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No articles match your search.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
