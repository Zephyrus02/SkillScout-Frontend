/**
 * Cache for GET /api/profile response in localStorage so components can show
 * name and profile picture without calling the API on every page.
 * Cleared on logout.
 */

const STORAGE_KEY = "skillscout_profile_cache";

export interface CachedProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  [key: string]: unknown;
}

export function getCachedProfile(): { data: CachedProfile } | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { data: CachedProfile };
  } catch {
    return null;
  }
}

export function setCachedProfile(profile: { data: CachedProfile }): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  } catch {
    // ignore quota / parse errors
  }
}

export function clearCachedProfile(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
