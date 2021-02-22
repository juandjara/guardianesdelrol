import useSWR from 'swr'
import { supabase } from '@/lib/data/supabase'

export const DEFAULT_RPP = 20

export async function fetchGames(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const q = params.q || ''

  const { count, data: rows, error } = await supabase
    .from('games')
    .select(
      `
      id,
      name,
      slug,
      tags,
      posts(id,slug,name,image),
      post_count
      `,
      { count: 'exact' }
    )
    .filter('name', 'ilike', `%${q}%`)
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })
    .order('post_count.desc.nullsfirst,slug', { ascending: false, nullsFirst: true })
    .range(page * rpp, (page + 1) * rpp - 1)

  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function useGames(query) {
  const key = `games-list?${query || ''}`
  const { data, error } = useSWR(key, fetchGames)

  return {
    games: data?.rows || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  }
}
