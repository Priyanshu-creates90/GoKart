import React, { useState } from 'react'
import Search from "./Search.jsx"
import { Link } from 'react-router-dom'
import { useMobile } from "../hooks/useMobile.jsx"
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiOutlineShoppingBag, HiOutlineUser, HiChevronDown, HiChevronUp } from "react-icons/hi2"
import UserMenu from "./UserMenu.jsx"
import Logo from "./Logo.jsx"
import ThemeToggle from "./ThemeToggle.jsx"
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js'
import { useGlobalContext } from '../provider/GlobalProvider.jsx';
import DisplayCartItem from './DisplayCartItem.jsx'

const Header = () => {
    const isMobile = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === '/search'
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const redirectToLoginPage = () => {
        navigate('/login')
    }

    const handleMobileUser = () => {
        if (!user._id) navigate('/login')
        else navigate('/user')
    }

    return (
        <header className="sticky top-0 z-40 flex h-28 flex-col justify-center gap-2 border-b border-white/5 bg-ink-grade shadow-lift lg:h-20">

            {
                !(isSearchPage && isMobile) && (
                    <div className="container mx-auto flex items-center justify-between gap-6">

                        {/* brand */}
                        <Link to={"/"} className="shrink-0">
                            <Logo tone="ink" compact={isMobile} />
                        </Link>

                        {/* search — desktop */}
                        <div className="hidden max-w-xl flex-1 lg:block">
                            <Search />
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-2 lg:gap-3">

                            <ThemeToggle tone="ink" />

                            {/* mobile account */}
                            <button
                                onClick={handleMobileUser}
                                aria-label="Account"
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ink-100 transition-colors hover:border-brand/60 hover:text-brand lg:hidden"
                            >
                                <HiOutlineUser size={20} />
                            </button>

                            {/* desktop account */}
                            <div className="hidden lg:block">
                                {
                                    user?._id ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenUserMenu(!openUserMenu)}
                                                className="flex select-none items-center gap-2 rounded-pill border border-white/15 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink-50 transition-colors hover:border-brand/60"
                                            >
                                                <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white/10 text-ink-100">
                                                    {
                                                        user?.avatar
                                                            ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                            : <HiOutlineUser size={16} />
                                                    }
                                                </span>
                                                <span className="max-w-24 truncate">{user?.name?.split(" ")[0] || "Account"}</span>
                                                {openUserMenu ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                                            </button>
                                            {
                                                openUserMenu && (
                                                    <div className="absolute right-0 top-12 w-60 animate-rise">
                                                        <div className="card p-3 shadow-pop">
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button onClick={redirectToLoginPage} className="btn-outline border-white/20 text-ink-50 hover:bg-white/10 hover:text-brand">
                                            Log in
                                        </button>
                                    )
                                }
                            </div>

                            {/* cart */}
                            <button
                                onClick={() => setOpenCartSection(true)}
                                className="hidden items-center gap-3 rounded-pill bg-brand px-4 py-2 text-sm font-semibold text-brand-on shadow-card transition-all hover:bg-brand-strong hover:text-white active:scale-[0.98] lg:flex"
                            >
                                <HiOutlineShoppingBag size={20} />
                                {
                                    cartItem[0] ? (
                                        <span className="flex flex-col items-start leading-tight">
                                            <span className="text-[11px] font-medium opacity-80">{totalQty} items</span>
                                            <span className="tabular-nums">{DisplayPriceInRupees(totalPrice)}</span>
                                        </span>
                                    ) : (
                                        <span>Cart</span>
                                    )
                                }
                            </button>
                        </div>
                    </div>
                )
            }

            {/* search — mobile */}
            <div className="container mx-auto lg:hidden">
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header
