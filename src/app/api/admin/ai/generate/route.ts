import 'server-only'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { buildPrompt } from '@/lib/cms/ai/prompts'
import { isAiGenerateField, tierForField } from '@/lib/cms/ai/fieldMap'
import { resolveModel, isAiConfigured, MAX_OUTPUT_TOKENS } from '@/lib/cms/ai/models'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  // Auth — admin session required, mirrors every other /api/admin route.
  try {
    await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: 'AI generation is not configured. Set AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY.' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const field = String(body.field ?? '')
  if (!isAiGenerateField(field)) {
    return NextResponse.json({ error: 'Unknown field type' }, { status: 400 })
  }

  // Tier is derived server-side from the field — never trusted from the client.
  const tier = tierForField(field)
  const prompt = buildPrompt(field, {
    title: String(body.title ?? '').slice(0, 600),
    body: String(body.body ?? '').slice(0, 6000),
    fieldLabel: String(body.fieldLabel ?? '').slice(0, 120),
    collection: String(body.collection ?? '').slice(0, 80),
  })

  try {
    const { model } = resolveModel(tier)
    const result = streamText({
      model,
      prompt,
      temperature: 0.6,
      maxOutputTokens: MAX_OUTPUT_TOKENS[tier],
    })
    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[ai/generate] stream error', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
