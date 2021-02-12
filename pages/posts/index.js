import PostCard from '@/components/PostCard'
import Spinner from '@/components/Spinner'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import usePosts, { fetchPosts } from '@/lib/data/usePosts'
import { useEffect, useRef } from 'react'

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

  return (
    <main className="flex-auto container mx-auto p-3">
      {empty && (
        <p className="text-white text-lg text-center">No hay partidas para estos filtros</p>
      )}
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
