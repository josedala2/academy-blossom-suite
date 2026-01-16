import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeHTML,
  encodeForURL,
  nameSchema,
  emailSchema,
  optionalEmailSchema,
  phoneSchema,
  optionalPhoneSchema,
  biSchema,
  optionalBISchema,
  pastDateSchema,
  dateSchema,
  currencySchema,
  observationSchema,
  longTextSchema,
  addressSchema,
  codeSchema,
  positiveIntSchema,
  hasSQLInjection,
  hasXSSPattern,
  validateFormData,
  passwordSchema,
} from "@/lib/validation";

// ============================================
// SANITIZATION UTILITIES TESTS
// ============================================

describe("sanitizeString", () => {
  it("should trim whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("should remove angle brackets", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
  });

  it("should remove javascript: protocol", () => {
    expect(sanitizeString("javascript:alert(1)")).toBe("alert(1)");
  });

  it("should remove event handlers", () => {
    expect(sanitizeString("onclick=alert(1)")).toBe("");
    expect(sanitizeString("onmouseover=malicious()")).toBe("");
    expect(sanitizeString("onerror=hack()")).toBe("");
  });

  it("should handle normal text without changes", () => {
    expect(sanitizeString("João Silva")).toBe("João Silva");
  });

  it("should handle mixed malicious content", () => {
    expect(sanitizeString("Normal <script>bad</script> onclick=x")).toBe("Normal scriptbad/script ");
  });
});

describe("sanitizeHTML", () => {
  it("should allow whitelisted tags", () => {
    expect(sanitizeHTML("<b>bold</b>")).toBe("<b>bold</b>");
    expect(sanitizeHTML("<i>italic</i>")).toBe("<i>italic</i>");
    expect(sanitizeHTML("<strong>strong</strong>")).toBe("<strong>strong</strong>");
    expect(sanitizeHTML("<em>emphasis</em>")).toBe("<em>emphasis</em>");
    expect(sanitizeHTML("<br>")).toBe("<br>");
    expect(sanitizeHTML("<p>paragraph</p>")).toBe("<p>paragraph</p>");
  });

  it("should remove non-whitelisted tags", () => {
    expect(sanitizeHTML("<script>bad</script>")).toBe("bad");
    expect(sanitizeHTML("<iframe src='evil'></iframe>")).toBe("");
    expect(sanitizeHTML("<div>content</div>")).toBe("content");
  });

  it("should handle mixed content", () => {
    expect(sanitizeHTML("<b>bold</b> and <script>bad</script>")).toBe("<b>bold</b> and bad");
  });

  it("should preserve text without tags", () => {
    expect(sanitizeHTML("plain text")).toBe("plain text");
  });
});

describe("encodeForURL", () => {
  it("should encode special characters", () => {
    expect(encodeForURL("hello world")).toBe("hello%20world");
  });

  it("should encode query parameters", () => {
    expect(encodeForURL("name=João&age=25")).toBe("name%3DJo%C3%A3o%26age%3D25");
  });

  it("should trim before encoding", () => {
    expect(encodeForURL("  test  ")).toBe("test");
  });

  it("should handle accented characters", () => {
    expect(encodeForURL("São Paulo")).toBe("S%C3%A3o%20Paulo");
  });
});

// ============================================
// NAME SCHEMA TESTS
// ============================================

describe("nameSchema", () => {
  it("should accept valid names", () => {
    expect(nameSchema.safeParse("João Silva").success).toBe(true);
    expect(nameSchema.safeParse("Maria").success).toBe(true);
    expect(nameSchema.safeParse("José-Maria da Costa").success).toBe(true);
    expect(nameSchema.safeParse("O'Connor").success).toBe(true);
  });

  it("should reject names that are too short", () => {
    const result = nameSchema.safeParse("A");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("pelo menos 2 caracteres");
    }
  });

  it("should reject names that are too long", () => {
    const longName = "A".repeat(101);
    const result = nameSchema.safeParse(longName);
    expect(result.success).toBe(false);
  });

  it("should reject names with numbers", () => {
    const result = nameSchema.safeParse("João123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("letras, espaços, hífens");
    }
  });

  it("should reject names with special characters", () => {
    expect(nameSchema.safeParse("João@Silva").success).toBe(false);
    expect(nameSchema.safeParse("Maria!").success).toBe(false);
    expect(nameSchema.safeParse("Test<script>").success).toBe(false);
  });

  it("should sanitize XSS attempts", () => {
    // Names with angle brackets should fail the regex before sanitization
    expect(nameSchema.safeParse("<script>João</script>").success).toBe(false);
  });
});

