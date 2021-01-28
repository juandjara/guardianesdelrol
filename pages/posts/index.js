import PostCard from '@/components/PostCard'
import Spinner from '@/components/Spinner'
import useAuthGuard from '@/lib/useAuthGuard'
import usePosts, { fetchPosts } from '@/lib/usePosts'
import { useEffect, useRef } from 'react'

export default function PostList({ initialPosts, count }) {
  useAuthGuard()
  const loaderRef = useRef(null)
  const { data, loading, page, setPage } = usePosts(initialPosts)
  const currentCount = data.reduce((acum, next) => acum + next.length, 0)
  const needsMore = currentCount < count

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      if (target.isIntersecting && !loading && needsMore) {
        setPage(page + 1)
      }
    }

    const observer = new IntersectionObserver(callback, { threshold: 0.25 })
    const node = loaderRef?.current
    if (node) {
      observer.observe(node)
    }

    return () => observer.unobserve(node)
  }, [loaderRef, loading, needsMore, page, setPage])

  return (
    <main className="flex-auto container mx-auto p-3">
      {/* <h1 className="text-2xl font-bold">Partidas</h1> */}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {(data || []).flat().map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {needsMore && (
          <div ref={loaderRef}>
            <Spinner size={8} color="white" />
          </div>
        )}
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const posts = await fetchPosts('with-count')
  console.log(posts)
  return {
    props: { initialPosts: posts.rows, count: posts.count },
    revalidate: 1
  }
}
