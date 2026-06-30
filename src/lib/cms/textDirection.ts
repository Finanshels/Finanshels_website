/**
 * FIX-077: RTL support for Arabic (and other RTL) CMS content. The CMS stores a
 * per-document `language` field (en/ar); detail pages use these helpers to set
 * `dir`/`lang` on the article wrapper so Arabic content reads right-to-left
 * without a full i18n routing overhaul.
 */
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur'])

export function htmlDirFromLanguage(language: unknown): 'rtl' | 'ltr' {
  const lang = typeof language === 'string' ? language.toLowerCase().split('-')[0] : ''
  return lang && RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr'
}

export function htmlLangFromLanguage(language: unknown, fallback = 'en'): string {
  return typeof language === 'string' && language.trim() ? language.trim() : fallback
}
