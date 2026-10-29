import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi.js'
import { logout } from '../store/userSlice.js'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError.js'
import {
    HiOutlineArrowRightOnRectangle,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineSquares2X2,
    HiOutlineTag,
    HiOutlineArrowUpTray,
    HiOutlineCube,
    HiOutlineReceiptPercent,
    HiOutlineMapPin,
} from 'react-icons/hi2'
import isAdmin from '../utils/isAdmin.js'

const adminLinks = [
    { to: '/dashboard/category', label: 'Categories', icon: HiOutlineSquares2X2 },
    { to: '/dashboard/subcategory', label: 'Sub categories', icon: HiOutlineTag },
    { to: '/dashboard/upload-product', label: 'Upload product', icon: HiOutlineArrowUpTray },
    { to: '/dashboard/product', label: 'Products', icon: HiOutlineCube },
]

const userLinks = [
    { to: '/dashboard/myorders', label: 'My orders', icon: HiOutlineReceiptPercent },
    { to: '/dashboard/address', label: 'Saved addresses', icon: HiOutlineMapPin },
]

const MenuLink = ({ to, label, icon: Icon, onClick }) => (
    <Link
        onClick={onClick}
        to={to}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-fg-muted transition-colors hover:bg-sunken hover:text-fg"
    >
        <Icon size={17} className="shrink-0 text-fg-faint" />
        {label}
    </Link>
)

const userMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClose = () => {
        if (close) close()
    }

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.logout,
            })

            if (response.data.success) {
                if (close) close()
                dispatch(logout())
                localStorage.removeItem("token")
                toast.success(response.data.message)
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="grid gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="eyebrow">My account</p>
                    <p className="mt-1 flex items-center gap-2 truncate font-display text-sm font-semibold text-fg">
                        <span className="truncate">{user.name || 'Guest'}</span>
                        {
                            isAdmin(user.role) && (
                                <span className="chip-brand px-2 py-0.5 text-[10px] uppercase tracking-wider">Admin</span>
                            )
                        }
                    </p>
                </div>
                <Link onClick={handleClose} to={"/dashboard/profile"} aria-label="Open profile" className="icon-btn">
                    <HiOutlineArrowTopRightOnSquare size={16} />
                </Link>
            </div>

            <div className="divider" />

            <div className="grid gap-0.5">
                {userLinks.map(link => <MenuLink key={link.to} {...link} onClick={handleClose} />)}
            </div>

            {
                isAdmin(user.role) && (
                    <>
                        <div className="divider" />
                        <p className="eyebrow px-2.5">Store admin</p>
                        <div className="grid gap-0.5">
                            {adminLinks.map(link => <MenuLink key={link.to} {...link} onClick={handleClose} />)}
                        </div>
                    </>
                )
            }

            <div className="divider" />

            <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-critical transition-colors hover:bg-critical-soft"
            >
                <HiOutlineArrowRightOnRectangle size={17} />
                Log out
            </button>
        </div>
    )
}

export default userMenu
