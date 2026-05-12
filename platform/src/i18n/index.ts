/**
 * Configuración i18n con `i18next` + `react-i18next`.
 *
 * Idiomas previstos:
 *
 *   - `es-ES` (default, idioma de origen del curso)
 *   - `en-US` (placeholder — UI ya traducible; contenido del curso
 *     sigue solo en español hasta que se decida traducir)
 *
 * Estrategia de implementación:
 *
 *   - **Strings de UI** (botones, labels, mensajes del shell) viven en
 *     `locales/<lang>/common.json` y se consumen con `useTranslation()`.
 *   - **Contenido del curso** (teoría, quiz, labs, recursos) sigue en
 *     su markdown nativo. Cuando llegue la decisión de traducir el
 *     curso, se hará produciendo `cursos/<slug>-<lang>/` o
 *     `cursos/<slug>/i18n/<lang>/`, no via i18n strings.
 *
 * Detección de idioma: i18next-browser-languagedetector mira en
 * `localStorage` (`pv-learn-language`) y, si no hay nada, en
 * `navigator.language`. Fallback a `es` siempre.
 *
 * Reutilización: cualquier shell PV-Learn lo hereda con import al inicio
 * de `main.tsx`. Para añadir un idioma nuevo, basta con crear el archivo
 * JSON correspondiente y registrarlo en `resources`.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import es from './locales/es/common.json'
import en from './locales/en/common.json'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  es: 'Español',
  en: 'English',
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: es },
      en: { common: en },
    },
    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      // Prioridad: localStorage > navigator > html lang.
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pv-learn-language',
    },
    returnNull: false,
  })

export default i18n
