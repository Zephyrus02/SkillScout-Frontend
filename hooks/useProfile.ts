/**
 * useProfile — loads the full candidate profile from GET /profile and exposes
 * each section as typed slices. Components seed their local state from these
 * slices and then call the individual profileAPI.* methods directly to save.
 *
 * Uses module-level request deduplication so all components mounted in the
 * same render cycle share one network request.
 */

import { useState, useEffect, useCallback } from "react";
import { profileAPI, type FullProfile } from "@/lib/api";

// ── Module-level dedup cache ──────────────────────────────────────────────────
let _cache: FullProfile | null = null;
let _cacheAge = 0;
let _inflightPromise: Promise<FullProfile | null> | null = null;
const TTL = 30_000; // 30 s

async function fetchOnce(): Promise<FullProfile | null> {
  if (_cache && Date.now() - _cacheAge < TTL) return _cache;
  if (_inflightPromise) return _inflightPromise;
  _inflightPromise = profileAPI
    .getFullProfile()
    .then((res) => {
      _cache = res.data;
      _cacheAge = Date.now();
      return _cache;
    })
    .catch((e: unknown) => {
      const status = (e as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404) return null;
      throw e;
    })
    .finally(() => {
      _inflightPromise = null;
    });
  return _inflightPromise;
}

/** Call after any mutation to force a fresh fetch on the next useProfile() call */
export function invalidateProfileCache() {
  _cache = null;
  _cacheAge = 0;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("profile-invalidated"));
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseProfileReturn {
  profile: FullProfile | null;
  loading: boolean;
  error: string | null;
  /** Re-fetch the full profile from the server */
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<FullProfile | null>(_cache);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (force) invalidateProfileCache();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOnce();
      setProfile(data);
    } catch (e: unknown) {
      const axiosErr = e as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };
      setError(
        axiosErr?.response?.data?.error?.message ??
          axiosErr?.message ??
          "Failed to load profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleInvalidate = () => load();
    window.addEventListener("profile-invalidated", handleInvalidate);
    return () => {
      window.removeEventListener("profile-invalidated", handleInvalidate);
    };
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  return { profile, loading, error, refresh };
}
