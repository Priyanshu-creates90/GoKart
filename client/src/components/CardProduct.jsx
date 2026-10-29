import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const hasDiscount = Boolean(data.discount)
    const outOfStock = data.stock == 0

    return (
        <Link
            to={url}
            className="card card-hover group flex w-full min-w-[9.5rem] flex-col overflow-hidden lg:min-w-[13rem]"
        >
            {/* image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sunken p-3">
                <img
                    src={data.image[0]}
                    alt={data.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {
                    hasDiscount && (
                        <span className="absolute left-2.5 top-2.5 rounded-pill bg-brand px-2 py-0.5 text-[11px] font-semibold text-brand-on shadow-card">
                            {data.discount}% off
                        </span>
                    )
                }
                {
                    outOfStock && (
                        <span className="absolute right-2.5 top-2.5 rounded-pill bg-critical-soft px-2 py-0.5 text-[11px] font-semibold text-critical">
                            Sold out
                        </span>
                    )
                }
            </div>

            {/* body */}
            <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="line-clamp-2 text-sm font-medium leading-snug text-fg">{data.name}</p>
                <p className="text-xs text-fg-faint">{data.unit}</p>

                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <div className="flex flex-col leading-tight">
                        <span className="price text-[15px]">
                            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                        </span>
                        {
                            hasDiscount && (
                                <span className="text-xs text-fg-faint line-through">
                                    {DisplayPriceInRupees(data.price)}
                                </span>
                            )
                        }
                    </div>

                    <div>
                        {
                            outOfStock ? (
                                <span className="text-xs font-medium text-critical">Out of stock</span>
                            ) : (
                                <AddToCartButton data={data} />
                            )
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CardProduct
