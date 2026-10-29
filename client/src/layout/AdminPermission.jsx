import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineLockClosed } from 'react-icons/hi2'
import isAdmin from '../utils/isAdmin'

const AdminPermission = ({ children }) => {
    const user = useSelector(state => state.user)

    if (isAdmin(user.role)) {
        return <>{children}</>
    }

    return (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-critical-soft text-critical">
                <HiOutlineLockClosed size={26} />
            </span>
            <div>
                <p className="font-display text-lg font-semibold">Admins only</p>
                <p className="mt-1 text-sm text-fg-muted">This area is limited to store administrators.</p>
            </div>
            <Link to="/" className="btn-outline mt-2">Back to store</Link>
        </div>
    )
}

export default AdminPermission
