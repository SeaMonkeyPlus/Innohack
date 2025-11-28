import { useLanguage } from "@contexts/language-context";
import { translations } from "@i18n/translations";

export function useTranslation() {
  const { selectedLanguage } = useLanguage();

  const t = translations[selectedLanguage.code as keyof typeof translations] || translations.ko;

  return { t, currentLanguage: selectedLanguage };
}
