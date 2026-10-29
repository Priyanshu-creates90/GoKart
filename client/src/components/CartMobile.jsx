import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi2'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

    return (
        <>
            {
                cartItem[0] && (
                    <div className="sticky bottom-4 z-30 px-4 lg:hidden">
                        <Link
                            to={"/cart"}
                            className="flex items-center justify-between gap-3 rounded-pill bg-ink px-3 py-2.5 text-ink-50 shadow-pop"
                        >
                            <span className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-on">
                                    <HiOutlineShoppingBag size={18} />
                                </span>
                                <span className="flex flex-col leading-tight">
                                    <span className="text-[11px] text-ink-200">{totalQty} items</span>
                                    <span className="text-sm font-semibold tabular-nums">{DisplayPriceInRupees(totalPrice)}</span>
                                </span>
                            </span>

                            <span className="flex items-center gap-1.5 pr-2 text-sm font-semibold text-brand">
                                View cart
                                <HiArrowRight size={15} />
                            </span>
                        </Link>
                    </div>
                )
            }
        </>
    )
}

export default CartMobileLink
