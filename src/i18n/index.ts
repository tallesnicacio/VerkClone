/**
 * Sistema de Internacionalização (i18n)
 * Suporte para múltiplos idiomas
 */

import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';
import StorageManager from '../storage';

export type Locale = 'pt-BR' | 'en' | 'es';

export interface Translations {
  [key: string]: any;
}

const translations: Record<Locale, Translations> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
};

let currentLocale: Locale = 'pt-BR';

/**
 * Inicializa o sistema de i18n com o idioma salvo
 */
export async function initI18n(): Promise<void> {
  const settings = await StorageManager.getSettings();
  currentLocale = settings.language || 'pt-BR';
}

/**
 * Obtém o idioma atual
 */
export function getCurrentLocale(): Locale {
  return currentLocale;
}

/**
 * Define o idioma atual
 */
export async function setLocale(locale: Locale): Promise<void> {
  currentLocale = locale;
  await StorageManager.updateSettings({ language: locale });
}

/**
 * Traduz uma chave usando dot notation
 * Exemplo: t('popup.dashboard.welcome') -> 'Bem-vindo ao Verk CRM'
 */
export function t(key: string, params?: Record<string, any>): string {
  const keys = key.split('.');
  let value: any = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  // Substituir parâmetros
  if (params) {
    return interpolate(value, params);
  }

  return value;
}

/**
 * Interpola parâmetros em uma string
 * Exemplo: interpolate('Hello {{name}}!', { name: 'John' }) -> 'Hello John!'
 */
function interpolate(text: string, params: Record<string, any>): string {
  let result = text;

  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  });

  return result;
}

/**
 * Obtém múltiplas traduções de uma vez
 */
export function getTranslations(namespace: string): any {
  const keys = namespace.split('.');
  let value: any = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation namespace not found: ${namespace}`);
      return {};
    }
  }

  return value;
}

/**
 * Verifica se uma chave de tradução existe
 */
export function hasTranslation(key: string): boolean {
  const keys = key.split('.');
  let value: any = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}

/**
 * Retorna lista de idiomas disponíveis
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string }> {
  return [
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];
}

/**
 * Formata número baseado no locale
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(currentLocale, options).format(value);
}

/**
 * Formata data baseado no locale
 */
export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(currentLocale, options).format(date);
}

/**
 * Formata moeda baseado no locale
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency,
  }).format(value);
}

// Inicializar automaticamente quando importado
initI18n().catch(console.error);

// Export default
export default {
  t,
  getCurrentLocale,
  setLocale,
  getTranslations,
  hasTranslation,
  getAvailableLocales,
  formatNumber,
  formatDate,
  formatCurrency,
  initI18n,
};
