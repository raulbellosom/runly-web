// src/lib/__tests__/mailer.test.ts
import { describe, expect, it, vi } from "vitest";
import { buildContactEmail, sendContactEmail } from "../mailer";
import type { ContactFormPayload } from "../contact-schema";

const payload: ContactFormPayload = {
  fullName: "Raúl Gómez",
  companyName: "Maquinaria y Canteras",
  email: "raul@miempresa.com",
  phone: "+52 55 1234 5678",
  teamSize: "6 a 20 personas",
  interest: "Solicitar demostración virtual",
  needs: "Inventario multialmacén y chat de soporte integrado",
  consent: true,
  website: "",
  locale: "es",
  renderedAtMs: Date.now(),
  recaptchaToken: "test-token",
};

describe("buildContactEmail", () => {
  it("includes every submitted field in the email body", () => {
    const email = buildContactEmail(payload);
    expect(email.subject).toContain("Maquinaria y Canteras");
    expect(email.text).toContain("raul@miempresa.com");
    expect(email.text).toContain("+52 55 1234 5678");
    expect(email.text).toContain("Inventario multialmacén");
  });
});

describe("sendContactEmail", () => {
  it("calls the transporter sendMail with the built email and resolves true on success", async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: "abc" });
    const fakeTransporter = { sendMail } as unknown as Parameters<typeof sendContactEmail>[1];

    const result = await sendContactEmail(payload, fakeTransporter, {
      from: "no-reply@runly.mx",
      to: "sales@runly.mx",
    });

    expect(result.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const call = sendMail.mock.calls[0][0];
    expect(call.from).toBe("no-reply@runly.mx");
    expect(call.to).toBe("sales@runly.mx");
    expect(call.replyTo).toBe(payload.email);
  });

  it("returns ok false when the transporter throws", async () => {
    const sendMail = vi.fn().mockRejectedValue(new Error("SMTP down"));
    const fakeTransporter = { sendMail } as unknown as Parameters<typeof sendContactEmail>[1];

    const result = await sendContactEmail(payload, fakeTransporter, {
      from: "no-reply@runly.mx",
      to: "sales@runly.mx",
    });

    expect(result.ok).toBe(false);
  });
});
