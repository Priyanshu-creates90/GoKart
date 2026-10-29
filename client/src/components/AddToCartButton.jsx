import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { HiMinusSmall, HiPlusSmall } from "react-icons/hi2";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item remove")
            }
        }
    }

    return (
        <div className="w-full max-w-[130px]">
            {
                isAvailableCart ? (
                    <div className="flex items-center overflow-hidden rounded-pill border border-brand/50 bg-brand-soft">
                        <button
                            onClick={decreaseQty}
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 shrink-0 place-items-center text-brand transition-colors hover:bg-brand hover:text-brand-on"
                        >
                            <HiMinusSmall size={16} />
                        </button>

                        <span className="flex-1 text-center text-sm font-semibold tabular-nums text-fg">{qty}</span>

                        <button
                            onClick={increaseQty}
                            aria-label="Increase quantity"
                            className="grid h-8 w-8 shrink-0 place-items-center text-brand transition-colors hover:bg-brand hover:text-brand-on"
                        >
                            <HiPlusSmall size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleADDTocart}
                        className="btn-primary h-8 w-full px-4 text-xs uppercase tracking-wide"
                    >
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton
