/**
 * Centralized validation utilities for OWASP Top 10 compliance
 * - A03:2021 Injection: Input validation and sanitization
 * - A07:2021 XSS: Proper encoding and validation
 */

import { z } from "zod";

// ============================================
// SANITIZATION UTILITIES
// ============================================

/**
 * Sanitize string input to prevent XSS and injection attacks
 * Removes potentially dangerous characters while preserving valid content
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets (basic XSS prevention)
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
};

/**
 * Sanitize HTML content (for cases where HTML is needed)
 * This is a basic sanitizer - for production, use DOMPurify
 */
export const sanitizeHTML = (input: string): string => {
  const tagWhitelist = ["b", "i", "u", "strong", "em", "br", "p"];
  const tagPattern = /<\/?([a-zA-Z]+)[^>]*>/gi;
  
  return input.replace(tagPattern, (match, tagName) => {
    return tagWhitelist.includes(tagName.toLowerCase()) ? match : "";
  });
};

/**
 * Encode string for safe URL usage
 */
export const encodeForURL = (input: string): string => {
  return encodeURIComponent(input.trim());
};

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

/**
 * Name validation schema
 * - Minimum 2 characters, maximum 100
 * - Trimmed and sanitized
 * - Only allows letters, spaces, hyphens, and apostrophes
 */
export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
  .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { 
    message: "Nome deve conter apenas letras, espaços, hífens e apóstrofos" 
  })
  .transform(sanitizeString);

/**
 * Email validation schema
 * - Standard email format
 * - Maximum 255 characters (RFC 5321)
 * - Trimmed and lowercased
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Email inválido" })
  .max(255, { message: "Email deve ter no máximo 255 caracteres" });

/**
 * Optional email schema
 */
export const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Email inválido" })
  .max(255, { message: "Email deve ter no máximo 255 caracteres" })
  .optional()
  .or(z.literal(""));

/**
 * Angolan phone number validation
 * - Must start with 9 and have 9 digits, or include country code
 * - Allows spaces and hyphens for formatting
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(9, { message: "Telefone deve ter pelo menos 9 dígitos" })
  .max(20, { message: "Telefone inválido" })
  .regex(/^(\+244\s?)?9[0-9]{8}$|^[0-9+\s-]{9,20}$/, { 
    message: "Formato de telefone inválido" 
  });

/**
 * Optional phone schema
 */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(20, { message: "Telefone inválido" })
  .regex(/^(\+244\s?)?9[0-9]{8}$|^[0-9+\s-]*$/, { 
    message: "Formato de telefone inválido" 
  })
  .optional()
  .or(z.literal(""));

/**
 * Angolan BI (Bilhete de Identidade) validation
 * - Format: 9 digits followed by 2 letters and 3 digits (e.g., 000000000LA000)
 */
export const biSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{9}[A-Z]{2}[0-9]{3}$/, { 
    message: "Formato de BI inválido (ex: 000000000LA000)" 
  });

/**
 * Optional BI schema
 */
export const optionalBISchema = z
  .string()
  .trim()
  .regex(/^([0-9]{9}[A-Z]{2}[0-9]{3})?$/, { 
    message: "Formato de BI inválido (ex: 000000000LA000)" 
  })
  .optional()
  .or(z.literal(""));

/**
 * Date validation (past dates only, for birth dates)
 */
export const pastDateSchema = z
  .string()
  .min(1, { message: "Data é obrigatória" })
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, { message: "Data deve ser no passado" });

/**
 * Date validation (any valid date)
 */
export const dateSchema = z
  .string()
  .min(1, { message: "Data é obrigatória" })
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, { message: "Data inválida" });

/**
 * Currency/Money validation (Kwanzas)
 * - Must be a positive number
 * - Allows comma or dot as decimal separator
 */
export const currencySchema = z
  .string()
  .min(1, { message: "Valor é obrigatório" })
  .regex(/^[0-9]+([.,][0-9]{1,2})?$/, { 
    message: "Valor inválido (ex: 1000 ou 1000,50)" 
  })
  .transform((val) => val.replace(",", "."));

/**
 * Text area / observation field validation
 * - Maximum 500 characters
 * - Sanitized for XSS
 */
export const observationSchema = z
  .string()
  .trim()
  .max(500, { message: "Texto deve ter no máximo 500 caracteres" })
  .transform(sanitizeString)
  .optional()
  .or(z.literal(""));

/**
 * Long text field validation (for descriptions, etc.)
 * - Maximum 2000 characters
 * - Sanitized for XSS
 */
export const longTextSchema = z
  .string()
  .trim()
  .max(2000, { message: "Texto deve ter no máximo 2000 caracteres" })
  .transform(sanitizeString)
  .optional()
  .or(z.literal(""));

/**
 * Address validation
 */
export const addressSchema = z
  .string()
  .trim()
  .min(5, { message: "Endereço deve ter pelo menos 5 caracteres" })
  .max(200, { message: "Endereço deve ter no máximo 200 caracteres" })
  .transform(sanitizeString);

/**
 * Optional address schema
 */
export const optionalAddressSchema = z
  .string()
  .trim()
  .max(200, { message: "Endereço deve ter no máximo 200 caracteres" })
  .transform(sanitizeString)
  .optional()
  .or(z.literal(""));

/**
 * Code/Reference validation (alphanumeric)
 */
export const codeSchema = z
  .string()
  .trim()
  .min(1, { message: "Código é obrigatório" })
  .max(50, { message: "Código deve ter no máximo 50 caracteres" })
  .regex(/^[a-zA-Z0-9_-]+$/, { 
    message: "Código deve conter apenas letras, números, hífens e underscores" 
  });

/**
 * Positive integer validation
 */
export const positiveIntSchema = z
  .string()
  .regex(/^[0-9]+$/, { message: "Deve ser um número inteiro positivo" })
  .transform((val) => parseInt(val, 10))
  .refine((val) => val > 0, { message: "Valor deve ser maior que zero" });

// ============================================
// COMMON FORM SCHEMAS
// ============================================

/**
 * Contact information schema
 */
export const contactInfoSchema = z.object({
  nome: nameSchema,
  telefone: phoneSchema,
  email: optionalEmailSchema,
});

/**
 * Address schema
 */
export const fullAddressSchema = z.object({
  endereco: addressSchema,
  bairro: optionalAddressSchema,
  municipio: optionalAddressSchema,
  provincia: optionalAddressSchema,
});

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if a string contains potential SQL injection patterns
 */
export const hasSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC)\b)/i,
    /(--|\/\*|\*\/|;)/,
    /('|")\s*(OR|AND)\s*('|"|\d)/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check if a string contains potential XSS patterns
 */
export const hasXSSPattern = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate and sanitize form data before submission
 */
export const validateFormData = <T extends Record<string, unknown>>(
  data: T,
  options: { checkSQL?: boolean; checkXSS?: boolean } = { checkSQL: true, checkXSS: true }
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string") {
      if (options.checkSQL && hasSQLInjection(value)) {
        errors.push(`Campo "${key}" contém caracteres não permitidos`);
      }
      if (options.checkXSS && hasXSSPattern(value)) {
        errors.push(`Campo "${key}" contém conteúdo não permitido`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// PASSWORD VALIDATION (for future auth implementation)
// ============================================

/**
 * Password validation schema (OWASP compliant)
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, { message: "Palavra-passe deve ter pelo menos 8 caracteres" })
  .max(128, { message: "Palavra-passe deve ter no máximo 128 caracteres" })
  .regex(/[A-Z]/, { message: "Deve conter pelo menos uma letra maiúscula" })
  .regex(/[a-z]/, { message: "Deve conter pelo menos uma letra minúscula" })
  .regex(/[0-9]/, { message: "Deve conter pelo menos um número" })
  .regex(/[^A-Za-z0-9]/, { message: "Deve conter pelo menos um caractere especial" });

/**
 * Password confirmation schema
 */
export const passwordConfirmSchema = (passwordField: string = "password") =>
  z.object({
    [passwordField]: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data[passwordField] === data.confirmPassword, {
    message: "As palavras-passe não coincidem",
    path: ["confirmPassword"],
  });
