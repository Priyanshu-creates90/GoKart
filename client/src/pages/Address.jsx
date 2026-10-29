import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { HiOutlineTrash, HiOutlinePencilSquare, HiPlus, HiOutlineMapPin } from "react-icons/hi2";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if (response.data.success) {
        toast.success("Address Remove")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="panel-head rounded-card border border-line bg-surface">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-1 font-display text-lg font-semibold">Saved addresses</h1>
        </div>
        <button onClick={() => setOpenAddress(true)} className="btn-primary btn-sm">
          <HiPlus size={15} />
          Add address
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {
          addressList.map((address, index) => {
            return (
              <div
                key={address._id + "addressCard"}
                className={`card flex gap-3 p-4 ${!address.status && 'hidden'}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <HiOutlineMapPin size={18} />
                </span>

                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-fg">{address.address_line}</p>
                  <p className="mt-0.5 text-fg-muted">{address.city}, {address.state}</p>
                  <p className="text-fg-muted">{address.country} — {address.pincode}</p>
                  <p className="mt-1 text-xs text-fg-faint">Mobile: {address.mobile}</p>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => {
                      setOpenEdit(true)
                      setEditData(address)
                    }}
                    aria-label="Edit address"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    <HiOutlinePencilSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address._id)}
                    aria-label="Remove address"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-critical hover:text-critical"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            )
          })
        }

        <button
          onClick={() => setOpenAddress(true)}
          className="flex min-h-28 items-center justify-center gap-2 rounded-card border-2 border-dashed border-line-strong text-sm font-medium text-fg-muted transition-colors hover:border-brand hover:text-brand"
        >
          <HiPlus size={17} />
          Add a new address
        </button>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        OpenEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
