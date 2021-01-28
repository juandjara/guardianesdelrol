import { useSWRInfinite } from 'swr'
import { supabase } from '@/lib/supabase'

const RPP = 10
// 0-based pagination
export async function fetchPosts(key, page = 0) {
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

export default function usePosts(initialData) {
  const { data, isValidating: loading, size: page, setSize: setPage } = useSWRInfinite(
    getNextPage,
    fetchPosts,
    { initialData: [initialData] }
  )

  return { data, loading, page, setPage }
}
