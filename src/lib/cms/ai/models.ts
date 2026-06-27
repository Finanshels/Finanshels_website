import 'server-only'
import { gateway } from '@ai-sdk/gateway'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { LanguageModel } from 'ai'
import type { AiTier } from './fieldMap'

/**
 * Cost-optimized model router.
 *
 * Generation is split into three tiers (see `fieldMap.ts`). Each tier maps to a
 * concrete model so we spend the least money that still does the job well:
 *   - nano     → cheapest capable model (titles, keywords, CTAs, alt text)
 *   - standard → cheap-but-strong prose (summaries, meta, answers, FAQs)
 *   - quality  → strongest value model for long-form (article bodies, FAQ sets)
 *
 * Primary path is the Vercel AI Gateway: one integration reaches Anthropic,
 * Google (Gemini), OpenAI (GPT), Moonshot (Kimi) and Zhipu (GLM) via
 * "creator/model" slugs. Every slug is env-overridable, so the team can re-tune
 * cost/quality per tier without a code change or redeploy of new logic.
 *
 * Fallback path (no gateway credentials) is direct Anthropic, which keeps local
 * development working with just ANTHROPIC_API_KEY — the original behavior.
 *
 * Env overrides (all optional):
 *   AI_GATEWAY_API_KEY   enable gateway routing (auto-set on Vercel via OIDC)
 *   AI_MODEL_NANO        e.g. "google/gemini-2.5-flash-lite"
 *   AI_MODEL_STANDARD    e.g. "openai/gpt-4.1-mini"
 *   AI_MODEL_QUALITY     e.g. "moonshotai/kimi-k2" | "zai/glm-4.6"
 *   ANTHROPIC_API_KEY    fallback provider when the gateway is not configured
 */

/** Default gateway "creator/model" slug per tier. Override via env. */
const GATEWAY_DEFAULT: Record<AiTier, string> = {
  nano: 'google/gemini-2.5-flash-lite',
  standard: 'google/gemini-2.5-flash',
  quality: 'moonshotai/kimi-k2',
}

/** Direct-Anthropic fallback model per tier (used when the gateway is off). */
const ANTHROPIC_FALLBACK: Record<AiTier, string> = {
  nano: 'claude-haiku-4-5-20251001',
  standard: 'claude-haiku-4-5-20251001',
  quality: 'claude-sonnet-4-6',
}

/** Output-token ceiling per tier — short tiers stay cheap and snappy. */
export const MAX_OUTPUT_TOKENS: Record<AiTier, number> = {
  nano: 400,
  standard: 700,
  quality: 2400,
}

const ENV_OVERRIDE: Record<AiTier, string | undefined> = {
  nano: process.env.AI_MODEL_NANO,
  standard: process.env.AI_MODEL_STANDARD,
  quality: process.env.AI_MODEL_QUALITY,
}

function gatewayEnabled(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim(),
  )
}

function anthropicKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY?.trim() || undefined
}

/** Whether any AI provider is configured. The route returns 503 when false. */
export function isAiConfigured(): boolean {
  return gatewayEnabled() || Boolean(anthropicKey())
}

export interface ResolvedModel {
  model: LanguageModel
  /** Human-readable identifier for logs/telemetry, e.g. "moonshotai/kimi-k2". */
  label: string
}

/**
 * Resolve the concrete model for a tier. Prefers the gateway; falls back to
 * direct Anthropic. Throws when nothing is configured (caller maps to 503).
 */
export function resolveModel(tier: AiTier): ResolvedModel {
  if (gatewayEnabled()) {
    const slug = ENV_OVERRIDE[tier]?.trim() || GATEWAY_DEFAULT[tier]
    return { model: gateway(slug), label: slug }
  }

  const apiKey = anthropicKey()
  if (!apiKey) {
    throw new Error('No AI provider configured (set AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY)')
  }
  const anthropic = createAnthropic({ apiKey })
  const id = ANTHROPIC_FALLBACK[tier]
  return { model: anthropic(id), label: `anthropic/${id}` }
}
