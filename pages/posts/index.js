import PostCard from '@/components/PostCard'
import Spinner from '@/components/Spinner'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import usePosts, { fetchPosts } from '@/lib/data/usePosts'
import { useEffect, useRef, useState } from 'react'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import SearchIcon from '@/components/icons/SearchIcon'
import FilterIcon from '@/components/icons/FilterIcon'
import AddIcon from '@/components/icons/AddIcon'
import CloseIcon from '@/components/icons/CloseIcon'

function SearchBox() {
  const [open, setOpen] = useState(false)

  const button = (
    <Button
      small
      hasIcon="only"
      className="m-1"
      background="bg-transparent hover:bg-red-100 hover:bg-opacity-50"
      color="text-white"
      border="border-none"
      onClick={() => setOpen(!open)}>
      <SearchIcon width={20} height={20} />
    </Button>
  )
  const input = (
    <div className="absolute top-0 right-4 shadow-md bg-white text-gray-400 flex items-center my-1.5 rounded-md focus-within:ring-2 focus-within:ring-red-700 focus-within:border-red-700">
      <SearchIcon className="ml-2" width={16} height={16} />
      <input
        id="search"
        type="search"
        className="h-7 px-2 text-sm rounded-md placeholder-gray-400 border-none focus:outline-none focus:ring-0"
        placeholder="Buscar partidas"
      />
      <Button
        small
        hasIcon="only"
        background="bg-transparent hover:bg-gray-100"
        color="text-gray-400"
        border="border-none"
        onClick={() => setOpen(!open)}>
        <CloseIcon width={16} height={16} />
      </Button>
    </div>
  )

  return open ? input : button
}

function PostFilters() {
  return (
    <Button
      small
      hasIcon="only"
      className="m-1"
      background="bg-transparent hover:bg-red-100 hover:bg-opacity-50"
      color="text-white"
      border="border-none">
      <FilterIcon width={20} height={20} />
    </Button>
  )
}

export default function PostList({ initialPage }) {
  useAuthGuard()
  const loaderRef = useRef(null)
  const { data, empty, finished, loading, page, setPage } = usePosts(initialPage)

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      if (target.isIntersecting && !loading && !finished) {
        setPage(page + 1)
      }
    }

    const observer = new IntersectionObserver(callback, { threshold: 0.25 })
    const node = loaderRef?.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) observer.unobserve(node)
      observer.disconnect()
    }
  }, [loaderRef, loading, finished, page, setPage])

  const posts = data && data.filter(Boolean).flatMap(d => d.rows)
  const count = data && data[0]?.count

  return (
    <main className="flex-auto container mx-auto p-3">
      <header className="rounded-lg pl-4 pr-3 -mx-3 flex items-start sticky top-0 z-10 bg-red-900 bg-opacity-75">
        <h1 className="flex h-10 items-center text-xl font-semibold space-x-2">
          {count && <Tag color="red">{count}</Tag>}
          <span>Partidas</span>
        </h1>
        <div className="flex-grow"></div>
        <PostFilters />
        <SearchBox />
      </header>
      <Button
        small
        hasIcon="left"
        className="mt-8"
        background="bg-red-500 hover:bg-red-500 bg-opacity-75 hover:bg-opacity-100"
        color="text-white"
        border="border-none">
        <AddIcon className="-ml-1" width={20} height={20} />
        <span>Nueva partida</span>
      </Button>
      {empty && <p className="text-gray-200 text-base">No hay partidas para estos filtros</p>}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {posts && posts.map(post => <PostCard key={post.id} post={post} />)}
        {!finished && (
          <div ref={loaderRef}>
            <Spinner size={8} color="white" />
          </div>
        )}
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const page = await fetchPosts()
  return {
    props: { initialPage: page },
    revalidate: 1
  }
}
