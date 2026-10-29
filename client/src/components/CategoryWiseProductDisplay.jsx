import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert.js'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
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
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 320
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 320
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? filterData : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()

    if (!loading && !data[0]) {
        return null
    }

    return (
        <section className="container mx-auto pt-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="eyebrow">Handpicked</p>
                    <h2 className="section-title mt-1">{name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Link to={redirectURL} className="btn-ghost text-sm text-brand hover:bg-brand-soft">
                        See all
                    </Link>
                    <div className="hidden items-center gap-2 lg:flex">
                        <button
                            onClick={handleScrollLeft}
                            aria-label="Scroll left"
                            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-brand hover:text-brand"
                        >
                            <HiChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleScrollRight}
                            aria-label="Scroll right"
                            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-brand hover:text-brand"
                        >
                            <HiChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={containerRef}
                className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-none pb-2"
            >
                {
                    loading &&
                    loadingCardNumber.map((_, index) => (
                        <div key={"CategorywiseProductDisplay123" + index} className="snap-start">
                            <CardLoading />
                        </div>
                    ))
                }

                {
                    data.map((p, index) => (
                        <div key={p._id + "CategorywiseProductDisplay" + index} className="snap-start">
                            <CardProduct data={p} />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default CategoryWiseProductDisplay
