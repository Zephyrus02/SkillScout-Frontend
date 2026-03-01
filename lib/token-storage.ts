/**
 * Secure in-memory token storage
 *
 * Access tokens should NEVER be stored in localStorage due to XSS vulnerabilities.
 * This module provides in-memory storage that is cleared when the page is closed.
 *
 * Refresh tokens are handled via HttpOnly cookies by the backend (secure).
 */

// In-memory storage for access token
let accessToken: string | null = null;

/** Store access token in memory */
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

/** Get access token from memory */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/** Clear access token from memory */
export const clearAccessToken = (): void => {
  accessToken = null;
};

/** Check if access token exists and is non-empty */
export const hasAccessToken = (): boolean => {
  return accessToken !== null && accessToken.trim().length > 0;
};
