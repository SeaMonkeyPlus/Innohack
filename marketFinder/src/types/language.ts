export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'vi' | 'th';
