import { cookies } from "next/headers";

export type CartSnapItem = {
  id: string;
  name: string;
  price: number;
  lang: string;
  imageUrl: string | null;
  imageBlur: string | null;
};
export type CartSnapshot = {
  items: CartSnapItem[];
  updatedAt: number;
};

export const CART_COOKIE_NAME = "cart_snapshot_v1";

export async function readCartSnapshot(): Promise<CartSnapshot> {
  const store = await cookies();
  const c = store.get(CART_COOKIE_NAME)?.value;
  try {
    if (!c) {
      return { items: [], updatedAt: Date.now() };
    }

    const parsed = JSON.parse(c) as CartSnapshot;
    const items = Array.isArray(parsed.items) ? parsed.items : [];

    return {
      items: items.map((item) => ({
        ...item,
        imageUrl: item.imageUrl ?? null,
        imageBlur: item.imageBlur ?? null,
      })),
      updatedAt: parsed.updatedAt ?? Date.now(),
    };
  } catch {
    return { items: [], updatedAt: Date.now() };
  }
}

export async function writeCartSnapshot(snap: CartSnapshot) {
  try {
    const value = JSON.stringify({
      ...snap,
      items: snap.items.map((item) => ({
        ...item,
        imageUrl: item.imageUrl ?? null,
        imageBlur: item.imageBlur ?? null,
      })),
    });
    const store = await cookies();
    store.set({
      name: CART_COOKIE_NAME,
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

export async function clearCartSnapshot() {
  const store = await cookies();
  store.delete(CART_COOKIE_NAME);
}
