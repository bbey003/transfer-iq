'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BookOpen, CheckCircle, XCircle, AlertCircle, Search,
  ChevronDown, ChevronUp, Shield, CreditCard, Users, Briefcase, TrendingUp, UserCheck,
} from 'lucide-react';

interface Article {
  id: string;
  department: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  summary: string;
  validReasons: { reason: string; example?: string }[];
  invalidReasons: { reason: string; example?: string }[];
  tips: string[];
  minNotes?: string;
}

const ARTICLES: Article[] = [
  {
    id: 'fraud',
    department: 'Fraud',
    icon: Shield,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
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
    id: 'deposits',
    department: 'Deposits',
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
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
    id: 'partners',
    department: 'Partners',
    icon: Users,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
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
    id: 'credit',
    department: 'Credit',
    icon: CreditCard,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
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
    id: 'manager',
    department: 'Manager',
    icon: Briefcase,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
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
    id: 'topofqueue',
    department: 'Top of Queue',
    icon: UserCheck,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
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

function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = article.icon;

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', article.iconBg)}>
          <Icon className={cn('w-5 h-5', article.iconColor)} />
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
            {/* Valid reasons */}
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

            {/* Invalid reasons */}
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

          {/* Tips */}
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

  const filtered = ARTICLES.filter((a) =>
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
          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Use these articles to understand what qualifies as a valid transfer before logging. Referencing the correct criteria reduces flags and helps you improve your transfer accuracy.
            </p>
          </div>

          {/* Search */}
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

          {/* Articles */}
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
