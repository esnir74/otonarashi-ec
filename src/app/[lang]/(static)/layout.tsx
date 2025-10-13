// src/app/[lang]/(static)/layout.tsx
export const dynamic = "force-static";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
