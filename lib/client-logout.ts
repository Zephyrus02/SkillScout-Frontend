/**
 * Synchronous guard while the app is intentionally logging out.
 * The axios 401 handler uses window.location — it must not race AuthContext's
 * router.replace("/") after the session is cleared.
 */
let _clientLogoutInProgress = false;

export function setClientLogoutInProgress(value: boolean) {
  _clientLogoutInProgress = value;
}

export function isClientLogoutInProgress() {
  return _clientLogoutInProgress;
}
