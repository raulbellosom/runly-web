// src/lib/recaptcha.ts

// Threshold below which a reCAPTCHA v3 score is treated as likely-bot.
// Google's own guidance: 1.0 is very likely human, 0.0 is very likely a bot.
export const RECAPTCHA_MIN_SCORE = 0.5;
export const RECAPTCHA_ACTION = "contact_submit";

export interface RecaptchaVerification {
  success: boolean;
  score?: number;
  action?: string;
}

export async function verifyRecaptcha(token: string, secretKey: string): Promise<RecaptchaVerification> {
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token }).toString(),
  });
  const data = (await response.json()) as {
    success?: unknown;
    score?: unknown;
    action?: unknown;
  };
  return {
    success: data.success === true,
    score: typeof data.score === "number" ? data.score : undefined,
    action: typeof data.action === "string" ? data.action : undefined,
  };
}

export function isRecaptchaAcceptable(result: RecaptchaVerification): boolean {
  if (!result.success) return false;
  if (result.action !== undefined && result.action !== RECAPTCHA_ACTION) return false;
  if (result.score !== undefined && result.score < RECAPTCHA_MIN_SCORE) return false;
  return true;
}

export async function isHumanRecaptcha(token: string, secretKey: string): Promise<boolean> {
  if (!token) return false;
  const result = await verifyRecaptcha(token, secretKey);
  return isRecaptchaAcceptable(result);
}
