const EMAIL_KEY = "auth_flow_email";

// Carries the user's email between steps of a multi-page auth flow
// (sign-up -> verify-email -> pending-approval, forgot-password -> reset-password)
// via sessionStorage instead of a URL query param, so it doesn't end up in
// browser history, server access logs, or a Referer header.

export function setAuthFlowEmail(email: string): void {
  try {
    sessionStorage.setItem(EMAIL_KEY, email);
  } catch {
    // sessionStorage unavailable (private mode, etc.) - the destination page
    // will just render without a prefilled email.
  }
}

export function getAuthFlowEmail(): string {
  try {
    return sessionStorage.getItem(EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

export function clearAuthFlowEmail(): void {
  try {
    sessionStorage.removeItem(EMAIL_KEY);
  } catch {
    // ignore
  }
}
