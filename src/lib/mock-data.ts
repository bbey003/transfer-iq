import type {
  User, Department, Partner, TransferReason, Transfer,
  CoachingSession, Feedback, ChartDataPoint, WeeklyTrendPoint,
  AgentPattern, KnowledgeGap, Notification,
} from '@/types';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'Alex Carter',
  email: 'alex.carter@transferiq.internal',
  role: 'manager',
  aid: 'AID-00001',
  department: 'Operations',
  status: 'active',
  createdAt: '2024-01-15',
};

export const DEPARTMENTS: Department[] = [
  { id: 'd-1', name: 'Fraud', description: 'Fraud investigation and support', status: 'active', createdAt: '2024-01-01' },
  { id: 'd-2', name: 'Top of Queue', description: 'Top of queue escalations', status: 'active', createdAt: '2024-01-01' },
  { id: 'd-3', name: 'Deposits', description: 'Deposit inquiries and support', status: 'active', createdAt: '2024-01-01' },
  { id: 'd-4', name: 'Partners', description: 'Partner and third-party support', status: 'active', createdAt: '2024-01-01' },
  { id: 'd-5', name: 'Credit', description: 'Credit card account support', status: 'active', createdAt: '2024-01-01' },
  { id: 'd-6', name: 'Manager', description: 'Manager and leadership', status: 'active', createdAt: '2024-01-01' },
];

export const PARTNERS: Partner[] = [
  { id: 'p-1', name: 'Barclaycard', description: 'Credit card partner', status: 'active' },
  { id: 'p-2', name: 'PayPlan', description: 'Debt management partner', status: 'active' },
  { id: 'p-3', name: 'Transunion', description: 'Credit bureau partner', status: 'active' },
  { id: 'p-4', name: 'ClearScore', description: 'Credit score partner', status: 'active' },
  { id: 'p-5', name: 'Experian', description: 'Credit bureau', status: 'active' },
];

export const TRANSFER_REASONS: TransferReason[] = [
  { id: 'r-1', label: 'Customer Request', category: 'Customer', status: 'active' },
  { id: 'r-2', label: 'Information / Clarification', category: 'Knowledge', status: 'active' },
  { id: 'r-3', label: 'Account Access', category: 'Technical', status: 'active' },
  { id: 'r-4', label: 'System / Process Issue', category: 'Technical', status: 'active' },
  { id: 'r-5', label: 'Fraud Concern', category: 'Security', status: 'active' },
  { id: 'r-6', label: 'Complaint Escalation', category: 'Escalation', status: 'active' },
  { id: 'r-7', label: 'Out of Scope', category: 'Process', status: 'active' },
  { id: 'r-8', label: 'Other', category: 'General', status: 'active' },
];

const AGENT_COLORS: Record<string, string> = {
  'JL': 'bg-purple-500',
  'MC': 'bg-teal-500',
  'ER': 'bg-orange-500',
  'DP': 'bg-blue-500',
  'LA': 'bg-pink-500',
  'RK': 'bg-green-500',
  'ST': 'bg-indigo-500',
  'WB': 'bg-red-500',
};

