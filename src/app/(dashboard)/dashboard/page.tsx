'use client';

import { TopBar } from '@/components/layout/topbar';
import { DashboardStatsCards } from '@/components/dashboard/stats-cards';
import { TransfersByDeptChart, TransferReasonsChart, WeeklyTrendChart } from '@/components/dashboard/charts';
import { KnowledgeGapsCard } from '@/components/dashboard/knowledge-gaps';
import { AgentPatternsCard } from '@/components/dashboard/agent-patterns';
import { RecentTransfersTable } from '@/components/dashboard/recent-transfers';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Manager Dashboard"
        subtitle="Real-time insights into call transfers and team performance."
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5 max-w-[1600px]">
          {/* Date filter row */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              May 12 – May 18, 2025
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Stats */}
          <DashboardStatsCards />

          {/* Row 2: Charts + Knowledge Gaps */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <TransfersByDeptChart />
            <TransferReasonsChart />
            <KnowledgeGapsCard />
          </div>

          {/* Row 3: Weekly Trend + Agent Patterns */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <WeeklyTrendChart />
            <AgentPatternsCard />
          </div>

          {/* Recent Transfers */}
          <RecentTransfersTable />
        </div>
      </div>
    </div>
  );
}
