import React from 'react'
import UserMenu from '../components/UserMenu.jsx'
import { HiXMark } from 'react-icons/hi2'

const UserMenuMobile = () => {
  return (
    <section className="container mx-auto py-4">
      <div className="flex justify-end">
        <button onClick={() => window.history.back()} aria-label="Close" className="icon-btn">
          <HiXMark size={26} />
        </button>
      </div>
      <div className="card mt-2 p-4">
        <UserMenu />
      </div>
    </section>
  )
}

export default UserMenuMobile
