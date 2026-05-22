import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export interface WebflowEnv {
  token: string
  siteId: string
}

export interface FirebaseEnv {
  projectId: string
  clientEmail: string
  privateKey: string
  storageBucket: string
}

export interface ImporterEnv {
  webflow: WebflowEnv
  firebase: FirebaseEnv
}

const REQUIRED = [
  'WEBFLOW_API_TOKEN',
  'WEBFLOW_SITE_ID',
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'FIREBASE_STORAGE_BUCKET',
] as const

export function validateEnv(source: Record<string, string | undefined>): ImporterEnv {
  const missing: string[] = []
  for (const key of REQUIRED) {
    if (!source[key]) missing.push(key)
  }
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }
  return {
    webflow: {
      token: source.WEBFLOW_API_TOKEN!,
      siteId: source.WEBFLOW_SITE_ID!,
    },
    firebase: {
      projectId: source.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: source.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: source.FIREBASE_ADMIN_PRIVATE_KEY!,
      storageBucket: source.FIREBASE_STORAGE_BUCKET!,
    },
  }
}

export function loadEnvLocal(): void {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const envPath = resolve(here, '../../../.env.local')
    const txt = readFileSync(envPath, 'utf8')
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    process.stderr.write(`[warn] could not read .env.local: ${(err as Error).message}\n`)
  }
}

export function loadValidatedEnv(): ImporterEnv {
  loadEnvLocal()
  return validateEnv(process.env)
}
