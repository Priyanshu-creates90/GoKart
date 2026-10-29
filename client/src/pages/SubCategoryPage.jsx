import React, { useState, useEffect } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from '../components/ViewImage';
import Loading from '../components/Loading';
import { HiPlus, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import EditSubCategory from '../components/EditSubCategory';
import ConfirmBox from '../components/ConfirmBox'


const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteCofirmBox, setOpenDeleteConfirmBox] = useState(false)

  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('name', {
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return <button
          onClick={() => setImageURL(row.original.image)}
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg border border-line bg-sunken p-1 transition-colors hover:border-brand"
        >
          <img
            src={row.original.image}
            alt={row.original.name}
            className="h-full w-full object-contain"
          />
        </button>
      }
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1.5">
            {
              row.original.category.map((c) => (
                <span key={c._id + "table"} className="chip text-[11px]">{c.name}</span>
              ))
            }
          </div>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOpenEdit(true)
                setEditData(row.original)
              }}
              aria-label="Edit sub category"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand">
              <HiOutlinePencilSquare size={15} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }}
              aria-label="Delete sub category"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-critical hover:bg-critical-soft hover:text-critical">
              <HiOutlineTrash size={15} />
            </button>
          </div>
        )
      }
    })
  ]

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])


  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="grid gap-4">
      <div className="panel-head rounded-card border border-line bg-surface">
        <div>
          <p className="eyebrow">Store admin</p>
          <h1 className="mt-1 font-display text-lg font-semibold">Sub categories</h1>
        </div>
        <div className="flex items-center gap-3">
          {loading && <Loading className="text-brand" />}
          <button onClick={() => setOpenAddSubCategory(true)} className="btn-primary btn-sm">
            <HiPlus size={15} />
            Add sub category
          </button>
        </div>
      </div>

      <div className="w-full max-w-[95vw] lg:max-w-none">
        <DisplayTable
          data={data}
          columns={column}
        />
      </div>

      {
        openAddSubCategory && (
          <UploadSubCategoryModel
            close={() => setOpenAddSubCategory(false)}
            fetchData={fetchSubCategory}
          />
        )
      }

      {
        imageURL &&
        <ViewImage url={imageURL} close={() => setImageURL("")} />
      }

      {
        openEdit &&
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory} />
      }

      {
        openDeleteCofirmBox &&
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
          title="Delete sub category"
          message="This removes the sub category from the store. Products already using it stay put." />
      }

    </section>
  )
}

export default SubCategoryPage
