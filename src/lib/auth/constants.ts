/**
 * Super Admin Authorization Constants
 * Only these two designated email accounts are allowed to have and access the Super Admin role.
 */
export const LOCKED_SUPER_ADMIN_EMAILS: readonly string[] = [
  "ishitapatil088@gmail.com",
  "rujutpatil8975@gmail.com",
];

/**
 * Returns whether a given email address is in the locked list of authorized Super Admins.
 */
export function isAuthorizedSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  
  // Check env override if specified (comma separated)
  if (process.env.SUPER_ADMIN_EMAILS) {
    const envEmails = process.env.SUPER_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase());
    if (envEmails.includes(normalized)) return true;
  }
  
  // Also include demo superadmin emails if in demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    if (normalized === "super@propelai.com" || normalized === "alex@propelai.com") {
      return true;
    }
  }

  return LOCKED_SUPER_ADMIN_EMAILS.includes(normalized);
}

export const MAX_SUPER_ADMIN_COUNT = 2;
