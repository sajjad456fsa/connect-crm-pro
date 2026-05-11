import { describe, expect, it } from "vitest";
import { signAccessToken, verifyToken } from "../jwt";

const testPayload = { userId: "test-user", role: "SALES_AGENT" };

describe("jwt utilities", () => {
  it("creates and verifies an access token", () => {
    const token = signAccessToken(testPayload);
    expect(token).toBeTypeOf("string");

    const verified = verifyToken<typeof testPayload>(token);
    expect(verified.userId).toBe(testPayload.userId);
    expect(verified.role).toBe(testPayload.role);
  });
});
