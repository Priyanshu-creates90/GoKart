import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { HiOutlineMagnifyingGlass, HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {

    const interval = setTimeout(() => {
      fetchProductData()
    }, 300);

    return () => {
      clearTimeout(interval)
    }
  }, [search])

  return (
    <section className="grid gap-4">
      <div className="panel-head flex-col items-stretch gap-3 rounded-card border border-line bg-surface sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Store admin</p>
          <h1 className="mt-1 font-display text-lg font-semibold">Products</h1>
        </div>

        <div className="flex items-center gap-3">
          {loading && <Loading className="text-brand" />}
          <div className="input-shell w-full sm:w-64">
            <HiOutlineMagnifyingGlass size={18} className="text-fg-faint" />
            <input
              type="text"
              placeholder="Search products"
              className="input-bare"
              value={search}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>

      <div className="min-h-[60vh]">
        {
          !productData[0] && !loading ? (
            <div className="panel">
              <NoData title="No products found" message="Try a different search, or upload a new product." />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {
                productData.map((p, index) => (
                  <ProductCardAdmin key={p._id + "adminProduct" + index} data={p} fetchProductData={fetchProductData} />
                ))
              }
            </div>
          )
        }
      </div>

      <div className="flex items-center justify-between gap-4">
        <button onClick={handlePrevious} disabled={page <= 1} className="btn-outline btn-sm">
          <HiChevronLeft size={15} />
          Previous
        </button>
        <span className="text-sm tabular-nums text-fg-muted">Page {page} of {totalPageCount}</span>
        <button onClick={handleNext} disabled={page >= totalPageCount} className="btn-outline btn-sm">
          Next
          <HiChevronRight size={15} />
        </button>
      </div>
    </section>
  )
}

export default ProductAdmin
