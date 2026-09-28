'use client'

import { translations } from './translations'
import type { Lang } from './translations'
import { useLanguage } from './useLanguage'

type TranslationValue = unknown

export function useT() {
  const { lang } = useLanguage()

  const t = <K extends string>(key: K): TranslationValue => {
    // Simple dot-path lookup: e.g. 'menu.searchPlaceholder'
    const path = key.split('.')
    let cur: any = translations[lang]
    for (const p of path) {
      if (cur == null) return key
      cur = cur[p]
    }
    return cur ?? key
  }

  return t
}

