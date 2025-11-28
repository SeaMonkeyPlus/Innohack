import { Language } from "../types/language";

export const LANGUAGES: Language[] = [
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[1]; // English
