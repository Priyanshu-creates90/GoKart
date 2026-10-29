import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useGlobalContext } from '../provider/GlobalProvider'
import Loading from '../components/Loading'

const Success = () => {
  const location = useLocation()
  const { fetchCartItem, fetchOrder } = useGlobalContext()
  const [verifying, setVerifying] = useState(false)
  const [verifyFailed, setVerifyFailed] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const sessionId = query.get('session_id')

    if (sessionId) {
      const verifySession = async () => {
        try {
          setVerifying(true)
          const response = await Axios({
            ...SummaryApi.verify_payment,
            data: { sessionId }
          })

          if (response.data.success) {
            if (fetchCartItem) fetchCartItem()
            if (fetchOrder) fetchOrder()
          } else {
            setVerifyFailed(true)
          }
        } catch (error) {
          console.error("Verification failed:", error)
          // Still refresh cart & orders in case webhook already processed it
          if (fetchCartItem) fetchCartItem()
          if (fetchOrder) fetchOrder()
        } finally {
          setVerifying(false)
        }
      }

      verifySession()
    } else {
      if (fetchCartItem) fetchCartItem()
      if (fetchOrder) fetchOrder()
    }
  }, [location.search])

  return (
    <section className="container mx-auto flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md animate-rise p-8 text-center">
        {verifying ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loading className="text-brand h-10 w-10" />
            <p className="font-medium text-fg">Confirming your payment with Stripe...</p>
          </div>
        ) : verifyFailed ? (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-critical-soft text-critical">
              <HiOutlineXCircle size={34} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold">Payment Issue</h1>
            <p className="mt-2 text-sm text-fg-muted">
              We could not verify your payment immediately. If your account was charged, please check your order history.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/dashboard/myorders" className="btn-primary">Check orders</Link>
              <Link to="/" className="btn-outline">Keep shopping</Link>
            </div>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-positive-soft text-positive">
              <HiOutlineCheckCircle size={34} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold">
              {Boolean(location?.state?.text) ? location?.state?.text : "Payment"} confirmed
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              Thanks for shopping with GoKart. You'll get a note the moment it's on the way.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/dashboard/myorders" className="btn-primary">Track order</Link>
              <Link to="/" className="btn-outline">Keep shopping</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Success
