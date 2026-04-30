import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { KnowledgeArticle } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface AnalyzeRequest {
  department: string;
  partner: string;
  reason: string;
  notes: string;
  article: KnowledgeArticle | null;
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { department, partner, reason, notes, article } = body;

    let articleContext = '';
    if (article) {
      const validList = article.validReasons.map((r) => `- ${r.reason}${r.example ? ` (e.g. ${r.example})` : ''}`).join('\n');
      const invalidList = article.invalidReasons.map((r) => `- ${r.reason}${r.example ? ` (e.g. ${r.example})` : ''}`).join('\n');
      articleContext = `
KNOWLEDGE ARTICLE FOR ${department.toUpperCase()}:
Summary: ${article.summary}
${article.minNotes ? `Notes requirement: ${article.minNotes}` : ''}

Valid transfer reasons:
${validList}

Invalid transfer reasons:
${invalidList}`;
    }

    const prompt = `You are a quality assurance analyst for a bank's call centre. Your job is to assess whether a call transfer was valid.

${articleContext || `No knowledge article available for ${department}.`}

TRANSFER SUBMITTED:
- Department: ${department}
- Partner: ${partner || 'N/A'}
- Reason: ${reason}
- Agent notes: "${notes || '(none provided)'}"

Assess this transfer. Return ONLY a valid JSON object (no markdown, no explanation outside the JSON) in this exact format:
{
  "status": "completed" | "pending_review",
  "flagReasons": ["reason 1", "reason 2"],
  "riskScore": 0-100,
  "aiExplanation": "One to two sentences explaining your assessment."
}

Rules:
- status "completed" = the transfer appears valid based on the knowledge article
- status "pending_review" = the transfer may be invalid or needs manager review
- flagReasons = list of specific concerns (empty array if none)
- riskScore = 0 (clearly valid) to 100 (clearly invalid), 30-70 = borderline
- aiExplanation = plain English summary for the manager reviewing this transfer`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error('analyze-transfer error:', err);
    return NextResponse.json({ error: 'analysis_failed' }, { status: 500 });
  }
}
