import 'server-only'
import type { AiGenerateField } from './fieldMap'

export interface PromptContext {
  title?: string
  body?: string
  fieldLabel?: string
  collection?: string
}

const BRAND = `You are a senior content writer for Finanshels, a UAE-based financial-services company offering bookkeeping, VAT filing, corporate tax, payroll, and CFO advisory to SMEs and startups. Write in clear, professional British English. Be accurate, concrete, and helpful to UAE business owners. Never invent statistics, regulations, deadlines, or figures — if a specific number is not provided, write around it rather than fabricating one.`

function plainStrip(text: string, max: number): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

export function buildPrompt(kind: AiGenerateField, ctx: PromptContext): string {
  const title = (ctx.title ?? '').trim()
  const body = plainStrip(ctx.body ?? '', 2400)
  const label = (ctx.fieldLabel ?? '').trim()
  const subject = title || label || ctx.collection || 'this topic'

  switch (kind) {
    case 'title':
      return `${BRAND}

Suggest 3 compelling, specific titles for content about: "${subject}".
${body ? `Context:\n${body.slice(0, 600)}\n` : ''}
Rules: each title under 70 characters, no clickbait, no surrounding quotes.
Return ONLY a numbered list:
1. ...
2. ...
3. ...`

    case 'body':
      return `${BRAND}

Write a comprehensive, well-structured article titled "${subject}".
Include an engaging opening paragraph, 3–5 sections with <h2> subheadings, practical guidance for UAE businesses, and a short closing paragraph. Use <ul>/<li> where a list helps.

Return ONLY clean semantic HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <a> tags. Do NOT include <html>, <head>, <body>, markdown fences, or any commentary — just the article body HTML.`

    case 'summary':
      return `${BRAND}

Write a concise 2–3 sentence summary of the following${title ? ` ("${title}")` : ''} suitable for a listing card or excerpt.
${body ? `Content:\n${body.slice(0, 1200)}\n` : ''}
Return ONLY the summary text — no heading, no quotes.`

    case 'direct_answer':
      return `${BRAND}

Write a direct, factual answer (2–3 sentences) to the main question implied by: "${subject}".
${body ? `Reference content:\n${body.slice(0, 1000)}\n` : ''}
This will be used in AI assistants and answer engines, so lead with the answer. Return ONLY the answer text — no quotes.`

    case 'faq_question':
      return `${BRAND}

Suggest 3 frequently-asked questions a UAE business owner would type about: "${subject}".
Return ONLY a numbered list of 3 questions (each ending in a question mark):
1. ...
2. ...
3. ...`

    case 'faq_items':
      return `${BRAND}

Generate 5 frequently-asked questions with concise, accurate answers about: "${subject}".
${body ? `Reference content:\n${body.slice(0, 1200)}\n` : ''}
Return ONLY a valid JSON array, no commentary, in exactly this shape:
[{"question":"...","answer":"..."}, ...]`

    case 'alt_text':
      return `${BRAND}

Write descriptive alt text (one sentence, under 125 characters) for the main image of content titled "${subject}". Describe what is likely shown for accessibility and SEO. Return ONLY the alt text — no quotes.`

    case 'meta_title':
      return `${BRAND}

Write one SEO page title for "${subject}".
Rules: 50–60 characters, include the primary keyword naturally, compelling in search results.
Return ONLY the title text — no quotes, no length annotation.`

    case 'meta_description':
      return `${BRAND}

Write one meta description for "${subject}".
${body ? `Content:\n${body.slice(0, 800)}\n` : ''}
Rules: 120–160 characters, summarise the value, include a subtle call to action.
Return ONLY the description text — no quotes, no length annotation.`

    case 'focus_keyword':
      return `${BRAND}

Suggest the 3 best SEO focus keywords/phrases UAE business owners would search for, for content titled "${subject}".
${body ? `Context:\n${body.slice(0, 600)}\n` : ''}
Return ONLY a numbered list of 3 short keyword phrases:
1. ...
2. ...
3. ...`

    case 'keywords':
      return `${BRAND}

Suggest 6–8 relevant SEO keywords/phrases for "${subject}", comma-separated on a single line. Return ONLY the comma-separated list — no numbering, no quotes.`

    case 'cta_label':
      return `${BRAND}

Suggest 3 short call-to-action button labels (2–4 words each) for content titled "${subject}". Return ONLY a numbered list:
1. ...
2. ...
3. ...`

    default:
      return `${BRAND}

Write helpful content for the "${label}" field of content titled "${subject}". Return ONLY the field value, no commentary.`
  }
}
