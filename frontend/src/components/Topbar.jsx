import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Topbar() {
  const { i18n } = useTranslation()
  const { dark, toggle } = useTheme()

  const toggleLang = () => {
    const next = i18n.language === 'el' ? 'en' : 'el'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const btnCls = "inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm transition-all duration-100"

  return (
    <header className="h-[52px] bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-end px-6 gap-2 shrink-0">
      <button onClick={toggle} className={btnCls} aria-label="Toggle dark mode">
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
      <button onClick={toggleLang} className={btnCls}>
        <span className="text-sm leading-none">
          {i18n.language === 'el' ? '🇬🇧' : '🇬🇷'}
        </span>
        {i18n.language === 'el' ? 'English' : 'Ελληνικά'}
      </button>
    </header>
  )
}
