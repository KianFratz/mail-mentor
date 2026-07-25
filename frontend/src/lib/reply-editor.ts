export function countWords(text: string): number {
  if (!text) return 0;
  const cleanText = text.replace(/<[^>]*>/g, " ");
  const words = cleanText.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu);

  return words ? words.length : 0;
}

