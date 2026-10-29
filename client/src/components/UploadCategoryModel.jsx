import React, { useState } from 'react'
import { HiXMark, HiOutlinePhoto } from 'react-icons/hi2'
import uploadImage from '../utils/UploadImage'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const UploadCategoryModel = ({ close, fetchData }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        image: ""
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addCategory,
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
        } finally {
            setLoading(false)
        }
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        setLoading(true)
        const ImageUrl = await uploadImage(file)

        setData((prev) => {
            return {
                ...prev,
                image: ImageUrl.data.data.url
            }
        })
        setLoading(false)
    }

    return (
        <section className="overlay flex items-center justify-center p-4">
            <div className="modal max-w-2xl">
                <div className="modal-head">
                    <div>
                        <p className="eyebrow">Store admin</p>
                        <h2 className="mt-1 font-display text-base font-semibold">New category</h2>
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
                            placeholder="e.g. Dairy & eggs"
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
                                {loading ? "Uploading..." : "Upload image"}
                                <input disabled={!data.name}
                                    type="file"
                                    id="uploadCategoryImage"
                                    className="hidden"
                                    name="image"
                                    onChange={handleUploadImage}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-fg-faint">Name the category first, then upload its artwork.</p>
                    </div>

                    <button disabled={!(data.name && data.image)} className="btn-primary btn-block mt-2">Add category</button>
                </form>
            </div>
        </section>
    )
}

export default UploadCategoryModel
