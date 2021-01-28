import PostCard from '@/components/PostCard'
import { supabase } from '@/lib/supabase'
import useAuthGuard from '@/lib/useAuthGuard'
import { useEffect, useRef } from 'react'
import { useSWRInfinite } from 'swr'

const RPP = 10
// 0-based pagination
async function fetcher(key, page = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      name,
      slug,
      tags,
      seats,
      date,
      time,
      type,
      image,
      section(id,name),
      game(id,name,slug),
      guest_players,
      players:users!players(id,email,display_name,avatarType:avatar_type),
      guest_narrator,
      narrator:users!narrator(id,email,display_name,avatarType:avatar_type)
      `
    )
    .order('date.desc.nullsfirst,time.desc.nullsfirst,id', { ascending: false, nullsFirst: true })
    .range(page * RPP, (page + 1) * RPP - 1)
  if (error) {
    console.error(error)
    throw error
  }

  return data
}

function getNextPage(page, prevData) {
  if (prevData && !prevData.length) {
    return null
  }
  if (page === 0) {
    return ['post-list', null]
  }

  return ['post-list', page]
}

export default function PostList({ initialPosts }) {
  useAuthGuard()
  const loaderRef = useRef(null)
  const { data, isValidating: loading, size: page, setSize: setPage } = useSWRInfinite(
    getNextPage,
    fetcher,
    { initialData: [initialPosts] }
  )

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
  const posts = await fetcher(null, 0)
  return {
    props: { initialPosts: posts },
    revalidate: 1
  }
}
