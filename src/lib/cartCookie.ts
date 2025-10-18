import { cookies } from "next/headers";

export type CartSnapItem = {
  id: string;
  name: string;
  price: number;
  lang: string;
};
export type CartSnapshot = { items: CartSnapItem[]; updatedAt: number };

const COOKIE_NAME = "cart_snapshot_v1";

export async function readCartSnapshot(): Promise<CartSnapshot> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME)?.value;
  try {
    return c
      ? (JSON.parse(c) as CartSnapshot)
      : { items: [], updatedAt: Date.now() };
  } catch {
    return { items: [], updatedAt: Date.now() };
  }
}

export async function writeCartSnapshot(snap: CartSnapshot) {
  try {
    const value = JSON.stringify(snap);
    const store = await cookies();
    store.set({
      name: COOKIE_NAME,
      value,
      httpOnly: true, // XSS 耐性
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } catch {
    console.error("Failed to write cart snapshot cookie");
  }
}
