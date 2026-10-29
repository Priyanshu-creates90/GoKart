import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { HiOutlineTruck, HiOutlineBanknotes, HiOutlineSquares2X2, HiArrowRight } from 'react-icons/hi2'

const promises = [
  {
    icon: HiOutlineTruck,
    title: 'Same-day delivery',
    copy: 'Order before 6pm and it lands on your doorstep today.',
  },
  {
    icon: HiOutlineBanknotes,
    title: 'Honest pricing',
    copy: 'One fair price per item. No inflated MRPs, no fake discounts.',
  },
  {
    icon: HiOutlineSquares2X2,
    title: '5,000+ everyday items',
    copy: 'Pantry staples, fresh produce and household basics in one cart.',
  },
]

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })

    if (!subcategory) return

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

    navigate(url)
  }

  return (
    <div className="bg-ground">

      {/***** hero *****/}
      <section className="container mx-auto pt-6 lg:pt-10">
        <div className="grid overflow-hidden rounded-card border border-line bg-ink-grade shadow-lift lg:grid-cols-[1.05fr,1fr]">

          <div className="relative flex flex-col justify-center gap-6 p-8 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl"
            />
            <div className="relative">
              <span className="chip border-white/15 bg-white/10 text-ink-100">Fresh stock, every morning</span>
              <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] text-ink-50 text-balance lg:text-5xl">
                The weekly shop,
                <span className="block text-brand">without the scramble.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-200 lg:text-base">
                Groceries picked the way you would pick them yourself — then delivered
                the same day, at a price that stays honest.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-3">
              <Link to="/search" className="btn-primary btn-lg">
                Browse the aisles
                <HiArrowRight size={17} />
              </Link>
              <Link to="/register" className="btn-outline btn-lg border-white/20 text-ink-50 hover:bg-white/10 hover:text-brand">
                Create an account
              </Link>
            </div>

            <dl className="relative mt-2 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[['5k+', 'Products'], ['24 hr', 'Delivery window'], ['0₹', 'Delivery fee']].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-xl font-semibold text-brand">{value}</dt>
                  <dd className="mt-0.5 text-xs text-ink-300">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-h-[220px] overflow-hidden lg:min-h-[420px]">
            <img
              src={banner}
              alt=""
              className="hidden h-full w-full object-cover lg:block"
            />
            <img
              src={bannerMobile}
              alt=""
              className="h-full w-full object-cover lg:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent lg:bg-gradient-to-r lg:from-ink-800 lg:via-ink-900/20 lg:to-transparent"
            />
          </div>
        </div>
      </section>

      {/***** categories *****/}
      <section className="container mx-auto pt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by aisle</p>
            <h2 className="section-title mt-1">Categories</h2>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {
            loadingCategory ? (
              new Array(16).fill(null).map((c, index) => (
                <div key={index + "loadingcategory"} className="card grid gap-2 p-3">
                  <div className="skeleton aspect-square w-full" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              ))
            ) : (
              categoryData.map((cat) => (
                <button
                  key={cat._id + "displayCategory"}
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  className="card card-hover group grid gap-2 p-3 text-left"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-sunken p-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="line-clamp-2 text-center text-xs font-medium leading-tight text-fg-muted transition-colors group-hover:text-brand">
                    {cat.name}
                  </p>
                </button>
              ))
            )
          }
        </div>
      </section>

      {/***** category-wise products *****/}
      <div className="pb-4">
        {
          categoryData?.map((c) => {
            return (
              <CategoryWiseProductDisplay
                key={c?._id + "CategorywiseProduct"}
                id={c?._id}
                name={c?.name}
              />
            )
          })
        }
      </div>

      {/***** promises *****/}
      <section className="container mx-auto py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {
            promises.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="card flex gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon size={21} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-fg">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{copy}</p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  )
}

export default Home
