/**
 * Pure logic used by AuthActionBridge to decide where to send the user
 * when they land on the app from an email link.
 *
 * Centralizing it here lets us unit-test the routing rules without
 * spinning up React Router or mocking Supabase.
 */

export type AuthRedirectInput = {
  pathname: string;
  search: string;
};

export type AuthRedirectResult = {
  to: string;
  replace: true;
} | null;

/**
 * Given the current location, return the route the bridge should redirect to,
 * or `null` if the bridge should do nothing.
 *
 * Rules:
 * - `?auth_action=confirm&token_hash=...&type=...` (anywhere except already on
 *   `/auth/confirm`) → forward to `/auth/confirm` preserving token_hash, type
 *   and an optional `next` (only relative paths).
 * - `?auth_action=email-confirmed` on `/` → `/auth?verified=1`.
 * - Otherwise → null.
 */
export function resolveAuthRedirect({
  pathname,
  search,
}: AuthRedirectInput): AuthRedirectResult {
  const params = new URLSearchParams(search);
  const authAction = params.get("auth_action");
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const next = params.get("next");

  if (
    authAction === "confirm" &&
    tokenHash &&
    type &&
    pathname !== "/auth/confirm"
  ) {
    const nextParams = new URLSearchParams();
    nextParams.set("token_hash", tokenHash);
    nextParams.set("type", type);
    // Only forward `next` when it's a safe relative path — never absolute URLs.
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      nextParams.set("next", next);
    }
    return { to: `/auth/confirm?${nextParams.toString()}`, replace: true };
  }

  if (authAction === "email-confirmed" && pathname === "/") {
    return { to: "/auth?verified=1", replace: true };
  }

  return null;
}
