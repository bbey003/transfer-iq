# TransferIQ

Call centre transfer reporting and quality management platform. Agents log every transferred call, managers review whether transfers were valid, and the system tracks patterns to identify knowledge gaps and coaching needs.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager (Alex Carter's team) | `alex.carter@transferiq.internal` | `manager123` |
| Manager (Jordan Mills' team) | `jordan.mills@transferiq.internal` | `manager123` |
| Agent | `jessica.lee@transferiq.internal` | `agent123` |
| Agent (Jordan's team) | `tom.bradley@transferiq.internal` | `agent123` |
| Admin | `admin@transferiq.internal` | `admin123` |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Analysis (optional)

Transfer submissions can be assessed by Claude against department knowledge articles. Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

Without a key the app falls back to the built-in rule-based constraint engine automatically.

---

## Features

### Agent
- **Log Transfer** — submit a transfer with AID, department, partner, reason, and notes. AI analyses the submission against the relevant knowledge article and flags issues before confirming
- **Transfer History** — view all personal submissions with status, flag reasons, and manager feedback
- **Daily Observations** — submit observations to the manager (knowledge gaps, process issues, customer trends, suggestions)
- **Knowledge Centre** — department-by-department guides on valid and invalid transfer reasons, with examples and tips
- **Phone Book** — internal department extensions and external partner numbers; save personal contacts

### Manager
- **Dashboard** — live stats (total transfers, pending review, valid, invalid) plus a transfer rate card showing the team's week-on-week rate against the <10% target
- **Review Queue** — review flagged transfers inline; mark valid or invalid with optional feedback note for the agent
- **Transfer History** — full history with filters by status, agent, and date; open any transfer for detail review
- **Agent Observations** — read suggestions submitted by agents with category tags; mark read
- **Team Insights** — agent performance breakdown, top departments and reasons, coaching targets
- **Call Volume** — enter weekly total call count to calculate the team transfer rate

### Admin
- **Teams** — multi-team overview showing each manager's team stats and per-agent transfer/invalid counts
- **Knowledge Articles** — edit department articles (summary, valid reasons, invalid reasons, tips, notes requirement, active/inactive toggle); changes are reflected immediately in the Knowledge Centre
- **Departments / Partners / Transfer Reasons** — manage reference data
- **Users** — view all agents and managers with role, team, and status

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (analytics charts)
- **@anthropic-ai/sdk** (AI transfer analysis)
- **localStorage** for client-side persistence (no backend required to run)

## Project Structure

```
src/
  app/
    (dashboard)/      # All authenticated pages
      admin/          # Admin settings and team overview
      dashboard/      # Manager/agent home
      feedback/       # Manager feedback and agent observations
      history/        # Transfer history
      knowledge/      # Knowledge centre
      log-transfer/   # Log a transfer (agent)
      phonebook/      # Internal and external numbers
      team-insights/  # Team analytics
    api/
      analyze-transfer/ # Claude-powered transfer assessment
    login/
  components/
    dashboard/        # Dashboard widgets and review queue
    layout/           # Sidebar, topbar
    transfers/        # Log transfer form
    ui/               # Shared components
  lib/
    auth-context.tsx  # Demo auth with role-based routing
    constraints.ts    # Rule-based transfer analysis engine
    mock-data.ts      # Seed data (agents, managers, transfers, articles)
    transfer-store.tsx # React context store with localStorage persistence
  types/index.ts      # Shared TypeScript types
```
