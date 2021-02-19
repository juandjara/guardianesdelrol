import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import CloseIcon from './icons/CloseIcon'
import SearchIcon from './icons/SearchIcon'

export default function SearchBox({ route }) {
  const router = useRouter()
  const query = new URLSearchParams(router.asPath.split('?')[1] || '').get('q')
  const inputNode = useRef(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(query)

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

  function applySearch(ev) {
    ev.preventDefault()
    if (search) {
      router.push({
        pathname: route,
        query: {
          q: search
        }
      })
    } else {
      router.push(route)
    }
  }

  function clearSearch() {
    setSearch('')
    if (inputNode.current) {
      inputNode.current.focus()
    }
  }

  return (
    <div className="md:relative">
      <Button
        small
        hasIcon="only"
        className={`my-1 mr-2 ${open ? 'invisible' : 'visible'}`}
        background="bg-red-900 hover:bg-red-700"
        color="text-white"
        border="border-none"
        onClick={() => setOpen(true)}>
        <SearchIcon className="md:ml-1" width={20} height={20} />
        <span className="md:inline hidden">B&uacute;squeda</span>
      </Button>
      <form
        onSubmit={applySearch}
        className={`w-full md:w-auto md:mr-2 flex items-center absolute top-0 bottom-0 right-0 transform md:origin-right transition-transform ${
          open ? 'scale-x-100 visible' : 'scale-x-0 invisible'
        }`}>
        <SearchIcon className="absolute left-2 z-10" width={20} height={20} />
        <input
          ref={inputNode}
          type="search"
          name="posts-search"
          value={search}
          onChange={ev => setSearch(ev.target.value)}
          placeholder="Busca y pulsa enter"
          className="w-full md:w-64 bg-red-900 h-8 pl-9 pr-9 text-base placeholder-gray-200 placeholder-opacity-50 border-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
        />
        {search && (
          <Button
            small
            hasIcon="only"
            className="absolute right-0 z-10"
            border="border-none"
            color="text-white opacity-50 hover:opacity-100"
            background="bg-transparent"
            onClick={clearSearch}>
            <CloseIcon width={20} height={20} />
          </Button>
        )}
        <input type="submit" hidden />
      </form>
    </div>
  )
}
