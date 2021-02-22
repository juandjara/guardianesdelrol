import useSWR from 'swr'
import { supabase } from '@/lib/data/supabase'

export const DEFAULT_RPP = 15

export async function fetchPosts(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const q = params.q || ''

  const { count, data: rows, error } = await supabase
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
      place,
      place_link,
      section(id,name),
      game(id,name,slug),
      players,
      narrator
      `,
      { count: 'exact' }
    )
    .filter('name', 'ilike', `%${q}%`)
    .order('date.desc.nullsfirst,time.desc.nullsfirst,id', { ascending: false, nullsFirst: true })
    .range(page * rpp, (page + 1) * rpp - 1)

  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function usePosts(query) {
  const key = `post-list?${query || ''}`
  const { data, error } = useSWR(key, fetchPosts)

  return {
    posts: data?.rows || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  }
}
