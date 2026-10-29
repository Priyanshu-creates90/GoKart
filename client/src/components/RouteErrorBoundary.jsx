import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const RouteErrorBoundary = () => {
    const error = useRouteError();
    console.error("Router error boundary caught:", error);

    const errorMessage = error?.data?.message || 
        error?.message || 
        (typeof error === "string" ? error : "An unexpected error occurred while loading this page.");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ground p-6 text-center">
            <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-card">
                <span className="text-5xl">⚠️</span>
                <h1 className="mt-4 font-display text-xl font-bold text-fg">Something went wrong</h1>
                <p className="mt-2 text-sm text-fg-subtle">
                    {String(errorMessage)}
                </p>
                <div className="mt-6 flex flex-col gap-2">
                    <button 
                        onClick={() => window.location.reload()}
                        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Reload Page
                    </button>
                    <Link 
                        to="/"
                        className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-fg-muted transition hover:bg-ground"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RouteErrorBoundary;
