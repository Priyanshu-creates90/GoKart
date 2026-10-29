import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardLoading from '../components/CardLoading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryParts = params.category.split("-")
  const categoryName = categoryParts.slice(0, categoryParts.length - 1).join(" ")
  const categoryId = categoryParts.slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]


  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className="container mx-auto py-6">

      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-fg-faint">
        <Link to="/" className="transition-colors hover:text-brand">Home</Link>
        <span>/</span>
        <span className="capitalize">{categoryName}</span>
        <span>/</span>
        <span className="font-medium capitalize text-fg">{subCategoryName}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[260px,1fr]">

        {/***** sub category rail *****/}
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div className="panel h-full overflow-hidden">
            <p className="eyebrow border-b border-line px-4 py-3">In this aisle</p>
            <div className="grid max-h-[22vh] gap-1 overflow-y-auto scrollbar-slim p-2 lg:max-h-[calc(100%-3rem)]">
              {
                DisplaySubCatory.map((s) => {
                  const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
                  const active = subCategoryId === s._id

                  return (
                    <Link
                      key={s._id + "subcategoryRail"}
                      to={link}
                      className={`flex items-center gap-3 rounded-xl p-2 transition-colors
                        ${active
                          ? "bg-brand-soft text-brand ring-1 ring-brand/40"
                          : "text-fg-muted hover:bg-sunken hover:text-fg"}`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface p-1">
                        <img
                          src={s.image}
                          alt={s.name}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <span className="text-sm font-medium leading-tight">{s.name}</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </aside>

        {/***** products *****/}
        <div>
          <div className="panel mb-4 flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <h1 className="font-display text-lg font-semibold capitalize">{subCategoryName}</h1>
              <p className="text-xs text-fg-faint">{totalPage} product{totalPage === 1 ? '' : 's'}</p>
            </div>
            {loading && <Loading className="text-brand" />}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {
              data.map((p, index) => (
                <CardProduct
                  data={p}
                  key={p._id + "productSubCategory" + index}
                />
              ))
            }

            {
              loading && !data[0] && (
                new Array(8).fill(null).map((_, index) => (
                  <CardLoading key={"productListLoading" + index} />
                ))
              )
            }
          </div>

          {
            !loading && !data[0] && (
              <div className="panel p-12 text-center">
                <p className="font-display text-lg font-semibold">No products here yet</p>
                <p className="mt-1 text-sm text-fg-muted">Try another aisle from the list.</p>
              </div>
            )
          }
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
