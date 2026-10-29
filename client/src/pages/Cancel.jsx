import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineXCircle } from 'react-icons/hi2'

const Cancel = () => {
  return (
    <section className="container mx-auto flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md animate-rise p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-critical-soft text-critical">
          <HiOutlineXCircle size={34} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Order cancelled</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Nothing was charged. Your cart is still saved if you want to try again.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/checkout" className="btn-primary">Back to checkout</Link>
          <Link to="/" className="btn-outline">Keep shopping</Link>
        </div>
      </div>
    </section>
  )
}

export default Cancel
