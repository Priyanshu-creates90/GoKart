import React from 'react'
import { HiXMark } from 'react-icons/hi2'

const ViewImage = ({ url, close }) => {
  return (
    <div className="overlay flex items-center justify-center p-4">
      <div className="modal max-w-lg overflow-hidden">
        <div className="modal-head">
          <h2 className="font-display text-sm font-semibold">Preview</h2>
          <button onClick={close} aria-label="Close" className="icon-btn">
            <HiXMark size={22} />
          </button>
        </div>
        <div className="max-h-[70vh] bg-sunken p-6">
          <img
            src={url}
            alt="Full size preview"
            className="mx-auto max-h-[60vh] w-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default ViewImage
