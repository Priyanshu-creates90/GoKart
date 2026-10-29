import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { HiChevronLeft, HiChevronRight, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineArrowPath } from "react-icons/hi2";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const assurances = [
  {
    icon: HiOutlineTruck,
    title: 'Same-day delivery',
    copy: 'Placed before 6pm, at your door by evening.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Quality checked',
    copy: 'Every batch inspected before it leaves the store.',
  },
  {
    icon: HiOutlineArrowPath,
    title: 'Easy returns',
    copy: 'Not right? Tell us at delivery and it goes straight back.',
  },
]

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
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
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 120
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 120
  }

  const details = (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Description</p>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{data.description}</p>
      </div>
      <div>
        <p className="eyebrow">Unit</p>
        <p className="mt-2 text-sm text-fg-muted">{data.unit}</p>
      </div>
      {
        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
          return (
            <div key={element + index}>
              <p className="eyebrow">{element}</p>
              <p className="mt-2 text-sm text-fg-muted">{data?.more_details[element]}</p>
            </div>
          )
        })
      }
    </div>
  )

  return (
    <section className="container mx-auto py-6">
      <nav className="mb-4 flex items-center gap-2 text-xs text-fg-faint">
        <Link to="/" className="transition-colors hover:text-brand">Home</Link>
        <span>/</span>
        <span className="line-clamp-1 font-medium text-fg">{data.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

        {/***** gallery *****/}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="aspect-square w-full bg-sunken p-6 lg:aspect-[4/3]">
              <img
                src={data.image[image]}
                alt={data.name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {
              data.image.map((img, index) => (
                <span
                  key={img + index + "point"}
                  className={`h-1.5 rounded-full transition-all ${index === image ? "w-6 bg-brand" : "w-1.5 bg-line-strong"}`}
                />
              ))
            }
          </div>

          <div className="relative mt-3">
            <div ref={imageContainer} className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-none">
              {
                data.image.map((img, index) => (
                  <button
                    key={img + index}
                    onClick={() => setImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-surface p-1.5 transition-colors
                      ${index === image ? "border-brand ring-1 ring-brand/40" : "border-line hover:border-brand/50"}`}
                  >
                    <img
                      src={img}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))
              }
            </div>

            {
              data.image.length > 4 && (
                <div className="pointer-events-none absolute inset-y-0 -left-3 -right-3 hidden items-center justify-between lg:flex">
                  <button onClick={handleScrollLeft} aria-label="Previous thumbnails" className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-fg-muted shadow-card hover:text-brand">
                    <HiChevronLeft size={16} />
                  </button>
                  <button onClick={handleScrollRight} aria-label="More thumbnails" className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-fg-muted shadow-card hover:text-brand">
                    <HiChevronRight size={16} />
                  </button>
                </div>
              )
            }
          </div>

          <div className="mt-8 hidden lg:block">
            {details}
          </div>
        </div>

        {/***** buy box *****/}
        <div className="grid content-start gap-6">
          <div>
            {
              Boolean(data.discount) && (
                <span className="chip-brand">{data.discount}% off</span>
              )
            }
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight lg:text-4xl">{data.name}</h1>
            <p className="mt-2 text-sm text-fg-muted">{data.unit}</p>
          </div>

          <div className="card p-5">
            <p className="eyebrow">Price</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl font-bold tabular-nums text-fg">
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </span>
              {
                data.discount ? (
                  <>
                    <span className="text-base text-fg-faint line-through">{DisplayPriceInRupees(data.price)}</span>
                    <span className="text-sm font-semibold text-positive">You save {data.discount}%</span>
                  </>
                ) : null
              }
            </div>

            <div className="mt-5">
              {
                data.stock === 0 ? (
                  <p className="chip-critical">Out of stock</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <AddToCartButton data={data} />
                    <span className="text-xs text-fg-faint">Free delivery on this order</span>
                  </div>
                )
              }
            </div>
          </div>

          <div className="grid gap-3">
            {
              assurances.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{title}</p>
                    <p className="mt-0.5 text-sm text-fg-muted">{copy}</p>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="lg:hidden">
            {details}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
