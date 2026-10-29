import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <section className="container mx-auto py-6">
            <div className="grid gap-6 lg:grid-cols-[260px,1fr]">

                {/* left — menu */}
                <aside className="hidden lg:block">
                    <div className="card sticky top-24 p-4">
                        <UserMenu />
                    </div>
                </aside>

                {/* right — content */}
                <div className="min-h-[70vh]">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard
