export function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "").trim();
}

/**
 * Simple Arabic-friendly mobile validation.
 * Accepts:
 * - +968XXXXXXXX (Oman, 8 digits)
 * - 968XXXXXXXX
 * - XXXXXXXX (8 digits)
 * - Generic +<country><number> up to 14 digits
 */
export function isValidMobile(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) return false;

  // Oman common formats
  if (/^(?:\+?968)?\d{8}$/.test(phone)) return true;

  // Generic international
  if (/^\+?\d{8,14}$/.test(phone)) return true;

  return false;
}

