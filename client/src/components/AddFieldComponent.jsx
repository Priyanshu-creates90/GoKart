import React from 'react'
import { HiXMark } from "react-icons/hi2";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="overlay flex items-center justify-center p-4">
      <div className="modal max-w-md">
        <div className="modal-head">
          <h2 className="font-display text-base font-semibold">Add a field</h2>
          <button onClick={close} aria-label="Close" className="icon-btn">
            <HiXMark size={22} />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <div className="grid gap-1.5">
            <label htmlFor="fieldName" className="label">Field name</label>
            <input
              id="fieldName"
              className="input"
              placeholder="e.g. Shelf life"
              value={value}
              onChange={onChange}
            />
          </div>
          <button onClick={submit} className="btn-primary btn-block">Add field</button>
        </div>
      </div>
    </section>
  )
}

export default AddFieldComponent
