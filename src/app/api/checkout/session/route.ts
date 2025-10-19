import {
  COOKIE_NAME,
  createSessionToken,
  signSession,
} from "@/lib/checkout/session";
import { cookies } from "next/headers";

export async function POST() {
  const token = createSessionToken();
  const signed = signSession(token);

  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: signed,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ sessionId: token });
}
