import { en, type Dictionary } from './en'
import { es } from './es'
import type { Locale } from './config'

export * from './config'
export type { Dictionary }

const DICTIONARIES: Record<Locale, Dictionary> = { en, es }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}
