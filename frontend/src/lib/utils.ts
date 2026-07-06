import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string, fallback = "U"): string {
  if (!name?.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function decodeTokenPayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getUserInitials(token: string | null): string {
  const payload = decodeTokenPayload(token);
  return getInitials(payload?.name as string | undefined);
}
