import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  return (
    <section className="container mx-auto py-6">
      <div className="mb-5">
        <p className="eyebrow">Search</p>
        <h1 className="section-title mt-1">
          {
            searchText
              ? <>Results for <span className="text-brand">“{decodeURIComponent(searchText)}”</span></>
              : "Everything in store"
          }
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{data.length} product{data.length === 1 ? '' : 's'} found</p>
      </div>

      <InfiniteScroll
        dataLength={data.length}
        hasMore={true}
        next={handleFetchMore}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {
            data.map((p, index) => (
              <CardProduct data={p} key={p?._id + "searchProduct" + index} />
            ))
          }

          {
            loading && (
              loadingArrayCard.map((_, index) => (
                <CardLoading key={"loadingsearchpage" + index} />
              ))
            )
          }
        </div>
      </InfiniteScroll>

      {
        !data[0] && !loading && (
          <div className="panel mx-auto mt-6 flex max-w-md flex-col items-center gap-4 p-10 text-center">
            <img
              src={noDataImage}
              alt=""
              className="w-48 max-w-full object-contain"
            />
            <div>
              <p className="font-display text-lg font-semibold">No matches</p>
              <p className="mt-1 text-sm text-fg-muted">Try a shorter word, or check the spelling.</p>
            </div>
          </div>
        )
      }
    </section>
  )
}

export default SearchPage
