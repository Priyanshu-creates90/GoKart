import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'gokart-theme'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {}, setTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

const readInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored === 'dark' || stored === 'light') return stored
    } catch {
        // storage can be blocked — fall through to the system preference
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(readInitialTheme)

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark')
        root.style.colorScheme = theme
        try {
            window.localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // ignore — the theme still applies for this session
        }
    }, [theme])

    const setTheme = useCallback((next) => setThemeState(next === 'dark' ? 'dark' : 'light'), [])
    const toggleTheme = useCallback(() => setThemeState(prev => (prev === 'dark' ? 'light' : 'dark')), [])

    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
