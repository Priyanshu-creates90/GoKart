import React from 'react'

const CardLoading = () => {
  return (
    <div className="card flex w-full min-w-[9.5rem] flex-col overflow-hidden lg:min-w-[13rem]">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="grid gap-2 p-3">
        <div className="skeleton h-3.5 w-4/5" />
        <div className="skeleton h-3 w-1/3" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-8 w-16 rounded-pill" />
        </div>
      </div>
    </div>
  )
}

export default CardLoading
