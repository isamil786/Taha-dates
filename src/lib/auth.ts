export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "taha2024";

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const secret = process.env.ADMIN_SECRET || "taha-dates-secret-key";
  return Buffer.from(`${secret}:${Date.now()}`).toString("base64");
}

export function verifySessionToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const secret = process.env.ADMIN_SECRET || "taha-dates-secret-key";
    return decoded.startsWith(`${secret}:`);
  } catch {
    return false;
  }
}
