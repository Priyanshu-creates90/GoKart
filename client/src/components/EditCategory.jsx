import React, { useState } from 'react'
import { HiXMark, HiOutlinePhoto } from 'react-icons/hi2'
import uploadImage from '../utils/UploadImage'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const EditCategory = ({ data: CategoryData, close, fetchData }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        setLoading(true)
        const ImageUrl = await uploadImage(file)

        setLoading(false)

        setData((prev) => {
            return {
                ...prev,
                image: ImageUrl.data.data.url
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: data
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="overlay flex items-center justify-center p-4">
            <div className="modal max-w-2xl">
                <div className="modal-head">
                    <div>
                        <p className="eyebrow">Store admin</p>
                        <h2 className="mt-1 font-display text-base font-semibold">Update category</h2>
                    </div>
                    <button onClick={close} aria-label="Close" className="icon-btn">
                        <HiXMark size={22} />
                    </button>
                </div>

                <form className="grid gap-4 p-5" onSubmit={handleSubmit}>
                    <div className="grid gap-1.5">
                        <label htmlFor="categoryName" className="label">Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            placeholder="Enter category name"
                            value={data.name}
                            name="name"
                            onChange={handleOnChange}
                            required
                            className="input"
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <p className="label">Image</p>
                        <div className="flex flex-col items-center gap-4 lg:flex-row">
                            <div className="grid h-36 w-full place-items-center overflow-hidden rounded-xl border border-line bg-sunken p-2 lg:w-36">
                                {
                                    data.image ? (
                                        <img
                                            src={data.image}
                                            alt={data.name}
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

                            <label htmlFor="uploadCategoryImage" className={`${!data.name ? "pointer-events-none opacity-50" : "cursor-pointer"} btn-outline`}>
                                {loading ? "Uploading..." : "Replace image"}
                                <input disabled={!data.name}
                                    type="file"
                                    id="uploadCategoryImage"
                                    className="hidden"
                                    name="image"
                                    onChange={handleUploadImage}
                                />
                            </label>
                        </div>
                    </div>

                    <button disabled={!(data.name && data.image)} className="btn-primary btn-block mt-2">Update category</button>
                </form>
            </div>
        </section>
    )
}

export default EditCategory
