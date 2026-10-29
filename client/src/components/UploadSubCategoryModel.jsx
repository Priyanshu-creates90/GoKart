import React, { useState } from 'react'
import { HiXMark, HiOutlinePhoto } from 'react-icons/hi2'
import uploadImage from '../utils/UploadImage'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [loading, setLoading] = useState(false)
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  })
  const allCategory = useSelector(state => state.product.allCategory)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    setLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response

    setSubCategoryData((preve) => {
      return {
        ...preve,
        image: ImageResponse.data.url
      }
    })

    setLoading(false)
  }

  const handleRemoveCategorySelected = (categoryId) => {
    const index = subCategoryData.category.findIndex(el => el._id === categoryId)
    subCategoryData.category.splice(index, 1)

    setSubCategoryData((prev) => {
      return {
        ...prev
      }
    })
  }


  const handleSubmitSubCategory = async (e) => {
    e.preventDefault()

    try {

      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (close) close()
        if (fetchData) {
          fetchData()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="overlay flex items-center justify-center overflow-y-auto p-4">
      <div className="modal my-8 max-w-3xl">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Store admin</p>
            <h2 className="mt-1 font-display text-base font-semibold">New sub category</h2>
          </div>
          <button onClick={close} aria-label="Close" className="icon-btn">
            <HiXMark size={22} />
          </button>
        </div>

        <form className="grid gap-4 p-5" onSubmit={handleSubmitSubCategory}>

          <div className="grid gap-1.5">
            <label htmlFor="name" className="label">Sub category name</label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              type="text"
              onChange={handleChange}
              placeholder="e.g. Fresh milk"
              className="input"
            />
          </div>

          <div className="grid gap-1.5">
            <p className="label">Image</p>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="grid h-36 w-full place-items-center overflow-hidden rounded-xl border border-line bg-sunken p-2 lg:w-36">
                {
                  subCategoryData.image ? (
                    <img
                      alt='subCategory'
                      src={subCategoryData.image}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-fg-faint">
                      <HiOutlinePhoto size={26} />
                      <span className="text-xs">No image</span>
                    </span>
                  )
                }
              </div>
              <label htmlFor='uploadSubCategoryImage' className="btn-outline cursor-pointer">
                {loading ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className="label">Categories</label>

            {
              subCategoryData.category[0] && (
                <div className="flex flex-wrap gap-2">
                  {
                    subCategoryData.category.map((cat) => (
                      <span key={cat._id + "selectedValue"} className="chip-brand pr-1">
                        {cat.name}
                        <button
                          type="button"
                          aria-label={`Remove ${cat.name}`}
                          className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-brand hover:text-brand-on"
                          onClick={() => handleRemoveCategorySelected(cat._id)}
                        >
                          <HiXMark size={13} />
                        </button>
                      </span>
                    ))
                  }
                </div>
              )
            }

            <select
              className="select"
              value=""
              onChange={(e) => {
                const value = e.target.value
                const categoryDetails = allCategory.find(el => el._id == value)

                setSubCategoryData((preve) => {
                  return {
                    ...preve,
                    category: [...preve.category, categoryDetails]
                  }
                })
              }}
            >
              <option value={""}>Select a category</option>
              {
                allCategory.map((category) => (
                  <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                ))
              }
            </select>
          </div>

          <button
            disabled={!(subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0])}
            className="btn-primary btn-block mt-2"
          >
            Create sub category
          </button>
        </form>
      </div>
    </section>
  )
}

export default UploadSubCategoryModel
