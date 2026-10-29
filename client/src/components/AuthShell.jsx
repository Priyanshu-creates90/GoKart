import React from 'react'
import Logo from './Logo.jsx'

/** Shared frame for the login / register / password screens. */
const AuthShell = ({ eyebrow, title, subtitle, children, footer }) => {
    return (
        <section className="container mx-auto flex min-h-[78vh] items-center justify-center py-10">
            <div className="w-full max-w-md animate-rise">

                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <span className="rounded-2xl bg-ink p-2.5 shadow-card">
                        <Logo tone="ink" compact />
                    </span>
                    <div>
                        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">{title}</h1>
                        {subtitle && <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>}
                    </div>
                </div>

                <div className="card p-6 lg:p-7">
                    {children}
                </div>

                {
                    footer && (
                        <p className="mt-5 text-center text-sm text-fg-muted">{footer}</p>
                    )
                }
            </div>
        </section>
    )
}

export default AuthShell
