import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineCheckCircle } from 'react-icons/hi2'

const Success = () => {
  const location = useLocation()

  return (
    <section className="container mx-auto flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md animate-rise p-8 text-center">
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
      </div>
    </section>
  )
}

export default Success
