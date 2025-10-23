import { Link } from "lucide-react";

export default function ActionButton({
  action,
  intent,
}: {
  action?: {
    label: string;
    href?: string;
    external?: boolean;
    reload?: boolean;
  };
  intent: "primary" | "secondary";
}) {
  console.log("ActionButton action:", action);
  if (!action) return null;

  if (action.reload) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        onClick={() => window.location.reload()}
      >
        {action.label}
      </button>
    );
  }

  const className =
    intent === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      : "inline-flex items-center justify-center rounded-full border border-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white";

  if (action.external || action.href) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href ?? "#"} className={className}>
      {action.label}
    </Link>
  );
}
