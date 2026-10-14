import { describe, expect, it } from "vitest";
import { privateHash, waitlistInput } from "./waitlist";

describe("waitlist validation", () => {
  it("normalizes a valid signup", () => {
    const result = waitlistInput.parse({ email: "  Person@Example.COM ", phone: "+12125550123", smsConsent: true });
    expect(result.email).toBe("person@example.com");
    expect(result.phone).toBe("+12125550123");
  });

  it("rejects consent without a phone", () => {
    expect(() => waitlistInput.parse({ email: "person@example.com", smsConsent: true })).toThrow();
  });

  it("creates stable non-reversible abuse identifiers", () => {
    expect(privateHash("127.0.0.1", "a".repeat(32))).toBe(privateHash("127.0.0.1", "a".repeat(32)));
    expect(privateHash("127.0.0.1", "a".repeat(32))).not.toContain("127.0.0.1");
  });
});
