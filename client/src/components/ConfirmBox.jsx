import React from 'react'
import { HiXMark, HiOutlineExclamationTriangle } from "react-icons/hi2";

const CofirmBox = ({ cancel, confirm, close, title = "Delete permanently", message = "This can't be undone. Are you sure you want to continue?" }) => {
  return (
    <div className="overlay flex items-center justify-center p-4">
      <div className="modal max-w-md">
        <div className="modal-head">
          <h2 className="font-display text-base font-semibold">{title}</h2>
          <button onClick={close} aria-label="Close" className="icon-btn">
            <HiXMark size={22} />
          </button>
        </div>

        <div className="flex gap-3 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-critical-soft text-critical">
            <HiOutlineExclamationTriangle size={20} />
          </span>
          <p className="text-sm leading-relaxed text-fg-muted">{message}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-line p-4">
          <button onClick={cancel} className="btn-ghost">Cancel</button>
          <button onClick={confirm} className="btn-critical">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default CofirmBox
