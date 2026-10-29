import React, { useState } from 'react'
import { HiOutlineCloudArrowUp, HiOutlineTrash, HiXMark, HiPlus } from 'react-icons/hi2'
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if (close) {
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })

      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="overlay flex items-start justify-center p-4">
      <div className="modal my-4 flex max-h-[92vh] w-full max-w-3xl flex-col">

        <div className="modal-head shrink-0">
          <div>
            <p className="eyebrow">Store admin</p>
            <h2 className="mt-1 font-display text-base font-semibold">Edit product</h2>
          </div>
          <button onClick={close} aria-label="Close" className="icon-btn">
            <HiXMark size={22} />
          </button>
        </div>

        <form className="grid gap-5 overflow-y-auto scrollbar-slim p-5" onSubmit={handleSubmit}>

          <div className="grid gap-1.5">
            <label htmlFor='name' className="label">Name</label>
            <input
              id='name'
              type="text"
              placeholder='Enter product name'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor='description' className="label">Description</label>
            <textarea
              id='description'
              placeholder='Enter product description'
              name='description'
              value={data.description}
              onChange={handleChange}
              required
              rows={4}
              className="input resize-none"
            />
          </div>

          <div className="grid gap-2">
            <p className="label">Images</p>
            <label
              htmlFor='productImage'
              className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-sunken text-fg-muted transition-colors hover:border-brand hover:text-brand"
            >
              {
                imageLoading ? <Loading label="Uploading" /> : (
                  <>
                    <HiOutlineCloudArrowUp size={26} />
                    <span className="text-sm font-medium">Upload another image</span>
                  </>
                )
              }
              <input
                type='file'
                id='productImage'
                className="hidden"
                accept='image/*'
                onChange={handleUploadImage}
              />
            </label>

            {
              data.image[0] && (
                <div className="flex flex-wrap gap-3">
                  {
                    data.image.map((img, index) => {
                      return (
                        <div key={img + index} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-line bg-sunken p-1.5">
                          <img
                            src={img}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full cursor-pointer object-contain"
                            onClick={() => setViewImageURL(img)}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            aria-label="Remove image"
                            className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-critical text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <HiOutlineTrash size={12} />
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid content-start gap-2">
              <label className="label">Category</label>
              <select
                className="select"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const category = allCategory.find(el => el._id === value)

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category],
                    }
                  })
                  setSelectCategory("")
                }}
              >
                <option value={""}>Select category</option>
                {
                  allCategory.map((c) => (
                    <option key={c._id + "editcat"} value={c?._id}>{c.name}</option>
                  ))
                }
              </select>

              <div className="flex flex-wrap gap-2">
                {
                  data.category.map((c, index) => (
                    <span key={c._id + index + "productsection"} className="chip-brand pr-1">
                      {c.name}
                      <button
                        type="button"
                        aria-label={`Remove ${c.name}`}
                        onClick={() => handleRemoveCategory(index)}
                        className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-brand hover:text-brand-on"
                      >
                        <HiXMark size={13} />
                      </button>
                    </span>
                  ))
                }
              </div>
            </div>

            <div className="grid content-start gap-2">
              <label className="label">Sub category</label>
              <select
                className="select"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(el => el._id === value)

                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory]
                    }
                  })
                  setSelectSubCategory("")
                }}
              >
                <option value={""}>Select sub category</option>
                {
                  allSubCategory.map((c) => (
                    <option key={c._id + "editsubcat"} value={c?._id}>{c.name}</option>
                  ))
                }
              </select>

              <div className="flex flex-wrap gap-2">
                {
                  data.subCategory.map((c, index) => (
                    <span key={c._id + index + "productsection"} className="chip-brand pr-1">
                      {c.name}
                      <button
                        type="button"
                        aria-label={`Remove ${c.name}`}
                        onClick={() => handleRemoveSubCategory(index)}
                        className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-brand hover:text-brand-on"
                      >
                        <HiXMark size={13} />
                      </button>
                    </span>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-1.5">
              <label htmlFor='unit' className="label">Unit</label>
              <input
                id='unit'
                type='text'
                placeholder='Enter product unit'
                name='unit'
                value={data.unit}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor='stock' className="label">Stock</label>
              <input
                id='stock'
                type='number'
                placeholder='Enter product stock'
                name='stock'
                value={data.stock}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor='price' className="label">Price (₹)</label>
              <input
                id='price'
                type='number'
                placeholder='Enter product price'
                name='price'
                value={data.price}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor='discount' className="label">Discount (%)</label>
              <input
                id='discount'
                type='number'
                placeholder='Enter product discount'
                name='discount'
                value={data.discount}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <p className="label">Extra details</p>
              <button type="button" onClick={() => setOpenAddField(true)} className="btn-ghost btn-sm text-brand hover:bg-brand-soft">
                <HiPlus size={15} />
                Add field
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {
                Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div className="grid gap-1.5" key={k + index}>
                      <label htmlFor={k} className="label">{k}</label>
                      <input
                        id={k}
                        type='text'
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value
                              }
                            }
                          })
                        }}
                        required
                        className="input"
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>

          <button className="btn-primary btn-block btn-lg">Save changes</button>
        </form>
      </div>

      {
        ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )
      }
    </section>
  )
}

export default EditProductAdmin
