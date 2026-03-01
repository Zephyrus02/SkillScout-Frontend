/**
 * Secure in-memory user data storage
 *
 * User data containing PII (email, names, user IDs, etc.) should NEVER be stored
 * in localStorage. This module provides in-memory storage that is cleared when the
 * page is closed.
 *
 * For persistence across page refreshes, we store only a session token (random UUID)
 * in localStorage. This token is used to indicate an active session exists, and we
 * fetch full user data from the API on mount.
 */

import type { User } from "../contexts/AuthContext";

let userData: User | null = null;
let sessionToken: string | null = null;

const generateSessionToken = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `session_${crypto.randomUUID()}`;
  }
  return `session_${Math.random().toString(36).slice(2)}`;
};

/** Store user data in memory; persist only a session token to localStorage */
export const setUserData = (user: User | null): void => {
  userData = user;

  if (user) {
    if (!sessionToken) {
      sessionToken =
        (typeof localStorage !== "undefined"
          ? localStorage.getItem("userSessionToken")
          : null) || generateSessionToken();
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("userSessionToken", sessionToken);
    }
  } else {
    sessionToken = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("userSessionToken");
    }
  }
};

/** Get user data from memory */
export const getUserData = (): User | null => {
  return userData;
};

/** Clear user data from memory and remove session token */
export const clearUserData = (): void => {
  userData = null;
  sessionToken = null;
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("userSessionToken");
  }
};

/** Check if a session token exists in localStorage (non-PII check) */
export const hasUserSession = (): boolean => {
  if (typeof localStorage === "undefined") return false;
  const stored = localStorage.getItem("userSessionToken");
  if (!stored) return false;
  if (stored !== sessionToken) sessionToken = stored;
  return !!sessionToken;
};