// ============================================
// EMAIL SCHEMA TESTS
// ============================================

describe("emailSchema", () => {
  it("should accept valid emails", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    expect(emailSchema.safeParse("USER@EXAMPLE.COM").success).toBe(true);
    expect(emailSchema.safeParse("user.name@domain.co.ao").success).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(emailSchema.safeParse("invalid").success).toBe(false);
    expect(emailSchema.safeParse("@domain.com").success).toBe(false);
    expect(emailSchema.safeParse("user@").success).toBe(false);
    expect(emailSchema.safeParse("user@domain").success).toBe(false);
  });

  it("should lowercase emails", () => {
    const result = emailSchema.safeParse("USER@EXAMPLE.COM");
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });

  it("should trim whitespace", () => {
    const result = emailSchema.safeParse("  user@example.com  ");
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });

  it("should reject emails that are too long", () => {
    const longEmail = "a".repeat(250) + "@test.com";
    expect(emailSchema.safeParse(longEmail).success).toBe(false);
  });
});

describe("optionalEmailSchema", () => {
  it("should accept empty strings", () => {
    expect(optionalEmailSchema.safeParse("").success).toBe(true);
  });

  it("should accept undefined", () => {
    expect(optionalEmailSchema.safeParse(undefined).success).toBe(true);
  });

  it("should accept valid emails", () => {
    expect(optionalEmailSchema.safeParse("test@example.com").success).toBe(true);
  });

  it("should reject invalid non-empty emails", () => {
    expect(optionalEmailSchema.safeParse("invalid-email").success).toBe(false);
  });
});

// ============================================
// PHONE SCHEMA TESTS
// ============================================

describe("phoneSchema", () => {
  it("should accept valid Angolan phone numbers", () => {
    expect(phoneSchema.safeParse("923456789").success).toBe(true);
    expect(phoneSchema.safeParse("912345678").success).toBe(true);
    expect(phoneSchema.safeParse("+244 923456789").success).toBe(true);
    expect(phoneSchema.safeParse("+244923456789").success).toBe(true);
  });

  it("should accept international formats", () => {
    expect(phoneSchema.safeParse("923-456-789").success).toBe(true);
    expect(phoneSchema.safeParse("+244 923 456 789").success).toBe(true);
  });

  it("should reject numbers that are too short", () => {
    expect(phoneSchema.safeParse("12345678").success).toBe(false);
  });

  it("should reject invalid formats", () => {
    expect(phoneSchema.safeParse("abc123456").success).toBe(false);
  });
});

describe("optionalPhoneSchema", () => {
  it("should accept empty strings", () => {
    expect(optionalPhoneSchema.safeParse("").success).toBe(true);
  });

  it("should accept undefined", () => {
    expect(optionalPhoneSchema.safeParse(undefined).success).toBe(true);
  });

  it("should accept valid phones", () => {
    expect(optionalPhoneSchema.safeParse("923456789").success).toBe(true);
  });
});

// ============================================
// BI (BILHETE DE IDENTIDADE) SCHEMA TESTS
// ============================================

