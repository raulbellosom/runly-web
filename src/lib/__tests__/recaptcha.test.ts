// src/lib/__tests__/recaptcha.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { isHumanRecaptcha, isRecaptchaAcceptable, verifyRecaptcha } from "../recaptcha";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(responseBody: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(responseBody),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("verifyRecaptcha", () => {
  it("posts the token and secret to Google and parses a passing response", async () => {
    const fetchMock = stubFetch({ success: true, score: 0.9, action: "contact_submit" });
    const result = await verifyRecaptcha("token-123", "secret-abc");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.google.com/recaptcha/api/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
    const call = fetchMock.mock.calls[0][1];
    expect(call.body).toContain("secret=secret-abc");
    expect(call.body).toContain("response=token-123");
    expect(result).toEqual({ success: true, score: 0.9, action: "contact_submit" });
  });

  it("treats a missing or non-boolean success field as failure", async () => {
    stubFetch({});
    const result = await verifyRecaptcha("token", "secret");
    expect(result.success).toBe(false);
  });
});

describe("isRecaptchaAcceptable", () => {
  it("accepts a successful result with a high score and matching action", () => {
    expect(isRecaptchaAcceptable({ success: true, score: 0.9, action: "contact_submit" })).toBe(true);
  });

  it("rejects when success is false", () => {
    expect(isRecaptchaAcceptable({ success: false })).toBe(false);
  });

  it("rejects a low score", () => {
    expect(isRecaptchaAcceptable({ success: true, score: 0.1, action: "contact_submit" })).toBe(false);
  });

  it("rejects a mismatched action", () => {
    expect(isRecaptchaAcceptable({ success: true, score: 0.9, action: "login" })).toBe(false);
  });
});

describe("isHumanRecaptcha", () => {
  it("returns false immediately for an empty token without calling the network", async () => {
    const fetchMock = stubFetch({ success: true, score: 0.9 });
    const result = await isHumanRecaptcha("", "secret");
    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns true for a valid high-score token", async () => {
    stubFetch({ success: true, score: 0.9, action: "contact_submit" });
    const result = await isHumanRecaptcha("token", "secret");
    expect(result).toBe(true);
  });

  it("returns false for a low-score token", async () => {
    stubFetch({ success: true, score: 0.2, action: "contact_submit" });
    const result = await isHumanRecaptcha("token", "secret");
    expect(result).toBe(false);
  });
});
