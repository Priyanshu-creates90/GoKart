import React from 'react'

const Loading = ({ label = "Loading", className = "" }) => {
    return (
        <span className={`inline-flex items-center justify-center ${className}`} role="status">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{label}...</span>
        </span>
    )
}

export default Loading