describe("biSchema", () => {
  it("should accept valid BI format", () => {
    expect(biSchema.safeParse("000000000LA000").success).toBe(true);
    expect(biSchema.safeParse("123456789AB123").success).toBe(true);
  });

  it("should reject invalid BI formats", () => {
    expect(biSchema.safeParse("123456789").success).toBe(false);
    expect(biSchema.safeParse("ABCDEFGHILA000").success).toBe(false);
    expect(biSchema.safeParse("000000000la000").success).toBe(false); // lowercase letters
    expect(biSchema.safeParse("00000000LA0000").success).toBe(false); // wrong digit count
  });

  it("should reject partial BI", () => {
    expect(biSchema.safeParse("000000000LA").success).toBe(false);
  });
});

describe("optionalBISchema", () => {
  it("should accept empty strings", () => {
    expect(optionalBISchema.safeParse("").success).toBe(true);
  });

  it("should accept undefined", () => {
    expect(optionalBISchema.safeParse(undefined).success).toBe(true);
  });

  it("should accept valid BI", () => {
    expect(optionalBISchema.safeParse("000000000LA000").success).toBe(true);
  });
});

// ============================================
// DATE SCHEMA TESTS
// ============================================

describe("pastDateSchema", () => {
  it("should accept past dates", () => {
    expect(pastDateSchema.safeParse("1990-01-15").success).toBe(true);
    expect(pastDateSchema.safeParse("2000-12-31").success).toBe(true);
  });

  it("should reject future dates", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(pastDateSchema.safeParse(futureDate.toISOString().split("T")[0]).success).toBe(false);
  });

  it("should reject invalid dates", () => {
    expect(pastDateSchema.safeParse("not-a-date").success).toBe(false);
    expect(pastDateSchema.safeParse("").success).toBe(false);
  });
});

describe("dateSchema", () => {
  it("should accept any valid date", () => {
    expect(dateSchema.safeParse("2024-01-15").success).toBe(true);
    expect(dateSchema.safeParse("2030-12-31").success).toBe(true);
  });

  it("should reject invalid dates", () => {
    expect(dateSchema.safeParse("not-a-date").success).toBe(false);
    expect(dateSchema.safeParse("").success).toBe(false);
  });
});

// ============================================
// CURRENCY SCHEMA TESTS
// ============================================

describe("currencySchema", () => {
  it("should accept valid currency values", () => {
    expect(currencySchema.safeParse("1000").success).toBe(true);
    expect(currencySchema.safeParse("1000,50").success).toBe(true);
    expect(currencySchema.safeParse("1000.50").success).toBe(true);
    expect(currencySchema.safeParse("0").success).toBe(true);
  });

  it("should transform comma to dot", () => {
    const result = currencySchema.safeParse("1000,50");
    if (result.success) {
      expect(result.data).toBe("1000.50");
    }
  });

  it("should reject invalid formats", () => {
    expect(currencySchema.safeParse("abc").success).toBe(false);
    expect(currencySchema.safeParse("1000,123").success).toBe(false); // More than 2 decimal places
    expect(currencySchema.safeParse("").success).toBe(false);
    expect(currencySchema.safeParse("-100").success).toBe(false); // Negative
  });
});

// ============================================
// TEXT SCHEMAS TESTS
// ============================================

describe("observationSchema", () => {
  it("should accept valid observations", () => {
    expect(observationSchema.safeParse("Esta é uma observação válida.").success).toBe(true);
    expect(observationSchema.safeParse("").success).toBe(true); // Empty is allowed
  });

  it("should reject text that is too long", () => {
    const longText = "A".repeat(501);
    expect(observationSchema.safeParse(longText).success).toBe(false);
  });

  it("should trim whitespace", () => {
    const result = observationSchema.safeParse("  test  ");
    if (result.success) {
      expect(result.data).toBe("test");
    }
  });
});

describe("longTextSchema", () => {
  it("should accept long text up to 2000 characters", () => {
    const text = "A".repeat(2000);
    expect(longTextSchema.safeParse(text).success).toBe(true);
  });

  it("should reject text over 2000 characters", () => {
    const text = "A".repeat(2001);
    expect(longTextSchema.safeParse(text).success).toBe(false);
  });
});

// ============================================
// ADDRESS SCHEMA TESTS
// ============================================

