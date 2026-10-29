import React from 'react'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2'
import { useTheme } from '../provider/ThemeProvider'

/**
 * `tone="ink"` sits on the dark header bar, `tone="surface"` on regular surfaces.
 */
const ThemeToggle = ({ tone = 'ink', className = '' }) => {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    const toneClass = tone === 'ink'
        ? 'border-white/15 text-ink-100 hover:border-brand/60 hover:text-brand'
        : 'border-line text-fg-muted hover:border-brand/60 hover:text-brand'

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 ${toneClass} ${className}`}
        >
            {isDark ? <HiOutlineSun size={19} /> : <HiOutlineMoon size={19} />}
        </button>
    )
}

export default ThemeToggle
