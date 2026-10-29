import React from 'react'
import { HiXMark, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                close()
            }
            return
        }
        toast("Please Login")
    }

    return (
        <section className="overlay">
            <div className="ml-auto flex h-full max-h-screen w-full max-w-md animate-slide-in flex-col border-l border-line bg-ground">

                {/* head */}
                <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-4">
                    <div>
                        <p className="eyebrow">Your bag</p>
                        <h2 className="font-display text-lg font-semibold">{totalQty} item{totalQty === 1 ? '' : 's'}</h2>
                    </div>
                    <Link to={"/"} aria-label="Close cart" className="icon-btn lg:hidden">
                        <HiXMark size={22} />
                    </Link>
                    <button onClick={close} aria-label="Close cart" className="icon-btn hidden lg:inline-flex">
                        <HiXMark size={22} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-slim p-4">
                    {
                        cartItem[0] ? (
                            <>
                                <div className="flex items-center justify-between gap-3 rounded-pill border border-positive/25 bg-positive-soft px-4 py-2 text-sm text-positive">
                                    <span className="flex items-center gap-2 font-medium">
                                        <HiOutlineSparkles size={16} />
                                        Total savings
                                    </span>
                                    <span className="font-semibold tabular-nums">{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
                                </div>

                                <div className="panel divide-y divide-line">
                                    {
                                        cartItem.map((item, index) => {
                                            return (
                                                <div key={item?._id + "cartItemDisplay"} className="flex w-full items-center gap-3 p-3">
                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-sunken p-1">
                                                        <img
                                                            src={item?.productId?.image[0]}
                                                            alt={item?.productId?.name}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="line-clamp-2 text-sm font-medium text-fg">{item?.productId?.name}</p>
                                                        <p className="text-xs text-fg-faint">{item?.productId?.unit}</p>
                                                        <p className="price mt-1 text-sm">{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                                    </div>
                                                    <div className="shrink-0">
                                                        <AddToCartButton data={item?.productId} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="panel p-4">
                                    <h3 className="font-display text-sm font-semibold">Bill details</h3>
                                    <dl className="mt-3 grid gap-2 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-fg-muted">Items total</dt>
                                            <dd className="flex items-center gap-2">
                                                <span className="text-fg-faint line-through">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                                <span className="tabular-nums">{DisplayPriceInRupees(totalPrice)}</span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-fg-muted">Quantity</dt>
                                            <dd className="tabular-nums">{totalQty} item{totalQty === 1 ? '' : 's'}</dd>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-fg-muted">Delivery</dt>
                                            <dd className="font-medium text-positive">Free</dd>
                                        </div>
                                        <div className="divider my-1" />
                                        <div className="flex justify-between gap-4 font-display font-semibold">
                                            <dt>Grand total</dt>
                                            <dd className="tabular-nums">{DisplayPriceInRupees(totalPrice)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                                <img
                                    src={imageEmpty}
                                    alt="Empty cart"
                                    className="w-52 max-w-full object-contain"
                                />
                                <div>
                                    <p className="font-display text-lg font-semibold">Your bag is empty</p>
                                    <p className="mt-1 text-sm text-fg-muted">Fill it with something good.</p>
                                </div>
                                <Link onClick={close} to={"/"} className="btn-primary">Start shopping</Link>
                            </div>
                        )
                    }
                </div>

                {
                    cartItem[0] && (
                        <div className="border-t border-line bg-surface p-4">
                            <button
                                onClick={redirectToCheckoutPage}
                                className="flex w-full items-center justify-between gap-4 rounded-pill bg-ink px-5 py-3.5 text-ink-50 shadow-card transition-transform active:scale-[0.99]"
                            >
                                <span className="font-display font-semibold tabular-nums">{DisplayPriceInRupees(totalPrice)}</span>
                                <span className="flex items-center gap-2 text-sm font-semibold text-brand">
                                    Checkout
                                    <HiArrowRight size={16} />
                                </span>
                            </button>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default DisplayCartItem
