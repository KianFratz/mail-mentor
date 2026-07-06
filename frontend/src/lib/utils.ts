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

export function decodeTokenEmail(token: string | null): string | undefined {
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.email as string | undefined;
  } catch {
    return undefined;
  }
}

export function emailToInitials(email?: string): string | undefined {
  if (!email) return undefined;
  const local = email.split("@")[0];
  const parts = local.split(/[._\-]/g).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}