export type UserRole = 'agent' | 'manager' | 'admin';

export type TransferStatus =
  | 'completed'
  | 'pending_review'
  | 'escalated'
  | 'invalid'
  | 'draft';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Agents use BRID; managers/admins use AID */
  aid: string;
  brid?: string;
  avatar?: string;
  department: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface TransferReason {
  id: string;
  label: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface Transfer {
  id: string;
  aid: string;
  agentId: string;
  agentName: string;
  agentInitials: string;
  agentColor: string;
  department: string;
  partner: string;
  reason: string;
  notes: string;
  status: TransferStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  flagged: boolean;
}

export interface CoachingSession {
  id: string;
  agentId: string;
  agentName: string;
  managerId: string;
  managerName: string;
  topic: string;
  notes: string;
  scheduledAt: string;
  completedAt?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  recurringTransfers: number;
}

export interface Feedback {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  type: 'coaching' | 'recognition' | 'improvement';
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface StatsCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  positive: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface WeeklyTrendPoint {
  date: string;
  transfers: number;
}

export interface AgentPattern {
  rank: number;
  id: string;
  name: string;
  initials: string;
  color: string;
  recurringTransfers: number;
  percentage: number;
}

export interface KnowledgeGap {
  id: string;
  type: 'warning' | 'trending' | 'info';
  title: string;
  description: string;
  actionLabel: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'transfer_review' | 'coaching' | 'feedback' | 'system' | 'flag';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
