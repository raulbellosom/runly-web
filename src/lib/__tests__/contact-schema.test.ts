// src/lib/__tests__/contact-schema.test.ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "../contact-schema";

const validPayload = {
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
  renderedAtMs: Date.now() - 5000,
};

describe("contactSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false", () => {
    const result = contactSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a non-empty honeypot field", () => {
    const result = contactSchema.safeParse({ ...validPayload, website: "http://spam.example" });
    expect(result.success).toBe(false);
  });

  it("rejects a needs field that is too short", () => {
    const result = contactSchema.safeParse({ ...validPayload, needs: "hi" });
    expect(result.success).toBe(false);
  });
});
