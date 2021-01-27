import PostCard from '@/components/PostCard'
import { supabase } from '@/lib/supabase'
import useAuthGuard from '@/lib/useAuthGuard'
import useSWR from 'swr'

export default function PostList({ initialPosts }) {
  useAuthGuard()
  const { data } = useSWR('post-list', fetcher, { intialData: initialPosts })

  return (
    <main className="flex-auto container mx-auto p-3">
      {/* <h1 className="text-2xl font-bold">Partidas</h1> */}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {(data || []).map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
    </main>
  )
}

async function fetcher() {
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
    .order('date', { ascending: false })
    .limit(10)
  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function getStaticProps() {
  const posts = await fetcher()
  return {
    props: { initialPosts: posts },
    revalidate: 1
  }
}
