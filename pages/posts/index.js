import PostCard from '@/components/PostCard'
import useAuthGuard from '@/lib/useAuthGuard'
import usePosts, { fetchPosts } from '@/lib/usePosts'
import { useEffect, useRef } from 'react'

export default function PostList({ initialPosts }) {
  useAuthGuard()
  const loaderRef = useRef(null)
  const { data, loading, page, setPage } = usePosts(initialPosts)

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      if (target.isIntersecting && !loading) {
        setPage(page + 1)
      }
    }

    const observer = new IntersectionObserver(callback, { threshold: 0.25 })
    const node = loaderRef?.current
    if (node) {
      observer.observe(node)
    }

    return () => observer.unobserve(node)
  }, [loaderRef, loading, page, setPage])

  return (
    <main className="flex-auto container mx-auto p-3">
      {/* <h1 className="text-2xl font-bold">Partidas</h1> */}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {(data || []).flat().map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        <div ref={loaderRef}></div>
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const posts = await fetchPosts()
  return {
    props: { initialPosts: posts },
    revalidate: 1
  }
}
