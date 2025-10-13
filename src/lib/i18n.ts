import { type Locale, defaultLocale } from "@/i18n/locales";

export async function getMessages(lang: Locale) {
  try {
    const messages = (await import(`@/messages/${lang}.json`)).default;
    return messages;
  } catch (e) {
    console.warn(
      `Missing translation file for: ${lang}, falling back to default locale`
    );
    const fallback = (await import(`@/messages/${defaultLocale}.json`)).default;
    return fallback;
  }
}
