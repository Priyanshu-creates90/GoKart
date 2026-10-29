import React from 'react'

/**
 * GoKart wordmark — a saffron cart mark on ink, with the "Kart" half in saffron.
 * `tone="ink"` is for placement on dark ink surfaces (header/footer),
 * `tone="adaptive"` follows the current theme.
 */
const Logo = ({ className = '', tone = 'ink', compact = false }) => {
    const wordTone = tone === 'ink' ? 'text-ink-50' : 'text-fg'

    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-saffron-grade shadow-card">
                <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
                    <path
                        d="M6 8h3.2l2.6 10.6a2.2 2.2 0 0 0 2.1 1.7h7.4a2.2 2.2 0 0 0 2.1-1.6L25.8 12H10.6"
                        fill="none"
                        stroke="#14182B"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="14.5" cy="25" r="1.9" fill="#14182B" />
                    <circle cx="21.5" cy="25" r="1.9" fill="#14182B" />
                </svg>
            </span>
            {
                !compact && (
                    <span className={`font-display text-xl font-bold tracking-tight ${wordTone}`}>
                        go<span className="text-brand">Kart</span>
                    </span>
                )
            }
        </span>
    )
}

export default Logo
