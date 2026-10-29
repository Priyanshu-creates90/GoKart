import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { HiOutlineMapPin, HiPlus, HiOutlineBanknotes, HiOutlineCreditCard } from 'react-icons/hi2'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const [onlineLoading, setOnlineLoading] = useState(false)
  const [codLoading, setCodLoading] = useState(false)
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    if (!addressList || !addressList[selectAddress]?._id) {
      toast.error("Please add and select a delivery address")
      return
    }

    try {
      setCodLoading(true)
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setCodLoading(false)
    }
  }

  const handleOnlinePayment = async () => {
    if (!addressList || !addressList[selectAddress]?._id) {
      toast.error("Please add and select a delivery address")
      return
    }

    try {
      setOnlineLoading(true)
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData?.url) {
        window.location.href = responseData.url
        return
      }

      if (responseData?.id) {
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        if (stripePublicKey) {
          const stripePromise = await loadStripe(stripePublicKey)
          await stripePromise.redirectToCheckout({ sessionId: responseData.id })
        } else {
          toast.error("Stripe public key (VITE_STRIPE_PUBLIC_KEY) is not set")
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setOnlineLoading(false)
    }
  }

  return (
    <section className="container mx-auto py-6">
      <div className="mb-5">
        <p className="eyebrow">Checkout</p>
        <h1 className="section-title mt-1">Confirm your order</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">

        {/***** address *****/}
        <div className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Delivery address</h2>
            <button onClick={() => setOpenAddress(true)} className="btn-ghost btn-sm text-brand hover:bg-brand-soft">
              <HiPlus size={15} />
              New address
            </button>
          </div>

          <div className="grid gap-3 p-4">
            {
              addressList.map((address, index) => {
                const active = Number(selectAddress) === index

                return (
                  <label
                    key={address._id + "checkoutAddress"}
                    htmlFor={"address" + index}
                    className={`${!address.status && "hidden"} cursor-pointer rounded-xl border p-4 transition-colors
                      ${active ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand/40"}`}
                  >
                    <div className="flex gap-3">
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        checked={active}
                        onChange={(e) => setSelectAddress(e.target.value)}
                        name="address"
                        className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--k-brand))]"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-fg">{address.address_line}</p>
                        <p className="mt-0.5 text-fg-muted">{address.city}, {address.state}</p>
                        <p className="text-fg-muted">{address.country} — {address.pincode}</p>
                        <p className="mt-1 text-xs text-fg-faint">Mobile: {address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }

            <button
              onClick={() => setOpenAddress(true)}
              className="flex h-20 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong text-sm font-medium text-fg-muted transition-colors hover:border-brand hover:text-brand"
            >
              <HiOutlineMapPin size={18} />
              Add a delivery address
            </button>
          </div>
        </div>

        {/***** summary *****/}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel overflow-hidden">
            <div className="panel-head">
              <h2 className="font-display text-sm font-semibold">Order summary</h2>
              <span className="chip">{totalQty} item{totalQty === 1 ? '' : 's'}</span>
            </div>

            <dl className="grid gap-2.5 p-5 text-sm">
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

              <div className="divider my-1.5" />

              <div className="flex justify-between gap-4 font-display text-base font-semibold">
                <dt>Grand total</dt>
                <dd className="tabular-nums">{DisplayPriceInRupees(totalPrice)}</dd>
              </div>

              {
                notDiscountTotalPrice > totalPrice && (
                  <p className="chip-positive mt-1 w-full justify-center">
                    You save {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)} on this order
                  </p>
                )
              }
            </dl>

            <div className="flex flex-col gap-3 border-t border-line p-5">
              <button 
                onClick={handleOnlinePayment} 
                disabled={onlineLoading || codLoading}
                className="btn-primary btn-block btn-lg"
              >
                <HiOutlineCreditCard size={18} />
                {onlineLoading ? "Connecting to Stripe..." : "Pay Online (Cards / Stripe)"}
              </button>

              <button 
                onClick={handleCashOnDelivery} 
                disabled={onlineLoading || codLoading}
                className="btn-outline btn-block btn-lg"
              >
                <HiOutlineBanknotes size={18} />
                {codLoading ? "Placing Order..." : "Cash on Delivery"}
              </button>

              <p className="mt-1 text-center text-xs text-fg-faint">
                Secure checkout encrypted with 256-bit SSL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
