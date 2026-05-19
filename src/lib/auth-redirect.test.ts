import { describe, it, expect } from "vitest";
import { resolveAuthRedirect } from "./auth-redirect";

describe("resolveAuthRedirect", () => {
  it("forwards a signup confirmation link from / to /auth/confirm", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=confirm&token_hash=abc123&type=signup",
    });
    expect(result).toEqual({
      to: "/auth/confirm?token_hash=abc123&type=signup",
      replace: true,
    });
  });

  it("forwards a recovery link from / to /auth/confirm", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=confirm&token_hash=xyz&type=recovery",
    });
    expect(result?.to).toBe("/auth/confirm?token_hash=xyz&type=recovery");
  });

  it("forwards a confirm link even when deep-linked on a random path", () => {
    const result = resolveAuthRedirect({
      pathname: "/dashboard",
      search: "?auth_action=confirm&token_hash=t&type=signup",
    });
    expect(result?.to).toBe("/auth/confirm?token_hash=t&type=signup");
  });

  it("preserves a safe relative `next` param", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search:
        "?auth_action=confirm&token_hash=t&type=magiclink&next=%2Fdashboard",
    });
    expect(result?.to).toBe(
      "/auth/confirm?token_hash=t&type=magiclink&next=%2Fdashboard",
    );
  });

  it("drops an absolute / open-redirect `next` value", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search:
        "?auth_action=confirm&token_hash=t&type=signup&next=https%3A%2F%2Fevil.com",
    });
    expect(result?.to).toBe("/auth/confirm?token_hash=t&type=signup");
  });

  it("drops a protocol-relative `next` (//evil.com)", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=confirm&token_hash=t&type=signup&next=%2F%2Fevil.com",
    });
    expect(result?.to).toBe("/auth/confirm?token_hash=t&type=signup");
  });

  it("does not loop when already on /auth/confirm", () => {
    const result = resolveAuthRedirect({
      pathname: "/auth/confirm",
      search: "?auth_action=confirm&token_hash=t&type=signup",
    });
    expect(result).toBeNull();
  });

  it("ignores incomplete confirm links (missing token_hash)", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=confirm&type=signup",
    });
    expect(result).toBeNull();
  });

  it("ignores incomplete confirm links (missing type)", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=confirm&token_hash=t",
    });
    expect(result).toBeNull();
  });

  it("redirects email-confirmed landing on / to /auth?verified=1", () => {
    const result = resolveAuthRedirect({
      pathname: "/",
      search: "?auth_action=email-confirmed",
    });
    expect(result).toEqual({ to: "/auth?verified=1", replace: true });
  });

  it("does not act on email-confirmed when not on /", () => {
    const result = resolveAuthRedirect({
      pathname: "/dashboard",
      search: "?auth_action=email-confirmed",
    });
    expect(result).toBeNull();
  });

  it("does nothing on a plain page load", () => {
    expect(resolveAuthRedirect({ pathname: "/", search: "" })).toBeNull();
    expect(
      resolveAuthRedirect({ pathname: "/explorer", search: "?q=salle" }),
    ).toBeNull();
  });
});
