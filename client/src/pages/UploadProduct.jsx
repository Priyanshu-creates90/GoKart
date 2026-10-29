import React, { useState } from 'react'
import { HiOutlineCloudArrowUp, HiOutlineTrash, HiXMark, HiPlus } from 'react-icons/hi2'
import Loading from '../components/Loading'
import uploadImage from '../utils/UploadImage'
import ViewImage from '../components/ViewImage'
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert'

const UploadProduct = () => {
  const [data, setData] = useState({
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
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSubSelectCategory] = useState("")
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
        ...SummaryApi.createProduct,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
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
    <section className="grid gap-4">
      <div className="panel-head rounded-card border border-line bg-surface">
        <div>
          <p className="eyebrow">Store admin</p>
          <h1 className="mt-1 font-display text-lg font-semibold">Upload product</h1>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>

        {/***** basics *****/}
        <div className="panel">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Basics</h2>
          </div>
          <div className="grid gap-4 p-5">
            <div className="grid gap-1.5">
              <label htmlFor='name' className="label">Name</label>
              <input
                id='name'
                type="text"
                placeholder='e.g. Cold pressed groundnut oil'
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
                placeholder='What makes this product worth buying?'
                name='description'
                value={data.description}
                onChange={handleChange}
                required
                rows={4}
                className="input resize-none"
              />
            </div>
          </div>
        </div>

        {/***** media *****/}
        <div className="panel">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Images</h2>
            <span className="chip">{data.image.length} uploaded</span>
          </div>

          <div className="grid gap-4 p-5">
            <label
              htmlFor='productImage'
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-sunken text-fg-muted transition-colors hover:border-brand hover:text-brand"
            >
              {
                imageLoading ? <Loading label="Uploading" /> : (
                  <>
                    <HiOutlineCloudArrowUp size={30} />
                    <span className="text-sm font-medium">Click to upload an image</span>
                    <span className="text-xs text-fg-faint">PNG or JPG, one at a time</span>
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
                        <div key={img + index} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-line bg-sunken p-1.5">
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
                            className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-critical text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>

        {/***** taxonomy *****/}
        <div className="panel">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Placement</h2>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
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
                      category: [...preve.category, category]
                    }
                  })
                  setSelectCategory("")
                }}
              >
                <option value={""}>Select category</option>
                {
                  allCategory.map((c) => (
                    <option key={c._id + "cat"} value={c._id}>{c.name}</option>
                  ))
                }
              </select>

              <div className="flex flex-wrap gap-2">
                {
                  data.category.map((c, index) => (
                    <span key={c._id + index + "category"} className="chip-brand pr-1">
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
                  setSubSelectCategory("")
                }}
              >
                <option value={""}>Select sub category</option>
                {
                  allSubCategory.map((c) => (
                    <option key={c._id + "subcat"} value={c._id}>{c.name}</option>
                  ))
                }
              </select>

              <div className="flex flex-wrap gap-2">
                {
                  data.subCategory.map((c, index) => (
                    <span key={c._id + index + "subcategory"} className="chip-brand pr-1">
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
        </div>

        {/***** pricing *****/}
        <div className="panel">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Pricing & stock</h2>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-1.5">
              <label htmlFor='unit' className="label">Unit</label>
              <input
                id='unit'
                type='text'
                placeholder='e.g. 1 litre'
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
                placeholder='0'
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
                placeholder='0'
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
                placeholder='0'
                name='discount'
                value={data.discount}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>
        </div>

        {/***** custom fields *****/}
        <div className="panel">
          <div className="panel-head">
            <h2 className="font-display text-sm font-semibold">Extra details</h2>
            <button type="button" onClick={() => setOpenAddField(true)} className="btn-ghost btn-sm text-brand hover:bg-brand-soft">
              <HiPlus size={15} />
              Add field
            </button>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {
              Object?.keys(data?.more_details)?.length === 0 && (
                <p className="text-sm text-fg-faint sm:col-span-2">
                  Nothing extra yet — add fields like “Shelf life” or “Country of origin”.
                </p>
              )
            }
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

        <button className="btn-primary btn-lg w-full sm:ml-auto sm:w-fit sm:min-w-52">
          Publish product
        </button>
      </form>

      {
        ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => { setViewImageURL("") }} />
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

export default UploadProduct