export const TRANSFERS: Transfer[] = [
  { id: 't-001', aid: 'AID-87321', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Fraud', partner: 'Barclaycard', reason: 'Customer Request', notes: 'Customer called about suspicious charge', status: 'completed', createdAt: '2025-05-18T10:42:00', flagged: false },
  { id: 't-002', aid: 'AID-87320', agentId: 'u-102', agentName: 'Michael Chen', agentInitials: 'MC', agentColor: 'bg-teal-500', department: 'Deposits', partner: 'PayPlan', reason: 'Information / Clarification', notes: 'Deposit hold inquiry', status: 'completed', createdAt: '2025-05-18T10:28:00', flagged: false },
  { id: 't-003', aid: 'AID-87319', agentId: 'u-103', agentName: 'Emily Rodriguez', agentInitials: 'ER', agentColor: 'bg-orange-500', department: 'Partners', partner: 'ClearScore', reason: 'Information / Clarification', notes: 'Third-party integration question', status: 'escalated', createdAt: '2025-05-18T10:15:00', flagged: true },
  { id: 't-004', aid: 'AID-87318', agentId: 'u-104', agentName: 'David Park', agentInitials: 'DP', agentColor: 'bg-blue-500', department: 'Top of Queue', partner: '', reason: 'Customer Request', notes: 'Priority call escalation', status: 'completed', createdAt: '2025-05-18T09:58:00', flagged: false },
  { id: 't-005', aid: 'AID-87317', agentId: 'u-105', agentName: 'Lisa Anderson', agentInitials: 'LA', agentColor: 'bg-pink-500', department: 'Credit', partner: 'Experian', reason: 'Account Access', notes: 'Account locked issue', status: 'pending_review', createdAt: '2025-05-18T09:41:00', flagged: false },
  { id: 't-006', aid: 'AID-87316', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Suspected identity theft', status: 'escalated', createdAt: '2025-05-18T09:20:00', flagged: true },
  { id: 't-007', aid: 'AID-87315', agentId: 'u-106', agentName: 'Ryan Kim', agentInitials: 'RK', agentColor: 'bg-green-500', department: 'Manager', partner: '', reason: 'Complaint Escalation', notes: 'Customer requested manager', status: 'completed', createdAt: '2025-05-18T09:05:00', flagged: false },
  { id: 't-008', aid: 'AID-87314', agentId: 'u-102', agentName: 'Michael Chen', agentInitials: 'MC', agentColor: 'bg-teal-500', department: 'Partners', partner: 'Transunion', reason: 'Information / Clarification', notes: 'Credit report discrepancy', status: 'completed', createdAt: '2025-05-18T08:50:00', flagged: false },
  { id: 't-009', aid: 'AID-87313', agentId: 'u-103', agentName: 'Emily Rodriguez', agentInitials: 'ER', agentColor: 'bg-orange-500', department: 'Deposits', partner: '', reason: 'System / Process Issue', notes: 'App error during deposit', status: 'pending_review', createdAt: '2025-05-17T16:45:00', flagged: false },
  { id: 't-010', aid: 'AID-87312', agentId: 'u-104', agentName: 'David Park', agentInitials: 'DP', agentColor: 'bg-blue-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Card skimming report', status: 'invalid', createdAt: '2025-05-17T16:30:00', flagged: true },
  { id: 't-011', aid: 'AID-87311', agentId: 'u-107', agentName: 'Sarah Torres', agentInitials: 'ST', agentColor: 'bg-indigo-500', department: 'Credit', partner: 'ClearScore', reason: 'Account Access', notes: 'Online banking access issue', status: 'completed', createdAt: '2025-05-17T16:15:00', flagged: false },
  { id: 't-012', aid: 'AID-87310', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Partners', partner: 'PayPlan', reason: 'Information / Clarification', notes: 'Payment plan options', status: 'completed', createdAt: '2025-05-17T15:55:00', flagged: false },
];

export const DEPT_CHART_DATA: ChartDataPoint[] = [
  { name: 'Fraud', value: 348, fill: '#2563eb' },
  { name: 'Top of Queue', value: 252, fill: '#2563eb' },
  { name: 'Deposits', value: 198, fill: '#2563eb' },
  { name: 'Partners', value: 174, fill: '#2563eb' },
  { name: 'Credit', value: 156, fill: '#2563eb' },
  { name: 'Manager', value: 120, fill: '#2563eb' },
];

export const REASONS_CHART_DATA: ChartDataPoint[] = [
  { name: 'Customer Request', value: 36, fill: '#2563eb' },
  { name: 'Account Access', value: 24, fill: '#60a5fa' },
  { name: 'Information / Clarification', value: 17, fill: '#93c5fd' },
  { name: 'System / Process Issue', value: 13, fill: '#bfdbfe' },
  { name: 'Other', value: 10, fill: '#dbeafe' },
];

export const WEEKLY_TREND: WeeklyTrendPoint[] = [
  { date: 'May 12', transfers: 410 },
  { date: 'May 13', transfers: 520 },
  { date: 'May 14', transfers: 610 },
  { date: 'May 15', transfers: 480 },
  { date: 'May 16', transfers: 590 },
  { date: 'May 17', transfers: 420 },
  { date: 'May 18', transfers: 490 },
];

export const AGENT_PATTERNS: AgentPattern[] = [
  { rank: 1, id: 'u-101', name: 'Jessica Lee', initials: 'JL', color: 'bg-purple-500', recurringTransfers: 28, percentage: 100 },
  { rank: 2, id: 'u-102', name: 'Michael Chen', initials: 'MC', color: 'bg-teal-500', recurringTransfers: 22, percentage: 78 },
  { rank: 3, id: 'u-103', name: 'Emily Rodriguez', initials: 'ER', color: 'bg-orange-500', recurringTransfers: 18, percentage: 64 },
  { rank: 4, id: 'u-104', name: 'David Park', initials: 'DP', color: 'bg-blue-500', recurringTransfers: 15, percentage: 53 },
  { rank: 5, id: 'u-105', name: 'Lisa Anderson', initials: 'LA', color: 'bg-pink-500', recurringTransfers: 12, percentage: 43 },
];

export const KNOWLEDGE_GAPS: KnowledgeGap[] = [
  {
    id: 'kg-1',
    type: 'warning',
    title: 'Recurring partner confusion',
    description: '42% of transfers to Partners are due to information or process clarifications.',
    actionLabel: 'View details',
  },
  {
    id: 'kg-2',
    type: 'trending',
    title: 'Manager requests trending',
    description: 'Manager transfers increased 18% compared to last week.',
    actionLabel: 'See trend',
  },
  {
    id: 'kg-3',
    type: 'info',
    title: 'Workflow-related transfers',
    description: 'System or process issues account for 13% of total transfers.',
    actionLabel: 'View insights',
  },
];

export const AGENTS: User[] = [
  { id: 'u-101', name: 'Jessica Lee', email: 'jessica.lee@transferiq.internal', role: 'agent', aid: 'AID-87321', department: 'Operations', status: 'active', createdAt: '2024-02-01' },
  { id: 'u-102', name: 'Michael Chen', email: 'michael.chen@transferiq.internal', role: 'agent', aid: 'AID-87320', department: 'Operations', status: 'active', createdAt: '2024-02-01' },
  { id: 'u-103', name: 'Emily Rodriguez', email: 'emily.rodriguez@transferiq.internal', role: 'agent', aid: 'AID-87319', department: 'Operations', status: 'active', createdAt: '2024-02-15' },
  { id: 'u-104', name: 'David Park', email: 'david.park@transferiq.internal', role: 'agent', aid: 'AID-87318', department: 'Operations', status: 'active', createdAt: '2024-03-01' },
  { id: 'u-105', name: 'Lisa Anderson', email: 'lisa.anderson@transferiq.internal', role: 'agent', aid: 'AID-87317', department: 'Operations', status: 'active', createdAt: '2024-03-10' },
  { id: 'u-106', name: 'Ryan Kim', email: 'ryan.kim@transferiq.internal', role: 'agent', aid: 'AID-87316', department: 'Operations', status: 'active', createdAt: '2024-03-15' },
  { id: 'u-107', name: 'Sarah Torres', email: 'sarah.torres@transferiq.internal', role: 'agent', aid: 'AID-87315', department: 'Operations', status: 'active', createdAt: '2024-04-01' },
  { id: 'u-108', name: 'Will Brooks', email: 'will.brooks@transferiq.internal', role: 'agent', aid: 'AID-87314', department: 'Operations', status: 'suspended', createdAt: '2024-04-15' },
];

export const COACHING_SESSIONS: CoachingSession[] = [
  { id: 'cs-1', agentId: 'u-101', agentName: 'Jessica Lee', managerId: 'u-001', managerName: 'Alex Carter', topic: 'Reducing Fraud transfer frequency', notes: 'Review self-service options for fraud queries before transferring.', scheduledAt: '2025-05-20T14:00:00', status: 'scheduled', recurringTransfers: 28 },
  { id: 'cs-2', agentId: 'u-102', agentName: 'Michael Chen', managerId: 'u-001', managerName: 'Alex Carter', topic: 'Partner knowledge gap', notes: 'Completed walkthrough of partner processes. Improvement expected.', scheduledAt: '2025-05-15T10:00:00', completedAt: '2025-05-15T10:45:00', status: 'completed', recurringTransfers: 22 },
  { id: 'cs-3', agentId: 'u-103', agentName: 'Emily Rodriguez', managerId: 'u-001', managerName: 'Alex Carter', topic: 'Information clarification handling', notes: 'Agent to review knowledge base before escalating.', scheduledAt: '2025-05-22T11:00:00', status: 'scheduled', recurringTransfers: 18 },
];

export const FEEDBACK_ITEMS: Feedback[] = [
  { id: 'f-1', fromId: 'u-001', fromName: 'Alex Carter', toId: 'u-102', toName: 'Michael Chen', type: 'recognition', message: 'Great improvement on handling deposit queries this week — transfers down 15%.', createdAt: '2025-05-17T09:00:00', isRead: true },
  { id: 'f-2', fromId: 'u-001', fromName: 'Alex Carter', toId: 'u-101', toName: 'Jessica Lee', type: 'coaching', message: 'Please review the Fraud FAQ knowledge base before transferring. Many of these could be resolved on first contact.', createdAt: '2025-05-16T14:30:00', isRead: false },
  { id: 'f-3', fromId: 'u-001', fromName: 'Alex Carter', toId: 'u-103', toName: 'Emily Rodriguez', type: 'improvement', message: 'Your escalated transfer rate is above team average. Let\'s review your call handling approach.', createdAt: '2025-05-15T11:00:00', isRead: false },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n-1', userId: 'u-001', type: 'flag', title: 'Transfer flagged for review', body: 'AID-87316 (Jessica Lee) has been flagged as invalid.', isRead: false, createdAt: '2025-05-18T09:25:00', actionUrl: '/history' },
  { id: 'n-2', userId: 'u-001', type: 'coaching', title: 'Coaching session scheduled', body: 'Session with Jessica Lee on May 20 at 2:00 PM.', isRead: false, createdAt: '2025-05-18T08:00:00', actionUrl: '/coaching' },
  { id: 'n-3', userId: 'u-001', type: 'transfer_review', title: 'Transfer pending review', body: 'AID-87317 (Lisa Anderson) needs your review.', isRead: true, createdAt: '2025-05-18T09:41:00', actionUrl: '/history' },
  { id: 'n-4', userId: 'u-001', type: 'system', title: 'Weekly report ready', body: 'Your team transfer report for May 12–18 is ready.', isRead: true, createdAt: '2025-05-18T08:00:00', actionUrl: '/dashboard' },
];

export const DASHBOARD_STATS = {
  totalTransfers: { value: 1248, change: 12.4, period: 'vs May 5 – May 11', positive: true },
  invalidFlagged: { value: 86, change: -8.7, period: 'vs May 5 – May 11', positive: true },
  topDept: { value: 'Fraud', subtext: '28% of total transfers' },
  agentsNeedingCoaching: { value: 14, change: 3, period: 'vs last 7 days', positive: false },
};
