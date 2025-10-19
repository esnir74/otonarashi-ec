import crypto from "node:crypto";

const SECRET = process.env.CHECKOUT_SESSION_SECRET!;
export const COOKIE_NAME = "checkout_session";

function hmac(token: string) {
  return crypto.createHmac("sha256", SECRET).update(token).digest("base64url");
}

export function createSessionToken() {
  return crypto.randomUUID();
}

export function signSession(token: string) {
  const signature = hmac(token);
  return `${token}.${signature}`;
}

export function verifySessionCookie(raw?: string | null) {
  if (!raw) return null;
  const [token, signature] = raw.split(".");
  if (!token || !signature) return null;
  return hmac(token) === signature ? token : null;
}
