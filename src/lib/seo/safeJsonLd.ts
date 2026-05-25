/**
 * Serialize a JSON-LD object for safe embedding inside a `<script>` tag.
 *
 * Standard `JSON.stringify` can produce `</script>` sequences from user-supplied
 * CMS content, breaking out of the JSON-LD block and enabling XSS. This helper
 * replaces `<` and `>` with their Unicode escapes (valid JSON, prevents the HTML
 * parser from seeing closing tags) and strips literal U+2028/U+2029 which are
 * valid JSON but illegal in `<script>` in some browsers.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
