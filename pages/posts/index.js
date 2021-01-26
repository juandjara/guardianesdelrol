import { supabase } from '@/lib/supabase'
import useAuthGuard from '@/lib/useAuthGuard'
import { useEffect } from 'react'
import useSWR from 'swr'

export default function PostList({ data: intialData }) {
  useAuthGuard()
  const { data } = useSWR('post-list', fetcher, { intialData })

  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <main className="flex-auto">
      <h1 className="text-6xl font-bold">Post List</h1>
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
      main_image,
      section(id,name),
      game(id,name,slug),
      guest_players,
      players:users!players(display_name,avatar_type,id),
      guest_narrator,
      narrator:users!narrator(display_name,avatar_type,id)
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
  const data = await fetcher()
  console.log('intial data', data)
  return {
    props: { data },
    revalidate: 1
  }
}
