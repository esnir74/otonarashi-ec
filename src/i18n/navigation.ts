import { routing } from "@/i18n/routing";
import { createNavigation } from "next-intl/navigation";

// routingで定義した地図を渡して、ナビゲーションAPIを生成
export const { Link, useRouter, usePathname, redirect } =
  createNavigation(routing);
