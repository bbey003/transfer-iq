'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/card';
import { useTransferStore, useDeptChartData, useReasonsChartData, useWeeklyTrend } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { getManagerTeamIds } from '@/lib/mock-data';
import { useState } from 'react';

function useTeamTransfers() {
  const { user } = useAuth();
  const { transfers } = useTransferStore();
  if (user?.role === 'manager') {
    const ids = getManagerTeamIds(user.id);
    return transfers.filter((t) => ids.has(t.agentId));
  }
  return transfers;
}

export function TransfersByDeptChart() {
  const transfers = useTeamTransfers();
  const data = useDeptChartData(transfers);
  const BLUE_SHADES = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <Card>
      <CardHeader title="Transfers by Department" tooltip="Volume per department based on submitted transfers" />
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">No transfers yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#6b7280' }}>
              {data.map((_, i) => (
                <Cell key={i} fill={BLUE_SHADES[i % BLUE_SHADES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export function TransferReasonsChart() {
  const transfers = useTeamTransfers();
  const data = useReasonsChartData(transfers);
  const BLUE_SHADES = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <Card>
      <CardHeader title="Transfer Reasons" tooltip="Breakdown of transfer reasons from your team's submissions" />
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">No transfers yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={BLUE_SHADES[i % BLUE_SHADES.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}
            />
            <Legend
              formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export function WeeklyTrendChart() {
  const transfers = useTeamTransfers();
  const data = useWeeklyTrend(transfers);
  const [period, setPeriod] = useState<'Daily' | 'Weekly'>('Daily');

  return (
    <Card>
      <CardHeader
        title="Weekly Transfer Trend"
        tooltip="Transfer submissions over the last 7 days"
        action={
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'Daily' | 'Weekly')}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none"
          >
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        }
      />
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="transfers" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