describe("addressSchema", () => {
  it("should accept valid addresses", () => {
    expect(addressSchema.safeParse("Rua da Missão, nº 123").success).toBe(true);
    expect(addressSchema.safeParse("Av. 21 de Janeiro").success).toBe(true);
  });

  it("should reject addresses that are too short", () => {
    expect(addressSchema.safeParse("AB").success).toBe(false);
  });

  it("should reject addresses that are too long", () => {
    const longAddress = "A".repeat(201);
    expect(addressSchema.safeParse(longAddress).success).toBe(false);
  });
});

// ============================================
// CODE SCHEMA TESTS
// ============================================

describe("codeSchema", () => {
  it("should accept valid codes", () => {
    expect(codeSchema.safeParse("ABC123").success).toBe(true);
    expect(codeSchema.safeParse("TURMA-01").success).toBe(true);
    expect(codeSchema.safeParse("DISC_001").success).toBe(true);
  });

  it("should reject codes with special characters", () => {
    expect(codeSchema.safeParse("ABC@123").success).toBe(false);
    expect(codeSchema.safeParse("CODE!").success).toBe(false);
  });

  it("should reject codes that are too short", () => {
    expect(codeSchema.safeParse("A").success).toBe(false);
  });

  it("should reject codes that are too long", () => {
    const longCode = "A".repeat(21);
    expect(codeSchema.safeParse(longCode).success).toBe(false);
  });
});

// ============================================
// POSITIVE INTEGER SCHEMA TESTS
// ============================================

describe("positiveIntSchema", () => {
  it("should accept positive integers", () => {
    expect(positiveIntSchema.safeParse("1").success).toBe(true);
    expect(positiveIntSchema.safeParse("100").success).toBe(true);
    expect(positiveIntSchema.safeParse("999999").success).toBe(true);
  });

  it("should reject zero", () => {
    expect(positiveIntSchema.safeParse("0").success).toBe(false);
  });

  it("should reject negative numbers", () => {
    expect(positiveIntSchema.safeParse("-1").success).toBe(false);
  });

  it("should reject non-integer values", () => {
    expect(positiveIntSchema.safeParse("1.5").success).toBe(false);
    expect(positiveIntSchema.safeParse("abc").success).toBe(false);
  });
});

// ============================================
// SECURITY HELPERS TESTS
// ============================================

describe("hasSQLInjection", () => {
  it("should detect SELECT statements", () => {
    expect(hasSQLInjection("SELECT * FROM users")).toBe(true);
    expect(hasSQLInjection("name'; SELECT * FROM users --")).toBe(true);
  });

  it("should detect UNION attacks", () => {
    expect(hasSQLInjection("1 UNION SELECT password FROM users")).toBe(true);
  });

  it("should detect DROP statements", () => {
    expect(hasSQLInjection("DROP TABLE users")).toBe(true);
    expect(hasSQLInjection("'; DROP TABLE users; --")).toBe(true);
  });

  it("should detect INSERT/UPDATE/DELETE", () => {
    expect(hasSQLInjection("INSERT INTO users VALUES")).toBe(true);
    expect(hasSQLInjection("UPDATE users SET admin=1")).toBe(true);
    expect(hasSQLInjection("DELETE FROM users")).toBe(true);
  });

  it("should detect SQL comments", () => {
    expect(hasSQLInjection("admin'--")).toBe(true);
    expect(hasSQLInjection("admin'/*comment*/")).toBe(true);
  });

  it("should detect OR injection", () => {
    expect(hasSQLInjection("' OR '1'='1")).toBe(true);
    expect(hasSQLInjection("' OR 1=1 --")).toBe(true);
  });

  it("should not flag normal text", () => {
    expect(hasSQLInjection("João Silva")).toBe(false);
    expect(hasSQLInjection("Normal observation text")).toBe(false);
    expect(hasSQLInjection("Email: test@example.com")).toBe(false);
  });
});

