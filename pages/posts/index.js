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
      <header className="flex items-end">
        <h1 className="flex items-center text-xl font-medium tracking-wide space-x-3">
          {count && <Tag color="red">{count}</Tag>}
          <span>Partidas</span>
        </h1>
        <div className="flex-grow"></div>
        <Button
          small
          hasIcon="only"
          className="my-1 mr-2"
          background="bg-red-900 hover:bg-red-700"
          color="text-white"
          border="border-none">
          <SearchIcon className="md:ml-1" width={20} height={20} />
          <span className="md:inline hidden">B&uacute;squeda</span>
        </Button>
        <Button
          small
          hasIcon="only"
          className="my-1 mr-2"
          background="bg-red-900 hover:bg-red-700"
          color="text-white"
          border="border-none">
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
