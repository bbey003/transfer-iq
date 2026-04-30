import type {
  User, Department, Partner, TransferReason, Transfer,
  CoachingSession, Feedback, ChartDataPoint, WeeklyTrendPoint,
  AgentPattern, KnowledgeGap, Notification, AgentSuggestion, CallVolume,
  KnowledgeArticle,
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

export const SEED_TRANSFERS: Transfer[] = [
  // VALID — Customer Request, auto-passed constraint
  { id: 't-001', aid: 'AID-87321', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Fraud', partner: 'Barclaycard', reason: 'Customer Request', notes: 'Customer explicitly requested to speak with the fraud team about a charge they do not recognise on their account.', status: 'completed', createdAt: '2025-05-18T10:42:00', flagged: false, riskScore: 0 },
  // VALID — Info/Clarification with sufficient notes (passed)
  { id: 't-002', aid: 'AID-87320', agentId: 'u-102', agentName: 'Michael Chen', agentInitials: 'MC', agentColor: 'bg-teal-500', department: 'Deposits', partner: 'PayPlan', reason: 'Information / Clarification', notes: 'Customer asked about a 5-day deposit hold. I checked the hold policy page but could not find the specific case type. Transferring for specialist guidance.', status: 'completed', createdAt: '2025-05-18T10:28:00', flagged: false, riskScore: 0 },
  // PENDING — Info/Clarification to Partners with short notes (flagged by constraint c-3)
  { id: 't-003', aid: 'AID-87319', agentId: 'u-103', agentName: 'Emily Rodriguez', agentInitials: 'ER', agentColor: 'bg-orange-500', department: 'Partners', partner: 'ClearScore', reason: 'Information / Clarification', notes: 'Question about integration', status: 'pending_review', createdAt: '2025-05-18T10:15:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], riskScore: 35 },
  // VALID — Customer Request always passes
  { id: 't-004', aid: 'AID-87318', agentId: 'u-104', agentName: 'David Park', agentInitials: 'DP', agentColor: 'bg-blue-500', department: 'Top of Queue', partner: '', reason: 'Customer Request', notes: 'Customer requested priority handling and asked to speak with the queue team directly.', status: 'completed', createdAt: '2025-05-18T09:58:00', flagged: false, riskScore: 0 },
  // PENDING — Account Access with short notes (flagged by constraint c-4)
  { id: 't-005', aid: 'AID-87317', agentId: 'u-105', agentName: 'Lisa Anderson', agentInitials: 'LA', agentColor: 'bg-pink-500', department: 'Credit', partner: 'Experian', reason: 'Account Access', notes: 'Account locked', status: 'pending_review', createdAt: '2025-05-18T09:41:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 20 characters for Account Access transfers.'], riskScore: 35 },
  // VALID — Fraud Concern always passes
  { id: 't-006', aid: 'AID-87316', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Customer reported suspected identity theft — multiple accounts opened in their name without consent. Transferring to fraud specialist.', status: 'completed', createdAt: '2025-05-18T09:20:00', flagged: false, riskScore: 0 },
  // VALID — Complaint Escalation always passes
  { id: 't-007', aid: 'AID-87315', agentId: 'u-106', agentName: 'Ryan Kim', agentInitials: 'RK', agentColor: 'bg-green-500', department: 'Manager', partner: '', reason: 'Complaint Escalation', notes: 'Customer has been waiting 3 weeks for a resolution and explicitly requested escalation to a manager.', status: 'completed', createdAt: '2025-05-18T09:05:00', flagged: false, riskScore: 0 },
  // PENDING — Info/Clarification to Partners, reviewed and marked INVALID by manager
  { id: 't-008', aid: 'AID-87314', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Partners', partner: 'Transunion', reason: 'Information / Clarification', notes: 'query', status: 'invalid', createdAt: '2025-05-18T08:50:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], reviewedBy: 'Alex Carter', reviewedAt: '2025-05-18T09:30:00', riskScore: 35 },
  // VALID — System/Process Issue always passes
  { id: 't-009', aid: 'AID-87313', agentId: 'u-103', agentName: 'Emily Rodriguez', agentInitials: 'ER', agentColor: 'bg-orange-500', department: 'Deposits', partner: '', reason: 'System / Process Issue', notes: 'App displayed error code DEP-404 when customer attempted to complete a deposit. Checked the status page — no outage listed. Transferring to tech support.', status: 'completed', createdAt: '2025-05-17T16:45:00', flagged: false, riskScore: 0 },
  // INVALID — reviewed by manager
  { id: 't-010', aid: 'AID-87312', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Partners', partner: 'PayPlan', reason: 'Information / Clarification', notes: 'not sure', status: 'invalid', createdAt: '2025-05-17T16:30:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], reviewedBy: 'Alex Carter', reviewedAt: '2025-05-17T17:00:00', riskScore: 35 },
  // VALID — Account Access with proper notes
  { id: 't-011', aid: 'AID-87311', agentId: 'u-107', agentName: 'Sarah Torres', agentInitials: 'ST', agentColor: 'bg-indigo-500', department: 'Credit', partner: 'ClearScore', reason: 'Account Access', notes: 'Customer locked out of online banking after three failed password attempts. Reset link was not received via email.', status: 'completed', createdAt: '2025-05-17T16:15:00', flagged: false, riskScore: 0 },
  // PENDING — Manager dept, Info/Clarification, no real notes
  { id: 't-012', aid: 'AID-87310', agentId: 'u-101', agentName: 'Jessica Lee', agentInitials: 'JL', agentColor: 'bg-purple-500', department: 'Manager', partner: '', reason: 'Information / Clarification', notes: 'customer upset', status: 'pending_review', createdAt: '2025-05-17T15:55:00', flagged: true, flagReasons: ['Notes required: Transfers to the Manager department must include a reason why the agent could not resolve.', 'Notes required: Transfers for Information/Clarification must include notes explaining what was attempted first.'], riskScore: 70 },
  // VALID — Customer Request
  { id: 't-013', aid: 'AID-87309', agentId: 'u-102', agentName: 'Michael Chen', agentInitials: 'MC', agentColor: 'bg-teal-500', department: 'Credit', partner: '', reason: 'Customer Request', notes: 'Customer asked to be transferred to the credit team to discuss an interest rate query.', status: 'completed', createdAt: '2025-05-17T14:20:00', flagged: false, riskScore: 0 },
  // INVALID — reviewed by manager
  { id: 't-014', aid: 'AID-87308', agentId: 'u-103', agentName: 'Emily Rodriguez', agentInitials: 'ER', agentColor: 'bg-orange-500', department: 'Partners', partner: 'ClearScore', reason: 'Information / Clarification', notes: 'info needed', status: 'invalid', createdAt: '2025-05-17T13:10:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], reviewedBy: 'Alex Carter', reviewedAt: '2025-05-17T14:00:00', riskScore: 35 },
  // VALID
  { id: 't-015', aid: 'AID-87307', agentId: 'u-104', agentName: 'David Park', agentInitials: 'DP', agentColor: 'bg-blue-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Customer reported card used at ATM they do not recognise. Possible skimming device involved.', status: 'completed', createdAt: '2025-05-17T11:45:00', flagged: false, riskScore: 0 },

  // ── Jordan Mills's team transfers ──────────────────────────────
  // VALID — Fraud Concern always passes
  { id: 't-101', aid: 'AID-87421', agentId: 'u-201', agentName: 'Tom Bradley', agentInitials: 'TB', agentColor: 'bg-cyan-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Customer noticed three unfamiliar transactions. Confirmed the last authorised access was two days ago. Transferring to fraud team for immediate review.', status: 'completed', createdAt: '2025-05-18T11:10:00', flagged: false, riskScore: 0 },
  // PENDING — Partners, Info/Clarification, notes too short
  { id: 't-102', aid: 'AID-87422', agentId: 'u-202', agentName: 'Aisha Patel', agentInitials: 'AP', agentColor: 'bg-rose-500', department: 'Partners', partner: 'Barclaycard', reason: 'Information / Clarification', notes: 'Billing query', status: 'pending_review', createdAt: '2025-05-18T10:55:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], riskScore: 35 },
  // VALID — System/Process Issue
  { id: 't-103', aid: 'AID-87423', agentId: 'u-203', agentName: 'Carlos Reyes', agentInitials: 'CR', agentColor: 'bg-lime-600', department: 'Deposits', partner: '', reason: 'System / Process Issue', notes: 'Customer attempted three deposits over 48 hours, all returned with error code DPS-302. Status page shows no maintenance window. Escalating to technical deposits team.', status: 'completed', createdAt: '2025-05-18T10:30:00', flagged: false, riskScore: 0 },
  // PENDING — Manager, Info/Clarification, vague notes
  { id: 't-104', aid: 'AID-87424', agentId: 'u-204', agentName: 'Nina Watson', agentInitials: 'NW', agentColor: 'bg-amber-600', department: 'Manager', partner: '', reason: 'Information / Clarification', notes: 'needs help', status: 'pending_review', createdAt: '2025-05-18T10:05:00', flagged: true, flagReasons: ['Notes required: Transfers to the Manager department must include a reason why the agent could not resolve.', 'Notes required: Transfers for Information/Clarification must include notes explaining what was attempted first.'], riskScore: 70 },
  // VALID — Account Access with proper notes
  { id: 't-105', aid: 'AID-87425', agentId: 'u-205', agentName: 'James Osei', agentInitials: 'JO', agentColor: 'bg-sky-600', department: 'Credit', partner: 'Experian', reason: 'Account Access', notes: 'Customer locked out after password reset link expired. Attempted manual verification — security questions not matching. Transferring to credit team for identity verification.', status: 'completed', createdAt: '2025-05-18T09:50:00', flagged: false, riskScore: 0 },
  // INVALID — reviewed by Jordan
  { id: 't-106', aid: 'AID-87420', agentId: 'u-201', agentName: 'Tom Bradley', agentInitials: 'TB', agentColor: 'bg-cyan-500', department: 'Partners', partner: 'Transunion', reason: 'Information / Clarification', notes: 'credit stuff', status: 'invalid', createdAt: '2025-05-17T15:20:00', flagged: true, flagReasons: ['Insufficient detail: notes must be at least 30 characters for Information / Clarification transfers.'], reviewedBy: 'Jordan Mills', reviewedAt: '2025-05-17T16:00:00', riskScore: 35, managerNote: 'Please describe the specific query before transferring. "Credit stuff" does not give the partner team enough context.' },
  // VALID — Customer Request
  { id: 't-107', aid: 'AID-87419', agentId: 'u-202', agentName: 'Aisha Patel', agentInitials: 'AP', agentColor: 'bg-rose-500', department: 'Fraud', partner: '', reason: 'Fraud Concern', notes: 'Customer received a text they did not request asking them to verify their account. Concerned about phishing. Transferring to fraud prevention.', status: 'completed', createdAt: '2025-05-17T14:10:00', flagged: false, riskScore: 0 },
  // VALID — Customer Request
  { id: 't-108', aid: 'AID-87418', agentId: 'u-203', agentName: 'Carlos Reyes', agentInitials: 'CR', agentColor: 'bg-lime-600', department: 'Top of Queue', partner: '', reason: 'Customer Request', notes: 'Customer explicitly requested to speak with priority queue due to an ongoing complaint that has not been resolved after two previous calls.', status: 'completed', createdAt: '2025-05-17T13:45:00', flagged: false, riskScore: 0 },
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

export const MANAGERS: User[] = [
  { id: 'u-001', name: 'Alex Carter', email: 'alex.carter@transferiq.internal', role: 'manager', aid: 'AID-00001', department: 'Operations', status: 'active', createdAt: '2024-01-15' },
  { id: 'u-002', name: 'Jordan Mills', email: 'jordan.mills@transferiq.internal', role: 'manager', aid: 'AID-00002', department: 'Operations', status: 'active', createdAt: '2024-01-15' },
];

export const AGENTS: User[] = [
  // Alex Carter's team (managerId: 'u-001')
  { id: 'u-101', name: 'Jessica Lee', email: 'jessica.lee@transferiq.internal', role: 'agent', aid: 'AID-87321', brid: 'BRID-10421', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-02-01' },
  { id: 'u-102', name: 'Michael Chen', email: 'michael.chen@transferiq.internal', role: 'agent', aid: 'AID-87320', brid: 'BRID-10422', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-02-01' },
  { id: 'u-103', name: 'Emily Rodriguez', email: 'emily.rodriguez@transferiq.internal', role: 'agent', aid: 'AID-87319', brid: 'BRID-10423', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-02-15' },
  { id: 'u-104', name: 'David Park', email: 'david.park@transferiq.internal', role: 'agent', aid: 'AID-87318', brid: 'BRID-10424', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-03-01' },
  { id: 'u-105', name: 'Lisa Anderson', email: 'lisa.anderson@transferiq.internal', role: 'agent', aid: 'AID-87317', brid: 'BRID-10425', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-03-10' },
  { id: 'u-106', name: 'Ryan Kim', email: 'ryan.kim@transferiq.internal', role: 'agent', aid: 'AID-87316', brid: 'BRID-10426', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-03-15' },
  { id: 'u-107', name: 'Sarah Torres', email: 'sarah.torres@transferiq.internal', role: 'agent', aid: 'AID-87315', brid: 'BRID-10427', department: 'Operations', managerId: 'u-001', status: 'active', createdAt: '2024-04-01' },
  { id: 'u-108', name: 'Will Brooks', email: 'will.brooks@transferiq.internal', role: 'agent', aid: 'AID-87314', brid: 'BRID-10428', department: 'Operations', managerId: 'u-001', status: 'suspended', createdAt: '2024-04-15' },
  // Jordan Mills's team (managerId: 'u-002')
  { id: 'u-201', name: 'Tom Bradley', email: 'tom.bradley@transferiq.internal', role: 'agent', aid: 'AID-87421', brid: 'BRID-20421', department: 'Operations', managerId: 'u-002', status: 'active', createdAt: '2024-02-01' },
  { id: 'u-202', name: 'Aisha Patel', email: 'aisha.patel@transferiq.internal', role: 'agent', aid: 'AID-87422', brid: 'BRID-20422', department: 'Operations', managerId: 'u-002', status: 'active', createdAt: '2024-02-15' },
  { id: 'u-203', name: 'Carlos Reyes', email: 'carlos.reyes@transferiq.internal', role: 'agent', aid: 'AID-87423', brid: 'BRID-20423', department: 'Operations', managerId: 'u-002', status: 'active', createdAt: '2024-03-01' },
  { id: 'u-204', name: 'Nina Watson', email: 'nina.watson@transferiq.internal', role: 'agent', aid: 'AID-87424', brid: 'BRID-20424', department: 'Operations', managerId: 'u-002', status: 'active', createdAt: '2024-03-15' },
  { id: 'u-205', name: 'James Osei', email: 'james.osei@transferiq.internal', role: 'agent', aid: 'AID-87425', brid: 'BRID-20425', department: 'Operations', managerId: 'u-002', status: 'active', createdAt: '2024-04-01' },
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

export const SEED_SUGGESTIONS: AgentSuggestion[] = [
  {
    id: 'sg-001',
    agentId: 'u-101',
    agentName: 'Jessica Lee',
    agentInitials: 'JL',
    agentColor: 'bg-purple-500',
    category: 'knowledge_gap',
    message: 'Customers keep asking about overseas transfer fees but the FAQ does not cover this. Several calls today ended in transfers that could have been resolved if we had a clear policy doc.',
    createdAt: '2025-05-18T09:00:00',
    isRead: false,
  },
  {
    id: 'sg-002',
    agentId: 'u-102',
    agentName: 'Michael Chen',
    agentInitials: 'MC',
    agentColor: 'bg-teal-500',
    category: 'customer_trend',
    message: 'Multiple customers today were confused about the PayPlan debt management timeline after referral. They expected a callback within 24 hours but PayPlan says 3–5 days. Recommend updating what we tell customers at point of transfer.',
    createdAt: '2025-05-17T16:00:00',
    isRead: false,
  },
  {
    id: 'sg-003',
    agentId: 'u-201',
    agentName: 'Tom Bradley',
    agentInitials: 'TB',
    agentColor: 'bg-cyan-500',
    category: 'process_issue',
    message: 'The transfer system was slow between 2–4 PM. Calls were dropping during warm transfers to Partners. Happened three times. Worth flagging to IT.',
    createdAt: '2025-05-18T10:00:00',
    isRead: false,
  },
];

export const SEED_CALL_VOLUMES: CallVolume[] = [
  { id: 'cv-001', managerId: 'u-001', weekOf: '2025-05-12', totalCalls: 210, enteredAt: '2025-05-12T09:00:00' },
  { id: 'cv-002', managerId: 'u-002', weekOf: '2025-05-12', totalCalls: 185, enteredAt: '2025-05-12T09:15:00' },
];

export const SEED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-fraud',
    department: 'Fraud',
    isActive: true,
    summary: 'Fraud transfers are treated with the highest priority. Any genuine fraud concern or customer-reported suspicion is automatically valid.',
    validReasons: [
      { reason: 'Customer reports unrecognised transactions', example: 'Customer sees a £45 charge from an unknown merchant they did not make.' },
      { reason: 'Suspected identity theft or account takeover', example: 'Customer found new accounts opened in their name without consent.' },
      { reason: 'Lost or stolen card requiring urgent action', example: 'Customer\'s card was stolen and they need the account frozen immediately.' },
      { reason: 'Fraud Concern selected as transfer reason', example: 'Any transfer with reason "Fraud Concern" is automatically valid.' },
    ],
    invalidReasons: [
      { reason: 'General billing queries that are not fraud-related', example: 'Customer wants to dispute a fee they agreed to — this is a billing query, not fraud.' },
      { reason: 'Transferring simply because the customer is unhappy', example: 'Customer is upset about an interest rate — this should go to Complaints, not Fraud.' },
    ],
    tips: [
      'Always document the customer\'s specific concern in your notes before transferring.',
      'If the customer says "I didn\'t make this transaction," that is sufficient for a Fraud transfer.',
      'Check the transaction date and merchant name to include in your notes.',
    ],
  },
  {
    id: 'art-deposits',
    department: 'Deposits',
    isActive: true,
    summary: 'Deposit transfers are valid when the issue is beyond your knowledge or tools. Always check the deposit FAQ and note what you already tried.',
    validReasons: [
      { reason: 'Specific deposit hold type not covered in FAQ', example: 'Customer has a hold type not listed in the deposit hold policy document.' },
      { reason: 'Technical error during deposit process', example: 'Customer sees error code DEP-404 and the system status page shows no outage.' },
      { reason: 'Deposit not reflected after standard processing time', example: 'Customer made a deposit 5 business days ago and it is still not showing.' },
    ],
    invalidReasons: [
      { reason: 'Questions you can resolve using the FAQ', example: 'Asking why a deposit has a 2-day hold — this is in the standard deposit policy.' },
      { reason: 'Transferring without checking self-service resources first', example: 'Customer asks about standard deposit timelines — available on the website.' },
    ],
    tips: [
      'Always check the deposit FAQ before transferring — it covers over 80% of common queries.',
      'Note the deposit amount, date, and type in your notes when transferring.',
      'If you checked the FAQ and could not find the answer, say so in your notes.',
    ],
    minNotes: 'Describe what you checked before transferring (e.g., "Reviewed deposit hold policy page, could not find case type X").',
  },
  {
    id: 'art-partners',
    department: 'Partners',
    isActive: true,
    summary: 'Partner transfers have a high flag rate due to insufficient notes. You must provide at least 30 characters explaining the specific partner query.',
    validReasons: [
      { reason: 'Partner-specific process you do not have access to', example: 'Customer needs their Barclaycard credit limit adjusted — only the partner can action this.' },
      { reason: 'Dispute or query requiring direct partner involvement', example: 'Customer disputes a charge on their ClearScore-linked account.' },
      { reason: 'Customer explicitly needs to speak with the partner', example: 'Customer requesting callback from PayPlan directly about their debt management plan.' },
    ],
    invalidReasons: [
      { reason: 'Vague notes with fewer than 30 characters', example: '"Query about integration" or "needs help" are not sufficient.' },
      { reason: 'Information available on the partner knowledge base', example: 'Questions about standard Experian report timelines are documented in the partner FAQ.' },
    ],
    tips: [
      '42% of partner transfers are flagged — most due to insufficient notes.',
      'Your notes must be at least 30 characters for Information / Clarification transfers.',
      'Specify the partner name, the customer\'s exact query, and what you already tried.',
    ],
    minNotes: 'Minimum 30 characters required. Example: "Customer asking about ClearScore credit file update timeline — not in the FAQ."',
  },
  {
    id: 'art-credit',
    department: 'Credit',
    isActive: true,
    summary: 'Credit transfers cover credit card and account access issues. Account Access transfers require at least 20 characters of detail.',
    validReasons: [
      { reason: 'Account lockout after failed authentication', example: 'Customer locked out after 3 failed password attempts and reset email was not received.' },
      { reason: 'Credit limit query requiring specialist review', example: 'Customer wants a credit limit increase that requires manual underwriting.' },
      { reason: 'Interest rate dispute or adjustment request', example: 'Customer requests a review of their promotional rate that has expired.' },
    ],
    invalidReasons: [
      { reason: 'Account Access notes under 20 characters', example: '"Account locked" alone is not sufficient — describe what steps you took.' },
      { reason: 'Standard credit queries with documented answers', example: 'Minimum payment queries are answered in the credit card FAQ.' },
    ],
    tips: [
      'For Account Access, describe the error the customer is seeing and what you have already tried.',
      'Include the customer\'s last successful login attempt if they know it.',
      'If you reset a password or verified identity, note that before transferring.',
    ],
    minNotes: 'Account Access: minimum 20 characters. Example: "Customer locked after 3 failed attempts. Reset link not arriving to email on file."',
  },
  {
    id: 'art-manager',
    department: 'Manager',
    isActive: true,
    summary: 'Manager transfers are for situations you genuinely cannot resolve. You must document why you could not handle the call yourself.',
    validReasons: [
      { reason: 'Customer explicitly demands to speak with a manager', example: 'Customer states they will not continue until speaking with a manager.' },
      { reason: 'Complaint beyond your authorisation level', example: 'Customer is requesting a goodwill payment above your approved threshold.' },
      { reason: 'Escalated regulatory or compliance concern', example: 'Customer threatens to report to the FCA if the issue is not resolved.' },
    ],
    invalidReasons: [
      { reason: 'Transferring without justification in notes', example: 'Notes like "customer upset" do not explain why you could not resolve the call.' },
      { reason: 'Avoiding a difficult conversation', example: 'Transferring because the customer is angry — this is still resolvable at agent level in most cases.' },
      { reason: 'Missing notes or notes under 10 characters', example: 'Notes are required for all Manager transfers.' },
    ],
    tips: [
      'Always explain in your notes WHY you are unable to resolve — not just that the customer is unhappy.',
      'Try to de-escalate before transferring. Document de-escalation attempts.',
      'Manager transfers are reviewed closely — vague notes will be flagged.',
    ],
    minNotes: 'Notes required. Example: "Customer requesting £200 goodwill gesture, beyond my £50 authorised threshold. De-escalation attempted."',
  },
  {
    id: 'art-topofqueue',
    department: 'Top of Queue',
    isActive: true,
    summary: 'Top of Queue transfers route customers to priority handling. Customer-requested transfers here are automatically valid.',
    validReasons: [
      { reason: 'Customer requests priority handling', example: 'Customer has been waiting a long time and requests to be moved to the front.' },
      { reason: 'Vulnerable customer requiring priority support', example: 'Customer discloses a health condition requiring urgent assistance.' },
      { reason: 'Time-sensitive issue requiring immediate action', example: 'Customer\'s account is being used fraudulently in real time.' },
    ],
    invalidReasons: [
      { reason: 'Routing to Top of Queue simply to avoid a call', example: 'Sending a non-urgent query to Top of Queue to skip handling it.' },
    ],
    tips: [
      'Customer Request is automatically valid here — no extra notes required.',
      'For non-Customer Request reasons, document why priority handling is needed.',
      'Vulnerable customer flags should always be noted explicitly.',
    ],
  },
];

/** Returns the set of agent IDs who report to the given manager. */
export function getManagerTeamIds(managerId: string): Set<string> {
  return new Set(AGENTS.filter((a) => a.managerId === managerId).map((a) => a.id));
}
