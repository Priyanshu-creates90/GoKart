import React, { useState, useEffect } from 'react'
import { HiOutlineMagnifyingGlass, HiArrowLeft } from "react-icons/hi2";
import { TypeAnimation } from 'react-type-animation';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMobile } from '../hooks/useMobile';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const params = useLocation()
  const searchText = params.search.slice(3)

  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const isSearch = location.pathname === '/search';
    setIsSearch(isSearch);
  }, [location])

  const redirectToSearchPage = () => {
    navigate('/search');
  }

  const handleOnChange = (e) => {
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url)
  }

  return (
    <div className="group flex h-11 w-full items-center gap-2 rounded-pill border border-white/10 bg-white/10 px-2 text-ink-100 backdrop-blur transition-colors duration-200 focus-within:border-brand/70 focus-within:bg-white/[0.14] lg:h-12">
      {
        (isMobile && isSearch) ? (
          <Link to={"/"} aria-label="Back" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-ink-50">
            <HiArrowLeft size={18} />
          </Link>
        ) : (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-200 transition-colors group-focus-within:text-brand">
            <HiOutlineMagnifyingGlass size={20} />
          </span>
        )
      }

      <div className="flex h-full w-full items-center">
        {
          !isSearch ? (
            <div onClick={redirectToSearchPage} className="w-full cursor-text text-sm text-ink-200">
              <TypeAnimation
                sequence={[
                  'Search "cold pressed oil"',
                  1200,
                  'Search "sourdough"',
                  1200,
                  'Search "paneer"',
                  1200,
                  'Search "alphonso mango"',
                  1200,
                  'Search "filter coffee"',
                  1200,
                  'Search "basmati rice"',
                  1200,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ fontSize: '0.875rem', display: 'inline-block' }}
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search the aisles"
              autoFocus
              defaultValue={searchText}
              className="h-full w-full bg-transparent text-sm text-ink-50 placeholder:text-ink-300 outline-none"
              onChange={handleOnChange}
            />
          )
        }
      </div>
    </div>
  )
}

export default Search