describe("hasXSSPattern", () => {
  it("should detect script tags", () => {
    expect(hasXSSPattern("<script>alert('xss')</script>")).toBe(true);
    expect(hasXSSPattern("<SCRIPT>alert(1)</SCRIPT>")).toBe(true);
  });

  it("should detect iframe tags", () => {
    expect(hasXSSPattern("<iframe src='evil.com'>")).toBe(true);
  });

  it("should detect javascript: protocol", () => {
    expect(hasXSSPattern("javascript:alert(1)")).toBe(true);
  });

  it("should detect event handlers", () => {
    expect(hasXSSPattern("<img onerror='alert(1)'>")).toBe(true);
    expect(hasXSSPattern("<div onclick='malicious()'>")).toBe(true);
    expect(hasXSSPattern("<body onload='hack()'>")).toBe(true);
  });

  it("should detect data: URIs", () => {
    expect(hasXSSPattern("data:text/html,<script>")).toBe(true);
  });

  it("should detect expression in style", () => {
    expect(hasXSSPattern("style='expression(alert(1))'")).toBe(true);
  });

  it("should not flag normal text", () => {
    expect(hasXSSPattern("João Silva")).toBe(false);
    expect(hasXSSPattern("Normal text with <b>bold</b>")).toBe(false);
    expect(hasXSSPattern("Email: test@example.com")).toBe(false);
  });
});

describe("validateFormData", () => {
  it("should pass valid data", () => {
    const data = {
      name: "João Silva",
      email: "joao@example.com",
      observation: "Normal observation",
    };
    const result = validateFormData(data);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect SQL injection in form fields", () => {
    const data = {
      name: "admin'; DROP TABLE users; --",
      email: "test@example.com",
    };
    const result = validateFormData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("name");
  });

  it("should detect XSS in form fields", () => {
    const data = {
      comment: "<script>alert('xss')</script>",
      name: "Test User",
    };
    const result = validateFormData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("XSS"))).toBe(true);
  });

  it("should skip null and undefined values", () => {
    const data = {
      name: "Valid Name",
      optional: null,
      another: undefined,
    };
    const result = validateFormData(data);
    expect(result.isValid).toBe(true);
  });

  it("should allow disabling SQL check", () => {
    const data = {
      query: "SELECT * FROM users", // would fail with SQL check enabled
    };
    const result = validateFormData(data, { checkSQL: false });
    expect(result.isValid).toBe(true);
  });

  it("should allow disabling XSS check", () => {
    const data = {
      content: "<script>alert(1)</script>", // would fail with XSS check enabled
    };
    const result = validateFormData(data, { checkXSS: false });
    expect(result.isValid).toBe(true);
  });

  it("should handle nested objects", () => {
    const data = {
      user: {
        name: "Valid",
        email: "<script>xss</script>",
      },
    };
    const result = validateFormData(data);
    // Nested objects are converted to strings, so this might fail differently
    expect(result.isValid).toBe(false);
  });
});

// ============================================
// PASSWORD SCHEMA TESTS
// ============================================

describe("passwordSchema", () => {
  it("should accept strong passwords", () => {
    expect(passwordSchema.safeParse("Password1!").success).toBe(true);
    expect(passwordSchema.safeParse("StrongP@ss123").success).toBe(true);
    expect(passwordSchema.safeParse("Complex#Password99").success).toBe(true);
  });

  it("should reject passwords that are too short", () => {
    const result = passwordSchema.safeParse("Pass1!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("8 caracteres");
    }
  });

  it("should reject passwords without uppercase", () => {
    const result = passwordSchema.safeParse("password1!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("maiúscula"))).toBe(true);
    }
  });

  it("should reject passwords without lowercase", () => {
    const result = passwordSchema.safeParse("PASSWORD1!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("minúscula"))).toBe(true);
    }
  });

  it("should reject passwords without numbers", () => {
    const result = passwordSchema.safeParse("Password!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("número"))).toBe(true);
    }
  });

  it("should reject passwords without special characters", () => {
    const result = passwordSchema.safeParse("Password123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("especial"))).toBe(true);
    }
  });
});
