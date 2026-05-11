import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "../hash";

describe("hash utilities", () => {
  it("hashes and verifies a password", async () => {
    const password = "SecurePass123!";
    const hash = await hashPassword(password);

    expect(hash).toBeTypeOf("string");
    expect(hash).not.toBe(password);

    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("fails verification for an incorrect password", async () => {
    const password = "SecurePass123!";
    const hash = await hashPassword(password);

    const isValid = await comparePassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });
});
