import PostCard from '@/components/PostCard'
import Spinner from '@/components/Spinner'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import usePosts from '@/lib/data/usePosts'
import { useEffect, useRef, useState } from 'react'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import SearchIcon from '@/components/icons/SearchIcon'
import FilterIcon from '@/components/icons/FilterIcon'
import AddIcon from '@/components/icons/AddIcon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FiltersPanel from '@/components/FiltersPanel'
import CloseIcon from '@/components/icons/CloseIcon'

function ScrollToTopButton() {
  const scrollToTopNode = useRef(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      setShowScrollToTop(!target.isIntersecting)
    }
    const observer = new IntersectionObserver(callback)
    const node = scrollToTopNode?.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) observer.unobserve(node)
      observer.disconnect()
    }
  }, [scrollToTopNode])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={scrollToTopNode} className="absolute top-0 right-0 h-screen w-1">
      <Button
        small
        hasIcon="only"
        className={`fixed bottom-4 right-4 rounded-full transition-opacity ${
          showScrollToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        background="bg-red-500 hover:bg-red-400"
        color="text-white"
        border="border-none"
        onClick={scrollToTop}>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </Button>
    </div>
  )
}

function SearchBox({ route }) {
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

function PostListHeader({ count }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <>
      <FiltersPanel open={filtersOpen} setOpen={setFiltersOpen} />
      <header className="relative flex items-end">
        <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
          {count && <Tag color="red">{count}</Tag>}
          <span>Partidas</span>
        </h1>
        <div className="flex-grow"></div>
        <SearchBox route="/posts" />
        <Button
          small
          hasIcon="only"
          className="my-1 mr-2"
          background="bg-red-900 hover:bg-red-700"
          color="text-white"
          border="border-none"
          onClick={() => setFiltersOpen(true)}>
          <FilterIcon className="md:ml-1" width={20} height={20} />
          <span className="md:inline hidden">Filtrar</span>
        </Button>
        <Link href="/edit/posts/new">
          <a className="hover:no-underline">
            <Button
              small
              hasIcon="left"
              className="my-1"
              background="bg-red-500 hover:bg-red-400 hover:bg-opacity-100"
              color="text-white"
              border="border-none">
              <AddIcon className="-ml-1" width={20} height={20} />
              <span>Nueva partida</span>
            </Button>
          </a>
        </Link>
      </header>
    </>
  )
}

export default function PostList() {
  useAuthGuard()
  const router = useRouter()
  const query = router.asPath.replace(router.pathname, '')
  const { data, empty, finished, loading, page, setPage } = usePosts({ query })
  const loaderNode = useRef(null)

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      if (target.isIntersecting && !loading && !finished) {
        setPage(page + 1)
      }
    }

    const observer = new IntersectionObserver(callback, { threshold: 0.25 })
    const node = loaderNode?.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) observer.unobserve(node)
      observer.disconnect()
    }
  }, [loaderNode, loading, finished, page, setPage])

  const posts = data && data.filter(Boolean).flatMap(d => d.rows)
  const count = data && data[0]?.count

  return (
    <main className="flex-auto container mx-auto p-3">
      <PostListHeader count={count} />
      {empty && <p className="text-gray-200 text-base">No hay partidas para estos filtros</p>}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {posts && posts.map(post => <PostCard key={post.id} post={post} />)}
        {!finished && (
          <>
            <PostCard />
            <PostCard />
            <PostCard />
            <div ref={loaderNode}>
              <Spinner size={8} color="white" />
            </div>
          </>
        )}
      </ul>
      <ScrollToTopButton />
    </main>
  )
}

// export async function getStaticProps() {
//   const page = await fetchPosts()
//   return {
//     props: { initialPage: page },
//     revalidate: 1
//   }
// }
