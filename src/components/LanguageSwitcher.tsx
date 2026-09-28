'use client'

import { useMemo } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/useLanguage'
import type { Lang } from '@/lib/translations'
import { translations } from '@/lib/translations'

const optionsFor = {
  en: (t: typeof translations.en) => t.language.english,
  hi: (t: typeof translations.en) => t.language.hindi,
  gu: (t: typeof translations.en) => t.language.gujarati,
} as const

const labelByLang = (target: Lang) => (t: typeof translations.en) => {
  if (target === 'hi') return t.language.hindi
  if (target === 'gu') return t.language.gujarati
  return t.language.english
}


const LANGS: { key: Lang }[] = [{ key: 'en' }, { key: 'hi' }, { key: 'gu' }]

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

const tForLabels = translations[lang]

  const options = useMemo(() => {
    return LANGS.map((l) => ({
      value: l.key,
      // Label should come from the currently active translation language
      // (but typed via casts to avoid literal-type mismatches across locales).
      label:
        l.key === 'hi'
          ? tForLabels.language.hindi
          : l.key === 'gu'
            ? tForLabels.language.gujarati
            : tForLabels.language.english,
    }))
  }, [tForLabels])



  return (
    <div className="relative">
      <div
        className="absolute -inset-2 rounded-2xl opacity-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(184,147,58,0.25), rgba(212,175,106,0.18))' }}
      />
      <label className="sr-only" htmlFor="lang-select">
        {tForLabels.language.label}
      </label>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: 'rgba(253,250,245,0.12)',
          border: '1px solid rgba(184,147,58,0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          transition: 'transform 180ms ease, background 180ms ease',
        }}
      >
        <Globe size={14} style={{ color: '#B8933A' }} />
        <select
          id="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="bg-transparent outline-none text-xs font-semibold"
          style={{
            color: '#FDFAF5',
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ color: '#1A0F08' }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

