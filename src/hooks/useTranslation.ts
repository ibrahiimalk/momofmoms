'use client';
import { translations, Locale } from '@/lib/i18n';

export function useTranslation(locale: Locale) {
  return translations[locale];
}
