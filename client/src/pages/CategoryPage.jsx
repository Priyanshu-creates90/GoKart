import React, { useState, useEffect } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import EditCategory from '../components/EditCategory'
import { toast } from 'react-hot-toast'
import ConfirmBox from '../components/ConfirmBox'
import AxiosToastError from '../utils/AxiosToastError'
import { HiPlus, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [editData, setEditData] = useState({
        name: "",
        image: ""
    })
    const [openConfirmBox, setOpenConfirmBox] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    });

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBox(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }

        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    return (
        <section className="grid gap-4">
            <div className="panel-head rounded-card border border-line bg-surface">
                <div>
                    <p className="eyebrow">Store admin</p>
                    <h1 className="mt-1 font-display text-lg font-semibold">Categories</h1>
                </div>
                <div className="flex items-center gap-3">
                    {loading && <Loading className="text-brand" />}
                    <button onClick={() => { setOpenUploadCategory(true) }} className="btn-primary btn-sm">
                        <HiPlus size={15} />
                        Add category
                    </button>
                </div>
            </div>

            {
                !categoryData[0] && !loading && (
                    <div className="panel">
                        <NoData title="No categories yet" message="Add your first category to start organising the store." />
                    </div>
                )
            }

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {
                    categoryData.map((category) => {
                        return (
                            <div className="card overflow-hidden" key={category._id}>
                                <div className="aspect-square w-full bg-sunken p-3">
                                    <img
                                        alt={category.name}
                                        src={category.image}
                                        loading="lazy"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="grid gap-3 p-3">
                                    <p className="line-clamp-1 text-sm font-medium text-fg">{category.name}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setOpenEdit(true)
                                                setEditData(category)
                                            }}
                                            className="btn-outline btn-sm flex-1"
                                        >
                                            <HiOutlinePencilSquare size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpenConfirmBox(true)
                                                setDeleteCategory(category)
                                            }}
                                            aria-label={`Delete ${category.name}`}
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-critical hover:bg-critical-soft hover:text-critical"
                                        >
                                            <HiOutlineTrash size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                openUploadCategory && (
                    <UploadCategoryModel close={() => { setOpenUploadCategory(false) }} fetchData={fetchCategory} />
                )
            }

            {
                openEdit && (
                    <EditCategory data={editData} close={() => { setOpenEdit(false) }} fetchData={fetchCategory} />
                )
            }

            {
                openConfirmBox && (
                    <ConfirmBox
                        close={() => setOpenConfirmBox(false)}
                        cancel={() => setOpenConfirmBox(false)}
                        confirm={handleDeleteCategory}
                        title="Delete category"
                        message="Products and sub categories using this category will block the delete."
                    />
                )
            }
        </section>
    )
}

export default CategoryPage
