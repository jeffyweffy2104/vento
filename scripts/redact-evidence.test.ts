import { describe, expect, it } from "vitest";
import { redactEvidence, redactText } from "./redact-evidence.mjs";

describe("evidence redaction", () => {
  it("redacts credentials recursively", () => {
    expect(redactEvidence({ headers: { authorization: "Bearer abc", cookie: "session=xyz" }, token: "123" })).toEqual({
      headers: { authorization: "[REDACTED]", cookie: "[REDACTED]" },
      token: "[REDACTED]",
    });
  });

  it("redacts email, phone, and bearer values in free text", () => {
    expect(redactText("jeff@example.com +1 (212) 555-0199 Bearer abc.def")).toBe(
      "[REDACTED_EMAIL] [REDACTED_PHONE] Bearer [REDACTED]",
    );
  });
});
