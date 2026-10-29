import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'
import Loading from '../components/Loading'

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const code = query.get('code')

    if (!code) {
      setLoading(false)
      setSuccess(false)
      setMessage('No verification code was provided. Please use the link sent to your email.')
      return
    }

    const verify = async () => {
      try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.verify_email,
          data: { code }
        })

        if (response.data.success) {
          setSuccess(true)
          setMessage(response.data.message || 'Email verified successfully! You can now log in to GoKart.')
        } else {
          setSuccess(false)
          setMessage(response.data.message || 'Verification failed. The link may be invalid or expired.')
        }
      } catch (error) {
        setSuccess(false)
        setMessage(error?.response?.data?.message || 'Verification failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [location.search])

  return (
    <section className="container mx-auto flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md animate-rise p-8 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loading className="text-brand h-10 w-10" />
            <p className="font-medium text-fg">Verifying your email address...</p>
          </div>
        ) : success ? (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-positive-soft text-positive">
              <HiOutlineCheckCircle size={36} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold">Email Verified</h1>
            <p className="mt-2 text-sm text-fg-muted">{message}</p>
            <div className="mt-7">
              <Link to="/login" className="btn-primary w-full">
                Proceed to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-critical-soft text-critical">
              <HiOutlineXCircle size={36} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold">Verification Failed</h1>
            <p className="mt-2 text-sm text-fg-muted">{message}</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link to="/login" className="btn-outline w-full">
                Back to Login
              </Link>
              <Link to="/register" className="btn-ghost w-full">
                Create a New Account
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default VerifyEmail
