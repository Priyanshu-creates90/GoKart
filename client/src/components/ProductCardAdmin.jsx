import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchProductData) {
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="aspect-square w-full bg-sunken p-3">
        <img
          src={data?.image[0]}
          alt={data?.name}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="grid gap-2 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-fg">{data?.name}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-fg-faint">{data?.unit}</span>
          <span className="price text-sm">{DisplayPriceInRupees(data?.price)}</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <button onClick={() => setEditOpen(true)} className="btn-outline btn-sm flex-1">
            <HiOutlinePencilSquare size={14} />
            Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            aria-label={`Delete ${data?.name}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-critical hover:bg-critical-soft hover:text-critical"
          >
            <HiOutlineTrash size={15} />
          </button>
        </div>
      </div>

      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
        )
      }

      {
        openDelete && (
          <ConfirmBox
            close={() => setOpenDelete(false)}
            cancel={handleDeleteCancel}
            confirm={handleDelete}
            title="Delete product"
            message={`"${data?.name}" will be removed from the store for good.`}
          />
        )
      }
    </div>
  )
}

export default ProductCardAdmin
