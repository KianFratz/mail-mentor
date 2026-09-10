const BLOCK_BREAK_TAGS = /<\/?(p|div|li|ul|ol|h[1-6]|blockquote|tr)[^>]*>/gi;
const LINE_BREAK_TAGS = /<br\s*\/?>/gi;

function decodeHtmlEntities(value: string): string {
  if (typeof window !== "undefined" && "DOMParser" in window) {
    const doc = new DOMParser().parseFromString(value, "text/html");
    return doc.documentElement.textContent ?? "";
  }

  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function htmlToPlainText(value: string | null | undefined): string {
  if (!value) return "";

  const withBreaks = value
    .replace(LINE_BREAK_TAGS, "\n")
    .replace(BLOCK_BREAK_TAGS, "\n");
  const withoutTags = withBreaks.replace(/<[^>]*>/g, "");
  const decoded = decodeHtmlEntities(withoutTags);

  return decoded
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
