import {
  CMS_COLLECTION_DEFINITIONS,
  type CmsFieldDefinition,
  type CmsCollectionDefinition,
} from '../src/lib/cms/collectionDefinitions'

// --- replicate the editor's main-editor vs sidebar classification (src/app/admin/cms/page.tsx) ---
function isLongBodyField(f: CmsFieldDefinition): boolean {
  if (f.type === 'blocks') return true
  if (f.type !== 'textarea') return false
  const n = f.name.toLowerCase()
  return (
    n.includes('body') || n.includes('content') || n.includes('definition') ||
    n.includes('answer') || n.includes('article') || n.includes('story') ||
    n.includes('full_bio') || n === 'bio' || n === 'long_description' || n === 'full_description'
  )
}
function isMainContentField(f: CmsFieldDefinition): boolean {
  if (f.type === 'blocks') return true
  if (f.type !== 'textarea') return false
  if (f.required) return true
  return isLongBodyField(f)
}
function isPrimary(f: CmsFieldDefinition, slug: string, title: string): boolean {
  if (f.name === 'status') return false
  if (f.name === title || f.name === slug) return true
  return isMainContentField(f)
}
function sortPrimary(fields: CmsFieldDefinition[], slug: string, title: string): CmsFieldDefinition[] {
  const rank = (f: CmsFieldDefinition) => (f.name === title ? 0 : f.name === slug ? 1 : 2)
  return fields.map((f, i) => ({ f, i, r: rank(f) })).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.f)
}

function fmtType(f: CmsFieldDefinition): string {
  const anyF = f as any
  let t = f.type
  if (anyF.referenceCollection) t += ` → ${anyF.referenceCollection}`
  if (anyF.target) t += ` → ${anyF.target}`
  if (anyF.options && Array.isArray(anyF.options)) t += ` {${anyF.options.join(', ')}}`
  return t
}
function row(f: CmsFieldDefinition): string {
  const req = f.required ? ' **·required**' : ''
  return `| ${f.label} | \`${f.name}\` | ${fmtType(f)} |${req ? ' ✅' : ''} |`
}
function table(fields: CmsFieldDefinition[]): string {
  if (!fields.length) return '_None._\n'
  return ['| Field | Key | Type | Required |', '|---|---|---|---|', ...fields.map(row)].join('\n') + '\n'
}

function section(def: CmsCollectionDefinition): string {
  const title = def.titleField
  const slug = def.slugField
  const pub = def.sections.publish ?? []
  const primary = sortPrimary(pub.filter((f) => isPrimary(f, slug, title)), slug, title)
  const side = pub.filter((f) => !isPrimary(f, slug, title) && !(f.name === 'title' && title !== 'title'))

  const lines: string[] = []
  lines.push(`## ${def.label}  \`${def.key}\``)
  lines.push('')
  const meta = [
    `**Singular:** ${def.singularLabel}`,
    `**Title field:** \`${title}\``,
    `**Slug field:** \`${slug}\``,
    def.routePattern ? `**Route:** \`${def.routePattern}\`` : `**Route:** _none (admin-only)_`,
    def.defaultSchemaType ? `**Schema:** ${def.defaultSchemaType}` : '',
  ].filter(Boolean)
  lines.push(meta.join('  ·  '))
  lines.push('')
  lines.push(`> ${def.description}`)
  lines.push('')

  lines.push('### 🖊️ Main editor (center column)')
  lines.push('')
  lines.push('**Primary fields**')
  lines.push('')
  lines.push(table(primary))
  for (const [key, label] of [
    ['card', 'Card'],
    ['listing', 'Listing page'],
    ['detail', 'Detail page'],
    ['blocks', 'Page blocks'],
    ['relations', 'Relationships'],
  ] as const) {
    const fields = def.sections[key] ?? []
    if (fields.length) {
      lines.push(`**${label}**`)
      lines.push('')
      lines.push(table(fields))
    }
  }

  lines.push('### 📋 Sidebar (right rail)')
  lines.push('')
  lines.push('**Publish tab**')
  lines.push('')
  lines.push(table(side))
  for (const [key, label] of [
    ['seo', 'SEO tab'],
    ['aeo', 'AEO tab'],
    ['geo', 'GEO tab'],
  ] as const) {
    const fields = def.sections[key] ?? []
    lines.push(`**${label}**`)
    lines.push('')
    lines.push(table(fields))
  }
  lines.push('---')
  lines.push('')
  return lines.join('\n')
}

const out: string[] = []
out.push('# CMS field inventory — main editor vs sidebar')
out.push('')
out.push('> **Auto-generated** from `src/lib/cms/collectionDefinitions.ts` (the single source of truth).')
out.push('> Regenerate with: `npx tsx scripts/gen-field-inventory.mts > docs/cms/field-inventory.md`')
out.push('> Do not hand-edit.')
out.push('')
out.push('**How the editor is laid out** (`src/app/admin/cms/page.tsx`):')
out.push('')
out.push('- **Main editor (center):** the title + slug, any required/long-form rich-text bodies, then collapsible **Card / Listing / Detail / Page blocks / Relationships** groups.')
out.push('- **Sidebar (right rail):** a **Publish** tab (status, metadata, card/CTA fields) plus **SEO / AEO / GEO** tabs. Tabs only appear when the collection actually has fields for them.')
out.push('')
out.push(`_${CMS_COLLECTION_DEFINITIONS.length} collections._`)
out.push('')
out.push('## Contents')
out.push('')
for (const def of CMS_COLLECTION_DEFINITIONS) {
  out.push(`- [${def.label}](#${def.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${def.key})`)
}
out.push('')
out.push('---')
out.push('')
for (const def of CMS_COLLECTION_DEFINITIONS) {
  out.push(section(def))
}

process.stdout.write(out.join('\n'))
