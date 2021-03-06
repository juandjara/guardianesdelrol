import useLocalStorage from '@/lib/useLocalStorage'
import { useQueryParams } from '@/lib/useQueryParams'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import ClockIcon from './icons/ClockIcon'
import CloseIcon from './icons/CloseIcon'
import SearchIcon from './icons/SearchIcon'

export default function SearchBox({ route }) {
  const router = useRouter()
  const { params } = useQueryParams()
  const query = params.q || ''
  const inputNode = useRef(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(query)
  const searchKey = `recent-searches-${route}`
  const [recentSearches, setRecentSearches] = useLocalStorage(searchKey, [])

  useEffect(() => {
    setSearch(query)
  }, [query])

  useEffect(() => {
    function handler(ev) {
      const wrapper = inputNode.current.parentElement
      if (!wrapper.contains(ev.target)) {
        setOpen(false)
      }
    }

    if (open && inputNode.current) {
      inputNode.current.focus()
      document.addEventListener('pointerdown', handler)
    }

    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  function applySearch(search, ev) {
    if (ev) {
      ev.preventDefault()
    }
    setOpen(false)
    if (search) {
      if (recentSearches.indexOf(search) === -1) {
        const newRecent = [search, ...recentSearches].slice(0, 5)
        setRecentSearches(newRecent)
      }
      router.push({
        pathname: route,
        query: {
          ...router.query,
          q: search
        }
      })
    } else {
      router.push({
        pathname: route,
        query: {
          ...router.query,
          q: undefined
        }
      })
    }
  }

  function clearSearch() {
    setSearch('')
    applySearch(null)
  }

  function removeRecent(q) {
    setRecentSearches(recentSearches.filter(s => s !== q))
  }

  return (
    <div className="md:relative">
      <Button
        small
        hasIcon="only"
        className={`my-1 mr-2 relative ${open ? 'invisible' : 'visible'}`}
        background="bg-red-900 hover:bg-red-700"
        color="text-white"
        border="border-none"
        onClick={() => setOpen(true)}>
        <SearchIcon width={20} height={20} />
        <span className="md:inline hidden">B&uacute;squeda</span>
        {search && (
          <span className="flex h-2 w-2 absolute -top-1 -right-1 rounded-full bg-red-200"></span>
        )}
      </Button>
      <form
        onSubmit={ev => applySearch(search, ev)}
        className={`z-20 w-full md:w-auto md:mr-2 flex items-center absolute top-0 bottom-0 right-0 transform md:origin-right transition-transform ${
          open ? 'scale-x-100 visible' : 'scale-x-0 invisible'
        }`}>
        <SearchIcon className="text-gray-200 opacity-75 absolute left-2" width={20} height={20} />
        <input
          ref={inputNode}
          type="search"
          name="posts-search"
          value={search}
          onChange={ev => setSearch(ev.target.value)}
          placeholder="Busca y pulsa enter"
          className="w-full md:w-64 bg-red-900 h-8 pl-9 pr-9 text-base placeholder-gray-200 placeholder-opacity-50 border-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
        />
        <Button
          small
          hasIcon="only"
          type="button"
          className="absolute right-0"
          border="border-none"
          color="text-white opacity-50 hover:opacity-100"
          background="bg-transparent"
          onClick={clearSearch}>
          <CloseIcon width={20} height={20} />
        </Button>
        <input type="submit" hidden />
        {recentSearches.length ? (
          <div className="absolute w-full top-full rounded-md bg-red-900">
            <p className="text-xs text-gray-300 uppercase tracking-wider p-2 pt-3">
              B&uacute;squedas recientes
            </p>
            <ul>
              {recentSearches.map(q => (
                <li key={q} className="px-2 py-2 flex items-center">
                  <ClockIcon
                    className="text-gray-300 opacity-75 flex-shrink-0"
                    height={20}
                    width={20}
                  />
                  <Link href={`${route}?q=${q}`}>
                    <a className="ml-2 flex-grow">{q}</a>
                  </Link>
                  <Button
                    small
                    hasIcon="only"
                    type="button"
                    className="-mr-1"
                    border="border-none"
                    color="text-white opacity-50 hover:opacity-100"
                    background="bg-transparent"
                    onClick={() => removeRecent(q)}>
                    <CloseIcon width={20} height={20} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </form>
    </div>
  )
}
